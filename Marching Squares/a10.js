// 
// a10.js
// Template for CSC444 Assignment 10
// Denny Ho
//
// This file provides the template code for A10, providing a skeleton
// for how to initialize and compute isocontours   
//



////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries, and helper functions

let svgSize = 490;
let bands = 49;

let xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
let yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
  return sel
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);
}

function createGroups(data) {
  return function(sel) {
    return sel
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
      });
  };
}

d3.selection.prototype.callReturn = function(callable)
{
  return callable(this);
};

// This function returns the pair [min/max] for a cell d.
function gridExtent(d) {
  return [Math.min(d.NW, d.NE, d.SW, d.SE),
          Math.max(d.NW, d.NE, d.SW, d.SE)];
}



////////////////////////////////////////////////////////////////////////
// Functions for isocontouring

// Given a cell d and an isovalude value, this returns a 4-bit polarity
// signature in result.case as an integer [0,15].  Any bit that is 1
// indicates that the associate cell corner is on or above the contour.
function polarity(d, value) {
  let result = {
    NW: d.NW < value ? 0 : 1,
    NE: d.NE < value ? 0 : 1,
    SW: d.SW < value ? 0 : 1,
    SE: d.SE < value ? 0 : 1
  };
  result.case = result.NW + result.NE * 2 + result.SW * 4 + result.SE * 8;
  return result;
}

// currentContour is a global variable which stores the value
// of the contour we are currently extracting
var currentContour;

function includesOutlineContour(d) {
  // Select cells that are crossing the isocontour 
  let extent = gridExtent(d);
  return currentContour >= extent[0] && currentContour <= extent[1];
}

function includesFilledContour(d) {
  // Select cells that are crossing the isocontour and also those that are below
  let extent = gridExtent(d);
  return (currentContour >= extent[0] && currentContour <= extent[1]) || currentContour > extent[1];
}

function generateOutlineContour(d) {
  // Set up scales which, given a contour value, can be
  // used to interpolate the function along each side in the boundary of
  // the square
  let wScale = d3.scaleLinear()
    .domain([d.SW,d.NW])
    .range([0,10]);
  let eScale = d3.scaleLinear()
    .domain([d.SE,d.NE])
    .range([0,10]);
  let nScale = d3.scaleLinear()
    .domain([d.NW,d.NE])
    .range([0,10]);
  let sScale = d3.scaleLinear()
    .domain([d.SW,d.SE])
    .range([0,10]);

  let x;
  let y;
  let w;
  let z;
  switch (polarity(d, currentContour).case) {
    case 0:
      break;
    case 1:
      x = nScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[x,10],[0,y]]);
    case 2:
      x = nScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,10],[10,y]]);
    case 3:
      x = wScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[0,x],[10,y]]);
    case 4:
      x = sScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[0,y],[x,0]]);
    case 5:
      x = nScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[y,0],[x,10]]);
    case 6: 
      x = nScale(currentContour);
      y = eScale(currentContour);
      w = sScale(currentContour);
      z = wScale(currentContour);
      var data = [[x,10], [10, y], [w,null], [null, 0],[w,0],[0,z]];
      var line = d3.line()
        .defined(function (d) { return (d[1] !== null && d[0]!==null); });
      return line(data);
    case 7:
      x = sScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,0],[10,y]]);
    case 8:
      x = sScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,0],[10,y]]);
    case 9: 
      x = nScale(currentContour);
      y = eScale(currentContour);
      w = sScale(currentContour);
      z = wScale(currentContour);
      var data = [[x,10], [10, y], [w,null], [null, 0],[w,0],[0,z]];
      var line = d3.line()
        .defined(function (d) { return (d[1] !== null && d[0]!==null); });
      return line(data);
    case 10:
      x = nScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[y,0],[x,10]]);
    case 11:
      x = wScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[0,x],[y,0]]);
    case 12:
      x = wScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[0,x],[10,y]]);
    case 13:
      x = nScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,10],[10,y]]);
    case 14:
      x = nScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[x,10],[0,y]]);
    case 15:
      break;
    default:
      break;
  }
}

