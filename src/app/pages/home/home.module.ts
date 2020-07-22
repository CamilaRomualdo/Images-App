import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

import {HomePage} from './home.page';
import {HomePageRoutingModule} from './home-routing.module';

import {FileFormatPipe} from '../../pipe/file-pipe.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,

        HomePageRoutingModule,
    ],
    declarations: [
        HomePage,
        FileFormatPipe
    ]
})
export class HomePageModule {
}
