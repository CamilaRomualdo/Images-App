import {Component} from '@angular/core';

import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';

import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

import {DataModel} from '../../model/data.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;

  images: Observable<DataModel[]>;
  UploadedFileURL: Observable<string>;
  isUploading: boolean;
  isUploaded: boolean;

  fileName: string;
  fileSize: number;

  private imageCollection: AngularFirestoreCollection<DataModel>;

  constructor(private storage: AngularFireStorage,
              private database: AngularFirestore) {
    this.isUploading = false;
    this.isUploaded = false;
    this.imageCollection = database.collection<DataModel>('images');
    this.images = this.imageCollection.valueChanges();
  }

  uploadImage(event: FileList) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.error('Unsupported file type: ( ');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;

    const path = `imageStorage/${new Date().getTime()}_${file.name}`;
    const customMetadata = {app: 'Images APP'};
    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file, {customMetadata});

    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
        finalize(() => {
          this.UploadedFileURL = fileRef.getDownloadURL();
          this.UploadedFileURL.subscribe(resp => {
            this.addImage({
              name: file.name,
              filepath: resp,
              size: this.fileSize
            });
            this.isUploading = false;
            this.isUploaded = true;
          }, error => {
            console.error(error);
          });
        }),
        tap(snap => {
          this.fileSize = snap.totalBytes;
        })
    );
  }

  addImage(image: DataModel) {
    const id = this.database.createId();
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log('Image Uploaded', resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }

}
