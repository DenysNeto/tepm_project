import { Component, OnInit } from '@angular/core';
import { JsonSchemaService, Mapping } from '../json-schema.service';
import { IfStmt } from '@angular/compiler';

const delta_y = 30;
const translateDefault = {
  x: 0,
  y: 200
};

@Component({
  selector: 'app-json-schema-wrapper',
  templateUrl: './json-schema-wrapper.component.html',
  styleUrls: ['./json-schema-wrapper.component.css']
})
export class JsonSchemaWrapperComponent implements OnInit {
  constructor(private jsonSchemaService: JsonSchemaService) {}

  handleDeleteEvent(event, mapElement) {
    console.log('click', mapElement);
    this.jsonSchemaService.deleteMappingSubject.next(mapElement);
    this.jsonSchemaService.deleteMappingFromList(mapElement);
  }

  currentMappingElement = {};
  underlienIndex: number = -1;
  map_id: number = 0;
  svg: any;
  width = window.innerWidth;
  height = window.innerHeight;
  clientPosition = {
    clientPositionX: 0,
    clientPositionY: 0
  };

  currentDrawableLine = {
    line_id: 0,
    x_start: 0,
    y_start: 0
  };

  ngOnInit() {
    this.jsonSchemaService.underlineMappingSubject.subscribe(underlineIndex => {
      this.underlienIndex = underlineIndex;
    })

    this.jsonSchemaService.startMapping.subscribe(elem => {
      if (elem.startFieldLabel !== '') {

        this.currentMappingElement = {
          start_from: elem.isStartFromSecond ? 2 : 1,
          start_text: elem.startFieldLabel,
          start_circle_id: elem.start_id,

        };
      };
    });

    this.jsonSchemaService.finishMapping.subscribe(elem => {
      if (elem.finishFieldLabel !== '') {
        this.currentMappingElement = {
          ...this.currentMappingElement,
          end_circle_id: elem.finish_id,
          end_text: elem.finishFieldLabel,
          end_of: (this.currentMappingElement as Mapping).start_from === 2 ? 1 : 2,
          mapping_id: ++this.jsonSchemaService.currentMappingIndex
        };
        this.jsonSchemaService.addMappingToList(this.currentMappingElement as Mapping);
        this.currentMappingElement = {};
      }
    });
  }
}
