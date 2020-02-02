import { Component, OnInit, ViewChild } from "@angular/core";
// @ts-ignore

import { JsonSchemaService } from "../json-schema.service";

// @ts-ignore
let diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

@Component({
  selector: "app-json-schema",
  templateUrl: "./json-schema.component.html",
  styleUrls: ["./json-schema.component.css"]
})
export class JsonSchemaComponent implements OnInit {
  // @ts-ignore
  json = require("../testJSON.json");
  position_before: { x: number; y: number } = { x: 0, y: 0 };

  position_after: { x: number; y: number } = { x: 0, y: 0 };

  isDragged: boolean = false;
  deltaDragging: { x: number; y: number } = { x: 0, y: 0 };
  // @ts-ignore
  tree = d3.layout.tree();

  @ViewChild("btn", { static: false }) btn;
  root;
  svg;
  duration;
  margin = { top: 200, right: 10, bottom: 20, left: 0 };
  width = window.innerWidth / 2 - this.margin.right - this.margin.left;
  height = (window.innerHeight - this.margin.top - this.margin.bottom) * 0.9;
  currentScale: number = 1;

  constructor(private jsonSchemaService: JsonSchemaService) {}

  handleZoomPlus() {
    //this.currentScale += 0.25;
    // @ts-ignore
    this.zoom.scale(3);

    this.zoom.event(this.svg);
  }

  handleZoomMinus() {
    console.log("[c] zoomMinus");
    this.currentScale -= 0.25;
    this.svg.call(
      // @ts-ignore
      d3.behavior
        .zoom()
        // .extent([[0, 0], [this.width, this.height]])

        .on("zoom", d => {
          // @ts-ignore
          console.log("casd", d3.event.translate);

          this.svg.attr(
            "transform",
            "translate(" +
              d3.event.translate +
              ")scale(" +
              this.currentScale +
              ")"
          );
        })
    );
  }

  zoom =
    // @ts-ignore
    d3.behavior.zoom().on("zoom", d => {
      console.log("casd", this.btn);
      // @ts-ignore
      // this.svg.attr(
      //   "transform",
      //   "translate(" +
      //     // @ts-ignore
      //     d3.event.translate +
      //     ")scale(" +
      //     this.currentScale +
      //     ")"
      // );
    });

  onClickHandler(event) {
    console.log("[]ceee ", event);
  }

  ngAfterViewInit() {
    console.log("casd", this.btn);
  }

