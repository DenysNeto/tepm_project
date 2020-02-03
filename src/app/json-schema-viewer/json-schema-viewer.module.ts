import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JsonSchemaComponent } from "./json-schema/json-schema.component";
import { JsonSchemaWrapperComponent } from "./json-schema-wrapper/json-schema-wrapper.component";
import { JsonSchemaViewerSecondComponent } from "./json-schema-viewer-second/json-schema-viewer-second.component";

@NgModule({
  declarations: [
    JsonSchemaComponent,
    JsonSchemaWrapperComponent,
    JsonSchemaViewerSecondComponent
  ],
  exports: [
    JsonSchemaComponent,
    JsonSchemaWrapperComponent,
    JsonSchemaViewerSecondComponent
  ],
  imports: [CommonModule],
  providers: []
})
export class JsonSchemaViewerModule {}
