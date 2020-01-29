import {Component, OnInit} from '@angular/core';
// @ts-ignore
import parser from 'json-schema-parser';
import {JsonSchemaService} from '../json-schema.service';

@Component({
  selector: 'app-json-schema',
  templateUrl: './json-schema.component.html',
  styleUrls: ['./json-schema.component.css']
})
export class JsonSchemaComponent implements OnInit {
  // @ts-ignore
  json = require('../testJSON.json');


//d3:any = null;


  treeData = [
    {
      name: 'Top Level',
      parent: 'null',
      children: [
        {
          name: 'Level 2: A',
          parent: 'Top Level',
          children: [
            {
              'name': 'Daughter of A',
              'parent': 'Level 2: A'
            }
          ]
        },
      ]
    }
  ];


  constructor(private   jsonSchemaService: JsonSchemaService) {

  }


  ngOnInit() {


    this.jsonSchemaService.parseSchema(this.json);
    // console.log('[c] dddd', JSON.parse(this.json));
    console.log('[c] dddd1', this.json);

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 2560 - margin.right - margin.left,
      height = 1200 - margin.top - margin.bottom;

    var i = 0,
      duration = 750,
      root;

    // @ts-ignore
    var tree = d3.layout.tree()
      .size([height, width]);

    // @ts-ignore

    var diagonal = d3.svg.diagonal()
      .projection(function(d) {
        return [d.y , d.x ];
      });

    // @ts-ignore
    var svg = d3.select('app-json-schema').append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    console.log('[c]', this.jsonSchemaService.treeData);
    root = this.jsonSchemaService.treeData[0];

    root.x0 = height / 2;
    root.y0 = 0;

    update(root);
    // @ts-ignore
    d3.select(self.frameElement).style('height', '2500px');

    function update(source) {

      // Compute the new tree layout.
      // @ts-ignore
      var nodes = tree.nodes(root).reverse(),
        // @ts-ignore
        links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = d.depth * 240;
      });

      // Update the nodes…
      var node = svg.selectAll('g.node')
        .data(nodes, function(d: any) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click);

      nodeEnter.append('circle')
        .attr('r', 1e-6)
        .style('fill', function(d: any) {
          return d._children ? 'lightsteelblue' : '#fff';
        }).style('padding', "20px" );

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
        .style('fill-opacity', 1e-6);

      // Transition nodes to their new position.
      // @ts-ignore
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', function(d: any) {
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
        .duration(duration)
        .attr('transform', function(d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // Update the links…
      var link = svg.selectAll('path.link')
        .data(links, function(d: any) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      // @ts-ignore
      link.transition()
        .duration(duration)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      // @ts-ignore
      link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

  }

}
