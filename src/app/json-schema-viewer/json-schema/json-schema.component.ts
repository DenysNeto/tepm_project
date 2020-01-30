import {Component, OnInit} from '@angular/core';
// @ts-ignore
import parser from 'json-schema-parser';
import {JsonSchemaService} from '../json-schema.service';
import { element } from 'protractor';

let diagonal =d3.svg.diagonal()
.projection(function(d) {
  return [d.y , d.x ];
});

@Component({
  selector: 'app-json-schema',
  templateUrl: './json-schema.component.html',
  styleUrls: ['./json-schema.component.css']
})
export class JsonSchemaComponent implements OnInit {
  // @ts-ignore
  json = require('../testJSON.json');


//d3:any = null;



  // @ts-ignore

// selection.call(drag);
position:any;
 // @ts-ignore
 tree = d3.layout.tree();
 root;
 svg;
 duration;
 margin = {top: 200, right: 120, bottom: 20, left: 120};
 width = 2500 - this.margin.right - this.margin.left;
 height = 3000 - this.margin.top - this.margin.bottom;
 

  constructor(private   jsonSchemaService: JsonSchemaService) {

  }


  ngOnInit() {


    this.jsonSchemaService.parseSchema(this.json);
      this.duration = 750,
  

    // @ts-ignore
    


    this.tree.size([this.height, this.width])
      this.tree.nodeSize([50, 50]);
    // @ts-ignore

    diagonal  = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y , d.x ];
    });

    // @ts-ignore
    this.svg = d3.select('app-json-schema').append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


    console.log('[c]', this.jsonSchemaService.treeData);

    this.root = this.jsonSchemaService.treeData[0];


    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    this.update(this.root);
    // @ts-ignore
    d3.select(self.frameElement).style('height', '2500px');

  
    // Toggle children on click.


  }


   click =  (d) => {

  
    console.log('[c]click', d3.event)
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }




   update =   (source) =>  {

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
    var node = this.svg.selectAll('g.node')
      .data(nodes, function(d: any) {
        return d.id || (d.id = ++i);
      })
      
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
      .attr('class', 'node activeDrag')
      .attr('transform', function(d) {
        console.log('>>138');
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click).on('mousedown', () => {
        this.position = {
          x: d3.event.x,
          y: d3.event.y,
        }
      });

    nodeEnter.append('circle')
      .attr('r', 1e-6)
      .style('fill', function(d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      }).style('padding', "20px" )
      
      .call(
        // @ts-ignore
        d3.behavior.drag()
        .on('drag', (d:any)=> {    
          nodeEnter.forEach(elem => {
            elem.forEach(elem => {
      // @ts-ignore
   
         let  dx0 =  d3.select(elem).data()[0].x + d3.event.y;
         let dy0 =   d3.select(elem).data()[0].y + d3.event.x ;
          d3.select(elem).attr("transform" , "translate(" + dy0  + "," + dx0  + ")") ;
          
          d3.select(elem).data()[0].x = dx0 ;
          d3.select(elem).data()[0].y = dy0 ;
          })
  
        }),
  

    nodeEnter.append('text')
      .attr('x', function(d: any) {
        return d.children || d._children ? -13 : 13;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function(d: any) {
        return d.children || d._children ? 'end' : 'start';
      })
      .text(function(d: any) {
        return d.name;
      })
      .style('fill-opacity', 1e-6).call(
        // @ts-ignore
        d3.behavior.drag()
        .on('drag', (d:any)=> {
          console.log('pppoop', d3.event.cancelBubble = true);
          
          nodeEnter.forEach(elem => {
            elem.forEach(elem => {
      // @ts-ignore
   
         let  dx0 =  d3.select(elem).data()[0].x + d3.event.y;
         let dy0 =   d3.select(elem).data()[0].y + d3.event.x ;
          d3.select(elem).attr("transform" , "translate(" + dy0  + "," + dx0  + ")") ;
          
          d3.select(elem).data()[0].x = dx0 ;
          d3.select(elem).data()[0].y = dy0 ;
            })
          })
  
        }));

    // Transition nodes to their new position.
    // @ts-ignore
    var nodeUpdate = node.transition()
      .duration(this.duration)
      .attr('transform', function(d: any) {
        console.log('>>215');
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('circle')
      .attr('r', 10)
      .style('fill', function(d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    // @ts-ignore
    var nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', function(d) {
        console.log('>>233');
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // Update the links…
    var link = this.svg.selectAll('path.link')
    // @ts-ignore
      .data(links, function(d: any) {
        return d.target.id;
      })

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link node activeDrag')
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y};
         // @ts-ignore
        return diagonal({
          source: o,
          target: o
      });
      })
      


    // Transition links to their new position.
    // @ts-ignore
    link.transition()
      .duration(this.duration)
       .attr('d', diagonal);

    // Transition exiting nodes to the parent's new position.
    // @ts-ignore
    link.exit().transition()
      .duration(this.duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y};
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
  }
}
}