  ngOnInit() {
    this.jsonSchemaService.parseSchema(this.json);
    this.duration = 750;

    // @ts-ignore

    this.tree.size([this.height, this.width]);
    this.tree.nodeSize([30, 30]);
    // @ts-ignore
    diagonal = d3.svg.diagonal().projection(function(d) {
      return [d.y, d.x];
    });

    //svgElement is an actual element such as a rect or text or group

    // @ts-ignore
    this.svg = d3
      .select("app-json-schema")
      .append("svg")
      .style("border", "1px solid black")
      .style("margin-right", "20px")
      .attr("viewBox", `10 10 ${this.width} , ${this.height + 400}`)
      .attr("width", this.width - 100 + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
    this.svg.call(this.zoom);

    this.svg
      .append("rect")
      .attr("y", -20000)
      .attr("x", -10000)
      .attr("width", this.width * 300)
      .attr("height", this.height * 300)
      .attr("overflow", "scroll")
      .attr("fill", "transparent")
      .attr("stroke", "black")
      .call(
        // @ts-ignore
        d3.behavior
          .drag()
          .on("drag", (d: any) => {
            // @ts-ignore
            let dx0 =
              // @ts-ignore
              d3.transform(this.svg.attr("transform")).translate[1] +
              // @ts-ignore
              d3.event.sourceEvent.movementY * 1.5;
            // @ts-ignore
            let dy0 =
              // @ts-ignore
              d3.transform(this.svg.attr("transform")).translate[0] +
              // @ts-ignore
              d3.event.sourceEvent.movementX * 1.5;
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[0] = dx0;
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[1] = dy0;
            // @ts-ignore
            this.svg.attr(
              "transform",
              "translate(" +
                dy0 +
                "," +
                dx0 +
                ")scale(" +
                this.currentScale +
                ")"
            );
          })
          .on("dragend", () => {
            // @ts-ignore
            this.position_after = {
              // @ts-ignore
              x: d3.event.sourceEvent.x,
              // @ts-ignore
              y: d3.event.sourceEvent.y
            };
          })
      );

    d3.select("app-json-schema");

    // @ts-ignore
    // d3.select("#jsv-tree").on("click", () => {
    //   console.log("CLICK0");
    // });
    // this.svg.on("click", () => {
    //   console.log("DOUBLE_CLICK1");
    // });

    // this.svg.on("click", () => {
    //   console.log("Click");
    // });

    this.svg.on("wheel", event => {
      // @ts-ignore
      console.log("WHEEL", d3.event.deltaY);

      // @ts-ignore
      if (d3.event.deltaY > 0 && this.currentScale - 0.1 > 0.3) {
        console.log("this.currentScale", this.currentScale);
        this.currentScale -= 0.1;
        // @ts-ignore
        this.zoom.scale(this.currentScale);
        // @ts-ignore
        console.log(
          "bla_bla",
          this.zoom.translate(),
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[0]
        );

        this.svg.attr(
          "transform",
          "translate(" +
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[0] +
            "," +
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[1] +
            ")scale(" +
            this.zoom.scale() +
            ")"
        );
        //todo minus
      }

      // @ts-ignore
      else if (d3.event.deltaY < 0) {
        this.currentScale += 0.1;
        // @ts-ignore
        this.zoom.scale(this.currentScale);
        // @ts-ignore
        console.log(
          "bla_bla",
          this.zoom.translate(),
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[0]
        );

        this.svg.attr(
          "transform",
          "translate(" +
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[0] +
            "," +
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[1] +
            ")scale(" +
            this.zoom.scale() +
            ")"
        );

        //todo plus
      }

      // this.currentScale += 0.1;
      // // @ts-ignore
      // this.zoom.scale(this.currentScale);
      // // @ts-ignore
      // console.log(
      //   "bla_bla",
      //   this.zoom.translate(),
      //   // @ts-ignore
      //   d3.transform(this.svg.attr("transform")).translate[0]
      // );

      // this.svg.attr(
      //   "transform",
      //   "translate(" +
      //     // @ts-ignore
      //     d3.transform(this.svg.attr("transform")).translate[0] +
      //     "," +
      //     // @ts-ignore
      //     d3.transform(this.svg.attr("transform")).translate[1] +
      //     ")scale(" +
      //     this.zoom.scale() +
      //     ")"
      // );
    });

    // @ts-ignore
    d3.select("#btn-zoom-on").on("click", () => {
      // // @ts-ignore
      // d3.transform(this.svg.attr("transform")).translate[1];
      // // @ts-ignore
      // d3.transform(this.svg.attr("transform")).translate[0];

      this.currentScale += 0.1;
      // @ts-ignore
      this.zoom.scale(this.currentScale);
      // @ts-ignore
      console.log(
        "bla_bla",
        this.zoom.translate(),
        // @ts-ignore
        d3.transform(this.svg.attr("transform")).translate[0]
      );

      this.svg.attr(
        "transform",
        "translate(" +
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[0] +
          "," +
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[1] +
          ")scale(" +
          this.zoom.scale() +
          ")"
      );
    });

    // @ts-ignore
    d3.select("jsv-tree").on("wheel", () => {
      console.log("wheel test");
    });

    // @ts-ignore
    d3.select("#btn-zoom-out").on("click", () => {
      this.currentScale -= 0.1;
      // @ts-ignore
      this.zoom.scale(this.currentScale);
      console.log("bla_bla", this.zoom.translate());

      // this.svg.attr(
      //   "transform",
      //   "translate(" +
      //     // @ts-ignore
      //     this.zoom.translate() +
      //     ")scale(" +
      //     this.zoom.scale() +
      //     ")"
      // );

      this.svg.attr(
        "transform",
        "translate(" +
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[0] +
          "," +
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[1] +
          ")scale(" +
          this.zoom.scale() +
          ")"
      );
    });

    console.log("[c]", this.jsonSchemaService.treeData);

    this.root = this.jsonSchemaService.treeData[0];

    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    this.update(this.root);
    // @ts-ignore
    //d3.select(self.frameElement).style("height", "2500px");

    // Toggle children on click.
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  // @ts-ignore

  click = d => {
    console.log(
      "1 o",
      Math.abs(this.position_before.x - this.position_after.x) < 5
    );
    console.log(
      "2 o",
      Math.abs(this.position_before.y - this.position_after.y) < 5
    );
    if (
      Math.abs(this.position_before.x - this.position_after.x) > 5 ||
      Math.abs(this.position_before.y - this.position_after.y) > 5
    ) {
      this.deltaDragging = {
        x: this.position_after.x - this.position_before.x,
        y: this.position_after.y - this.position_before.y
      };
      return 0;
    }

    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  };

  update = source => {
    // Compute the new tree layout.
    var i = 0;
    // @ts-ignore
    var nodes = this.tree.nodes(this.root).reverse(),
      // @ts-ignore
      links = this.tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 240;
    });

    // Update the nodes…
    var node = this.svg.selectAll("g.node").data(nodes, function(d: any) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node activeDrag")
      .attr("transform", d => {
        console.log("[c] x,y", this.deltaDragging);
        return (
          "translate(" +
          source.y0 +
          this.deltaDragging.y +
          "," +
          source.x0 +
          this.deltaDragging.x +
          ")"
        );
      })
      .on("click", this.click)
      .on("mousedown", () => {
        // @ts-ignore
        console.log("mousedown 0 ", d3.event);
        this.position_before = {
          // @ts-ignore
          x: d3.event.x,

          // @ts-ignore
          y: d3.event.y
        };
        console.log("[c] mousedown", this.position_before);
      });

    nodeEnter
      .append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d: any) {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .style("padding", "20px")

      .call(
        // @ts-ignore
        d3.behavior
          .drag()
          .on("drag", (d: any) => {
            // @ts-ignore
            let dx0 =
              // @ts-ignore
              d3.transform(this.svg.attr("transform")).translate[1] +
              // @ts-ignore
              d3.event.sourceEvent.movementY * 1.5;
            // @ts-ignore
            let dy0 =
              // @ts-ignore
              d3.transform(this.svg.attr("transform")).translate[0] +
              // @ts-ignore
              d3.event.sourceEvent.movementX * 1.5;
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[0] = dx0;
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[1] = dy0;
            // @ts-ignore
            this.svg.attr(
              "transform",
              "translate(" +
                dy0 +
                "," +
                dx0 +
                ")scale(" +
                this.currentScale +
                ")"
            );
          })
          .on("dragend", () => {
            // @ts-ignore
            this.position_after = {
              // @ts-ignore
              x: d3.event.sourceEvent.x,
              // @ts-ignore
              y: d3.event.sourceEvent.y
            };
          })
      );

    nodeEnter
      .append("text")
      .attr("x", function(d: any) {
        return d.children || d._children ? -13 : 13;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d: any) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d: any) {
        return d.name;
      })
      .style("fill-opacity", 1e-6)
      .call(
        // @ts-ignore
        d3.behavior.drag().on("drag", (d: any) => {
          // @ts-ignore
          let dx0 =
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[1] +
            // @ts-ignore
            d3.event.sourceEvent.movementY * 1.5;
          // @ts-ignore
          let dy0 =
            // @ts-ignore
            d3.transform(this.svg.attr("transform")).translate[0] +
            // @ts-ignore
            d3.event.sourceEvent.movementX * 1.5;
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[0] = dx0;
          // @ts-ignore
          d3.transform(this.svg.attr("transform")).translate[1] = dy0;
          // @ts-ignore
          this.svg.attr(
            "transform",
            "translate(" + dy0 + "," + dx0 + ")scale(" + this.currentScale + ")"
          );
        })
      );

    // Transition nodes to their new position.
    // @ts-ignore
    var nodeUpdate = node
      .transition()
      .duration(this.duration)
      .attr("transform", (d: any) => {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate
      .select("circle")
      .attr("r", 10)
      .style("fill", function(d: any) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    // @ts-ignore
    var nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", d => {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    // Update the links…
    var link = this.svg
      .selectAll("path.link")
      // @ts-ignore
      .data(links, function(d: any) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      // .attr ( 'transform', () => {
      //     return 'translate(' + this.deltaDragging.x + ',' + this.deltaDragging.y + ')';
      // } )
      .attr("class", "link node activeDrag")
      .attr("d", d => {
        console.log("[c] insert");
        var o = { x: source.x, y: source.y };
        // let dy0 = source.y + this.deltaDragging.y;
        // let dx0 = source.x + this.deltaDragging.x;
        // @ts-ignore
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    // @ts-ignore
    link
      .transition()
      .duration(this.duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    // @ts-ignore
    link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", function(d) {
        console.log("[c] exit");
        var o = { x: source.x, y: source.y };
        console.log("[c] source", o);
        // @ts-ignore
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // this.deltaDragging =  {x: 0, y: 0}
  };
}
