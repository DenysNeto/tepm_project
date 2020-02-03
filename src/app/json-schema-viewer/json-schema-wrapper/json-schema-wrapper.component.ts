import { Component, OnInit } from "@angular/core";
import { JsonSchemaService } from "../json-schema.service";

const delta_y = 30;

@Component({
  selector: "app-json-schema-wrapper",
  templateUrl: "./json-schema-wrapper.component.html",
  styleUrls: ["./json-schema-wrapper.component.css"]
})
export class JsonSchemaWrapperComponent implements OnInit {
  constructor(private jsonSchemaService: JsonSchemaService) { }
  line_id: number = 0;
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
  }

  ngAfterViewInit() {
    this.clientPosition.clientPositionX =
      this.jsonSchemaService.viewBoardDimensions.width * 2 +
      this.jsonSchemaService.viewBoardDimensions.margin.left +
      this.jsonSchemaService.viewBoardDimensions.margin.right;

    this.clientPosition.clientPositionY = delta_y;

  }

  ngOnInit() {
    // @ts-ignore
    this.svg = d3
      .select("#wrapper")
      .style("overflow", "visible")
      .style("z-index", 1)
      .style("x", 0)
      .style("y", 21)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height * 0.95)
      .on("click", event => {
        // @ts-ignores
        console.log("click ccc", d3.event);
      });
    this.svg.style("overflow", "visible");
    this.svg.style("y", 21);


    this.svg
      .append("rect")
      .style("z-index", 100)
      .style("overflow", "visible")
      .style("x", 0)
      .style("y", 21)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "green");

    this.svg
      .append("line")
      .style("stroke", "black")
      .attr("x1", 0)
      .attr("y1", 21)
      .attr("x2", 70)
      .attr("y2", 50);


    this.jsonSchemaService.initiateDrawLine.subscribe(elem => {
      console.log('[c] www', this.clientPosition.clientPositionX, elem.x);
      this.jsonSchemaService.isLineDrawing = true;
      this.currentDrawableLine.x_start = (-1) * (this.clientPosition.clientPositionX + 20 - elem.x);
      this.currentDrawableLine.y_start = elem.y;

      // this.svg.append("line")
      //   .style("stroke", "black")
      //   .attr('id', () => ++this.line_id)
      //   .attr("x1", (-1) * (this.clientPosition.clientPositionX + 20 - elem.x))
      //   .attr("y1", elem.y)
      // // .attr("x2", 70)
      // // .attr("y2", 50);
    });

    this.jsonSchemaService.finishDrawLine.subscribe(elem => {
      if (this.jsonSchemaService.isLineDrawing) {

        this.jsonSchemaService.setIsLineDrawing(false);


        this.svg.append("line")
          .style("stroke", "black")
          .attr('id', () => ++this.line_id)
          .attr("x1", this.currentDrawableLine.x_start)
          .attr("y1", this.currentDrawableLine.y_start)
          .attr("x2", (-1) * (this.clientPosition.clientPositionX + 20 - elem.x))
          .attr("y2", elem.y);
      }



      // this.svg.select(`line`)
      //   .attr("x2", (-1) * (this.clientPosition.clientPositionX + 20 - elem.x))
      //   .attr("y2", elem.y)





    })
  }
}
