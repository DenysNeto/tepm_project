import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JsonSchemaComponent} from './json-schema/json-schema.component';



@NgModule({
  declarations: [JsonSchemaComponent],
  exports: [
    JsonSchemaComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
})
export class JsonSchemaViewerModule {
}
