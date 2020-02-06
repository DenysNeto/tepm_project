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
  constructor(private jsonSchemaService: JsonSchemaService) {


  }


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

    // @ts-ignore
    // this.svg = d3
    //   .select("#wrapper")
    //   .style("overflow", "visible")
    //   .style("z-index", 1)
    //   .style("x", 0)
    //   .style("y", 21)
    //   .append("svg")
    //   .attr("width", this.width)
    //   .attr("height", this.height * 0.95)
    //   .on("click", event => {
    //     // @ts-ignores
    //     console.log("click ccc", d3.event);
    //   });
    // this.svg.style("overflow", "visible");
    // this.svg.style("y", 21);


    this.jsonSchemaService.startMapping.subscribe(elem => {
      if (elem.startFieldLabel !== '') {

        this.currentMappingElement = {
          start_from: elem.isStartFromSecond ? 2 : 1,
          start_text: elem.startFieldLabel,
          start_circle_id: elem.start_id,


        };


      }
      ;


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


    //this.jsonSchemaService.finishDrawLine.subscribe(elem => {


    //add to list

    //start from
    //label_name _1 => label_name_2


    // this.jsonSchemaService.translateJson_first.subscribe(payload => {

    //   //todo add transform[1]_1

    //   if (this.jsonSchemaService.drawableLinesArr.length) {
    //     console.log('[]C', this.svg.selectAll("line"));
    //     this.svg.selectAll("line")
    //     this.jsonSchemaService.drawableLinesArr.forEach((elem: DrawableLine) => {

    //       if (elem.start_from === 2) {
    //         this.svg.selectAll("line")[0].forEach(line => {
    //           if (elem.line_id == line.id) {
    //             // @ts-ignore
    //             d3.select(line).attr("x2", () => (+line.attributes.x2.value + payload.y / 1.5))
    //             // @ts-ignore
    //             d3.select(line).attr("y2", () => +line.attributes.y2.value + payload.x / 1.5);
    //           }

    //         })

    //       }
    //       else {
    //         this.svg.selectAll("line")[0].forEach(line => {
    //           if (elem.line_id == line.id) {
    //             // @ts-ignore
    //             d3.select(line).attr("x1", () => (+line.attributes.x1.value + payload.y * 2))
    //             // @ts-ignore
    //             d3.select(line).attr("y1", () => +line.attributes.y1.value + payload.x / 1.5);
    //           }

    //         })

    //       }

    //     })
    //   }

    // });

    // this.jsonSchemaService.translateJson_second.subscribe(payload => {
    //   if (this.jsonSchemaService.drawableLinesArr.length) {
    //     console.log('[]C', this.svg.selectAll("line"));
    //     this.svg.selectAll("line")
    //     this.jsonSchemaService.drawableLinesArr.forEach((elem: DrawableLine) => {

    //       if (elem.start_from === 1) {
    //         this.svg.selectAll("line")[0].forEach(line => {
    //           if (elem.line_id == line.id) {
    //             // @ts-ignore
    //             d3.select(line).attr("x2", () => (+line.attributes.x2.value + payload.y / 1.5))
    //             // @ts-ignore
    //             d3.select(line).attr("y2", () => +line.attributes.y2.value + payload.x / 1.5);
    //           }

    //         })

    //       }
    //       else {
    //         this.svg.selectAll("line")[0].forEach(line => {
    //           if (elem.line_id == line.id) {
    //             // @ts-ignore
    //             d3.select(line).attr("x1", () => (+line.attributes.x1.value + payload.y / 1.5))
    //             // @ts-ignore
    //             d3.select(line).attr("y1", () => +line.attributes.y1.value + payload.x / 1.5);
    //           }

    //         })

    //       }

    //     })
    //   }
    // });


  }
}
