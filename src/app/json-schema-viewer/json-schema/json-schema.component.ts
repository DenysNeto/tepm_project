import { Component, OnInit } from '@angular/core';
// @ts-ignore

import { JsonSchemaService } from '../json-schema.service';

// @ts-ignore
let diagonal = d3.svg.diagonal ()
.projection ( function( d ) {
    return [ d.y, d.x ];
} );

@Component ( {
    selector   : 'app-json-schema',
    templateUrl: './json-schema.component.html',
    styleUrls  : [ './json-schema.component.css' ],
} )
export class JsonSchemaComponent implements OnInit {
    // @ts-ignore
    json                                      = require ( '../testJSON.json' );
    position_before: { x: number, y: number } = { x: 0, y: 0 };
    
    position_after: { x: number, y: number } = { x: 0, y: 0 };
    
    isDragged: boolean                      = false;
    deltaDragging: { x: number, y: number } = { x: 0, y: 0 };
    // @ts-ignore
    tree                                    = d3.layout.tree ();
    root;
    svg;
    duration;
    margin                                  = { top: 200, right: 120, bottom: 20, left: 120 };
    width                                   = 2500 - this.margin.right - this.margin.left;
    height                                  = 3000 - this.margin.top - this.margin.bottom;
    currentScale: number                    = 1;
    
    constructor( private   jsonSchemaService: JsonSchemaService ) {
    
    }
    
    handleZoomPlus() {
        this.currentScale += 0.25;
        console.log ( '[c] zoomPlus', this.svg );
    
        d3.select ( 'app-json-schema' ).call (
            
            // @ts-ignore
            d3.behavior.zoom ()
            // .extent([[0, 0], [this.width, this.height]])
            .scaleExtent ( [ 2, 4 ] )
            .on ( 'zoom', ( d ) => {
                console.log ( '[c] zoom', d3.event );
                // @ts-ignore
                d3.select ( 'app-json-schema' ).attr ( 'transform', 'translate(' + d3.event.translate + ')scale(' + this.currentScale + ')' );
                
            } ) );
        
    }
    
    handleZoomMinus() {
        console.log ( '[c] zoomMinus' );
        this.currentScale -= 0.25;
        this.svg.call (
            // @ts-ignore
            d3.behavior.zoom ()
            // .extent([[0, 0], [this.width, this.height]])
            .scaleExtent ( [ 2, 4 ] )
            .on ( 'zoom', ( d ) => {
                console.log ( '[c] zoom', d3.event );
                // @ts-ignore
                this.svg.attr ( 'transform', 'translate(' + d3.event.translate + ')scale(' + this.currentScale + ')' );
                
            } ) );
        
    }
    
    ngOnInit() {
        
        this.jsonSchemaService.parseSchema ( this.json );
        this.duration = 750;
        
        // @ts-ignore
        
        this.tree.size ( [ this.height, this.width ] );
        this.tree.nodeSize ( [ 50, 50 ] );
        // @ts-ignore
        diagonal = d3.svg.diagonal ()
        .projection ( function( d ) {
            return [ d.y, d.x ];
        } );
        
        // @ts-ignore
        this.svg = d3.select ( 'app-json-schema' ).append ( 'svg' )
        .attr ( 'viewBox', [ 0, 0, this.width, this.height ] )
        .attr ( 'width', this.width + this.margin.right + this.margin.left )
        .attr ( 'height', this.height + this.margin.top + this.margin.bottom )
        .append ( 'g' )
        .attr ( 'transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')' )
        
        ;
        
        console.log ( '[c]', this.jsonSchemaService.treeData );
        
        this.root = this.jsonSchemaService.treeData[ 0 ];
        
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;
        
        this.update ( this.root );
        // @ts-ignore
        d3.select ( self.frameElement ).style ( 'height', '2500px' );
        
        // Toggle children on click.
        
    }
    
    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    // @ts-ignore
    
    click = ( d ) => {
        console.log ( '1 o', Math.abs ( this.position_before.x - this.position_after.x ) < 5 );
        console.log ( '2 o', Math.abs ( this.position_before.y - this.position_after.y ) < 5 );
        if ( Math.abs ( this.position_before.x - this.position_after.x ) > 5
            ||
            Math.abs ( this.position_before.y - this.position_after.y ) > 5 ) {
            this.deltaDragging = { x: this.position_after.x - this.position_before.x, y: this.position_after.y - this.position_before.y };
            return 0;
        }
        
        if ( d.children ) {
            d._children = d.children;
            d.children  = null;
        } else {
            d.children  = d._children;
            d._children = null;
        }
        this.update ( d );
    };
    
