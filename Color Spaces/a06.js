// Denny Ho
// a06.js
//
// This file provides the skeleton code for you to write for A06.  It
// generates (using index.html and data.js) grids of 50x50  rectanges to visualize
// the Hurricane Isabel dataset.
//
// Your main task is to complete the four color functions.
// Additionally, you may want to add additional logic to insert color
// legends for each of the four plots.  These can be inserted as new svg
// elements in the spans colorlegend-X for X=1..4 
//


//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries to draw the grid of rectangles

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
    return sel
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize);
}

function createRects(sel)
{
    return sel
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.Col); })
        .attr("y", function(d) { return yScale(d.Row); })
        .attr("width", 10)
        .attr("height", 10)
}

d3.selection.prototype.callAndReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////
// Color functions and color scales

var colorScaleT1 = d3.scaleLinear()
    .domain([d3.min(data, s => s.T), d3.max(data, s => s.T)])
    .range(["blue", "orange"]);

var colorScaleT2 = d3.scaleLinear()
    .domain([d3.min(data, s => s.T), d3.max(data, s => s.T)])
    .range(["blue", "orange"])
    .interpolate(d3.interpolateLab); 

var colorScaleP3 = d3.scaleLinear()
    .domain([d3.min(data, s => s.P), 0, d3.max(data, s => s.P)])
    .range(["blue", "white", "yellow"])
    .interpolate(d3.interpolateLab);

var bScale = d3.scaleLinear()
    .domain([d3.min(data, s => s.P), 0, d3.max(data, s => s.P)])
    .range([-100, 0, 100])

var aScale = d3.scaleLinear()
    .domain([d3.min(data, s => s.T), d3.max(data, s => s.T)])
    .range([20,100])

function colorT1(d) {
    return colorScaleT1(d.T);
}

function colorT2(d) {
    return colorScaleT2(d.T);
}

function colorP3(d) {
    return colorScaleP3(d.P);
}

function colorPT4(d) {  
    return d3.lab(80, aScale(d.T), bScale(d.P));
}


//////////////////////////////////////////////////////////////////////////////
// Hook up the color functions with the fill attributes for the rects

d3.select("#plot1-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT1);

d3.select("#plot2-temperature")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorT2);

d3.select("#plot3-pressure")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorP3);

d3.select("#plot4-bivariate")
    .callAndReturn(createSvg)
    .callAndReturn(createRects)
    .attr("fill", colorPT4);

    