function generateFilledContour(d) {
  // Set up scales which, given a contour value, can be
  // used to interpolate the function along each side in the boundary of
  // the square
  let wScale = d3.scaleLinear()
    .domain([d.SW,d.NW])
    .range([0,10]);
  let eScale = d3.scaleLinear()
    .domain([d.SE,d.NE])
    .range([0,10]);
  let nScale = d3.scaleLinear()
    .domain([d.NW,d.NE])
    .range([0,10]);
  let sScale = d3.scaleLinear()
    .domain([d.SW,d.SE])
    .range([0,10]);

  let x;
  let y;
  let w;
  let z;
  switch (polarity(d, currentContour).case) {
    case 0:
      return d3.line()([[0,0], [10,0], [10,10], [0,10], [0,0]]);
      break;
    case 1:
      x = nScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[x,10],[0,y],[0,0],[10,0],[10,10],[x,10]]);
    case 2:
      x = nScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,10],[10,y],[10,0],[0,0],[0,10],[x,10]]);
    case 3:
      x = wScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[0,x],[10,y],[10,0],[0,0],[0,x]]);
    case 4:
      x = sScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[0,y],[x,0],[10,0],[10,10],[0,10],[0,y]]);
    case 5:
      x = nScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[y,0],[x,10],[10,10],[10,0],[y,0]]);
    case 6: // FINISH
      x = nScale(currentContour);
      y = eScale(currentContour);
      w = sScale(currentContour);
      z = wScale(currentContour);
      return d3.line()([[x,10], [10, y], [10,0],[w,0],[0,z],[0,10],[x,10]]);
    case 7:
      x = sScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,0],[10,y],[10,0],[x,0]]);
    case 8:
      x = sScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,0],[10,y],[10,10],[0,10],[0,0],[x,0]]);
    case 9: 
      x = nScale(currentContour);
      y = eScale(currentContour);
      w = sScale(currentContour);
      z = wScale(currentContour);
      return d3.line()([[0,z], [x, 10], [10,10], [10, y],[w,0],[0,0],[0,z]]);
    case 10:
      x = nScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[y,0],[x,10],[0,10],[0,0],[y,0]]);
    case 11:
      x = wScale(currentContour);
      y = sScale(currentContour);
      return d3.line()([[0,x],[y,0],[0,0],[0,x]]);
    case 12:
      x = wScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[0,x],[10,y],[10,10],[0,10],[0,x]]);
    case 13:
      x = nScale(currentContour);
      y = eScale(currentContour);
      return d3.line()([[x,10],[10,y],[10,10],[x,10]]);
    case 14:
      x = nScale(currentContour);
      y = wScale(currentContour);
      return d3.line()([[x,10],[0,y],[0,10],[x,10]]);
    case 15:
      break;
    default:
      break;
  }
}



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects


// d3 function to compute isocontours for all cells that span given a
// range of values, [minValue,maxValues], this function produces a set
// of size "steps" isocontours to be added to the selection "sel"
function createOutlinePlot(minValue, maxValue, steps, sel)
{
  let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
  for (let i=1; i<=steps; ++i) {
    currentContour = contourScale(i);
    sel.filter(includesOutlineContour).append("path")
      .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
      .attr("d", generateOutlineContour)
      .attr("fill", "none")
      .attr("stroke", "black");
  }
}

// d3 function to compute filled isocontours for all cells that span
// given a range of values, [minValue,maxValues], this function produces
// a set of size "steps" isocontours to be added to the selection "sel".
// colorScale is used to assign their fill color.
function createFilledPlot(minValue, maxValue, steps, sel, colorScale)
{
  let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
  for (let i=steps; i>=1; --i) {
    currentContour = contourScale(i);
    sel.filter(includesFilledContour).append("path")
      .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
      .attr("d", generateFilledContour)
      .attr("fill", function(d) { return colorScale(currentContour); });
  }
}

// Compute the isocontour plots
let plot1T = d3.select("#plot1-temperature")
    .callReturn(createSvg)
    .callReturn(createGroups(temperatureCells));
let plot1P = d3.select("#plot1-pressure")
    .callReturn(createSvg)
    .callReturn(createGroups(pressureCells));

createOutlinePlot(-70, -60, 10, plot1T);
createOutlinePlot(-500, 200, 10, plot1P);

// Compute the filled isocontour plots
let plot2T = d3.select("#plot2-temperature")
    .callReturn(createSvg)
    .callReturn(createGroups(temperatureCells));
let plot2P = d3.select("#plot2-pressure")
    .callReturn(createSvg)
    .callReturn(createGroups(pressureCells));

createFilledPlot(-70, -60, 10, plot2T, 
              d3.scaleLinear()
                .domain([-70, -60])
                .range(["blue", "red"]));
createFilledPlot(-500, 200, 10, plot2P, 
              d3.scaleLinear()
                .domain([-500, 0, 500])
                .range(["#ca0020", "#f7f7f7", "#0571b0"]));