    update = source => {
        
        // Compute the new tree layout.
        var i     = 0;
        // @ts-ignore
        var nodes = this.tree.nodes ( this.root ).reverse (),
        
            // @ts-ignore
            links = this.tree.links ( nodes );
        
        // Normalize for fixed-depth.
        nodes.forEach ( function( d ) {
            d.y = d.depth * 240;
        } );
        
        // Update the nodes…
        var node = this.svg.selectAll ( 'g.node' )
        .data ( nodes, function( d: any ) {
            return d.id || (d.id = ++i);
        } );
        
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter ().append ( 'g' )
        .attr ( 'class', 'node activeDrag' )
        .attr ( 'transform', ( d ) => {
            
            console.log ( '[c] x,y', this.deltaDragging );
            return 'translate(' + source.y0 + this.deltaDragging.y + ',' + source.x0 + this.deltaDragging.x + ')';
        } )
        .on ( 'click', this.click ).on ( 'mousedown', () => {
            
            // @ts-ignore
            console.log ( 'mousedown 0 ', d3.event );
            this.position_before = {

// @ts-ignore
                x: d3.event.x,

// @ts-ignore
                y: d3.event.y,
            };
            console.log ( '[c] mousedown', this.position_before );
        } );
        
        nodeEnter.append ( 'circle' )
        .attr ( 'r', 1e-6 )
        .style ( 'fill', function( d: any ) {
            return d._children ? 'lightsteelblue' : '#fff';
        } ).style ( 'padding', '20px' )
        
        .call (
            // @ts-ignore
            d3.behavior.drag ().on ( 'drag', ( d: any ) => {
                    console.log ( '[c] drag rr' );
                    // @ts-ignore
                    let dx0                                                       = d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 1 ] + d3.event.sourceEvent.movementY * 1.5;
                    // @ts-ignor
                    let dy0                                                       = d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 0 ] + d3.event.sourceEvent.movementX * 1.5;
                    // @ts-ignore
                    d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 0 ] = dx0;
                    // @ts-ignore
                    d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 1 ] = dy0;
                    // @ts-ignore
                    this.svg.attr ( 'transform', 'translate(' + dy0 + ',' + dx0 + ')scale(' + this.currentScale + ')' );
                    
                },
            ).on ( 'dragend', () => {
                // @ts-ignore
                this.position_after = {
                    // @ts-ignore
                    x: d3.event.sourceEvent.x,
                    // @ts-ignore
                    y: d3.event.sourceEvent.y,
                };
            } ) );
        
        nodeEnter.append ( 'text' )
        .attr ( 'x', function( d: any ) {
            return d.children || d._children ? -13 : 13;
        } )
        .attr ( 'dy', '.35em' )
        .attr ( 'text-anchor', function( d: any ) {
            return d.children || d._children ? 'end' : 'start';
        } )
        .text ( function( d: any ) {
            return d.name;
        } )
        .style ( 'fill-opacity', 1e-6 ).call (
            // @ts-ignore
            d3.behavior.drag ()
            .on ( 'drag', ( d: any ) => {
                // @ts-ignore
                let dx0                                                       = d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 1 ] + d3.event.sourceEvent.movementY * 1.5;
                // @ts-ignor
                let dy0                                                       = d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 0 ] + d3.event.sourceEvent.movementX * 1.5;
                // @ts-ignore
                d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 0 ] = dx0;
                // @ts-ignore
                d3.transform ( this.svg.attr ( 'transform' ) ).translate[ 1 ] = dy0;
                // @ts-ignore
                this.svg.attr ( 'transform', 'translate(' + dy0 + ',' + dx0 + ')scale(' + this.currentScale + ')' );
            } ) );
        
        // Transition nodes to their new position.
        // @ts-ignore
        var nodeUpdate = node.transition ()
        .duration ( this.duration )
        .attr ( 'transform', ( d: any ) => {
            
            return 'translate(' + d.y + ',' + d.x + ')';
        } );
        
        nodeUpdate.select ( 'circle' )
        .attr ( 'r', 10 )
        .style ( 'fill', function( d: any ) {
            return d._children ? 'lightsteelblue' : '#fff';
        } );
        
        nodeUpdate.select ( 'text' )
        .style ( 'fill-opacity', 1 );
        
        // Transition exiting nodes to the parent's new position.
        // @ts-ignore
        var nodeExit = node.exit ().transition ()
        .duration ( this.duration )
        .attr ( 'transform', ( d ) => {
            return 'translate(' + source.y + ',' + source.x + ')';
        } )
        .remove ();
        
        nodeExit.select ( 'circle' )
        .attr ( 'r', 1e-6 );
        
        nodeExit.select ( 'text' )
        .style ( 'fill-opacity', 1e-6 );
        
        // Update the links…
        var link = this.svg.selectAll ( 'path.link' )
        // @ts-ignore
        .data ( links, function( d: any ) {
                
                return d.target.id;
            },
        );
        
        // Enter any new links at the parent's previous position.
        link.enter ().insert ( 'path', 'g' )
        // .attr ( 'transform', () => {
        //     return 'translate(' + this.deltaDragging.x + ',' + this.deltaDragging.y + ')';
        // } )
        .attr ( 'class', 'link node activeDrag' )
        .attr ( 'd', ( d ) => {
            console.log ( '[c] insert' );
            var o = { x: source.x, y: source.y };
            // let dy0 = source.y + this.deltaDragging.y;
            // let dx0 = source.x + this.deltaDragging.x;
            // @ts-ignore
            return diagonal ( {
                source: o,
                target: o,
            } );
        } );
        
        // Transition links to their new position.
        // @ts-ignore
        link.transition ()
        .duration ( this.duration )
        .attr ( 'd', diagonal );
        
        // Transition exiting nodes to the parent's new position.
        // @ts-ignore
        link.exit ().transition ()
        .duration ( this.duration )
        .attr ( 'd', function( d ) {
            console.log ( '[c] exit' );
            var o = { x: source.x, y: source.y };
            console.log ( '[c] source', o );
            // @ts-ignore
            return diagonal ( {
                source: o,
                target: o,
            } );
        } )
        .remove ();
        
        // Stash the old positions for transition.
        nodes.forEach ( function( d ) {
            d.x0 = d.x;
            d.y0 = d.y;
        } );
        
        // this.deltaDragging =  {x: 0, y: 0}
    };
    
}



