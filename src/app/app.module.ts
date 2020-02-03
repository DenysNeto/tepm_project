import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {JsonSchemaViewerModule} from './json-schema-viewer/json-schema-viewer.module';


@NgModule({
  declarations: [
    AppComponent,
 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    JsonSchemaViewerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
