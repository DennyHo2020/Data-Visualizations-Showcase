// 
// a07.js
// Denny Ho
//
// This file provides the skeleton code for you to write for A07.  It
// provides partial implementations for a number of functions you will
// implement to visualize scatteplots of the iris dataset with joint
// interactions
//
// Your main task is to complete the functions:
// (1) makeScatterplot(), which is used to generically create plots
// (2) onBrush(), which is the callback used to interact 
//
// You will also need to implement the logic for responding to selection
//



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset and brushes

let data = iris;

// brush1 and brush2 will store the extents of the brushes,
// if brushes exist respectively on scatterplot 1 and 2.
//
// if either brush does not exist, brush1 and brush2 will
// hold the null value.

let brush1 = null;
let brush2 = null;


////////////////////////////////////////////////////////////////////////
// xAccessor and yAccessor allow this to be generic to different data
// fields

// Makes the two scatterplots using iris data
function makeScatterplot(sel, xAccessor, yAccessor)
{
  let width = 500;
  let height = 500;
  let margin = ({top: 50, right: 50, bottom: 50, left: 50});
  let r = 5.5;
  
  let svg = sel
    .append("svg")
    .attr("width", width).attr("height", height);

  let xmin = 0;
  let xmax = 10;
  let ymin = 0;
  let ymax = 10;
  let xText = "xaxis";
  let yText = "yaxis";

  // Create scale depending on what scatterplot is being created
  if (sel.attr("id") == "scatterplot_1") {
    xmin = d3.min(iris, s => s.sepalLength);
    xmax = d3.max(iris, s => s.sepalLength);
    ymin = d3.min(iris, s => s.sepalWidth);
    ymax = d3.max(iris, s => s.sepalWidth);

    xText = "Sepal Length";
    yText = "Sepal Width";
  }
  else {
    xmin = d3.min(iris, s => s.petalLength);
    xmax = d3.max(iris, s => s.petalLength);
    ymin = d3.min(iris, s => s.petalWidth);
    ymax = d3.max(iris, s => s.petalWidth); 

    xText = "Petal Length";
    yText = "Petal Width";
  }

  // create a scale for the x axis
  let xScale = d3.scaleLinear()
    .domain([xmin, xmax])
    .range([margin.left + r, width - margin.right - r]);
  // create a scale for the y axis
  let yScale = d3.scaleLinear()
    .domain([ymin, ymax])
    .range([height - margin.bottom - r, margin.top+r]);
   
  let brush = d3.brush();
  
  svg.append("g")
    .attr("class", "brush")
    .call(brush);
  
  // Circle Creation
  let circles = svg.append("g")
    .selectAll("circle")

  circles.data(iris).enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(xAccessor(d));})
    .attr("cy", function (d) { return yScale(yAccessor(d));})
    .attr("r", r)
    .attr("stroke-width", 1.5)
    .on("click", function (d) { onClick(d)})
    .attr("fill", function (d) {
      if (d["species"] == "virginica") return d3.lab(90, 20, -40); 
      else if (d["species"] == "versicolor") return d3.lab(100, 35,35); 
      else if (d["species"] == "setosa") return d3.lab(80, -60, 0);
    });

  let xAxis; // create an axis object for the x axis
  let yAxis; // create an axis object for the y axis
  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

  yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 80).tickSizeOuter(0));

  // Add Axes Labels
  // add code to draw the axes / axes labels
  svg.append("g").attr("id", "x_axis").call(xAxis);
  svg.append("g").attr("id", "y_axis").call(yAxis);

  svg.append("text").attr("id", "x_label")
    .attr("y", height - 5)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .text(xText);

  svg.append("text").attr("id", "y_label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yText);  


  // finally, return a plot object for global use in the brushes,
  // feel free to change this interface
  return {
    svg: svg,
    brush: brush,
    xScale: xScale,
    yScale: yScale
  };
}

////////////////////////////////////////////////////////////////////////
// Setup plots

plot1 = makeScatterplot(d3.select("#scatterplot_1"),
                        function(d) { return d.sepalLength; },
                        function(d) { return d.sepalWidth; });
plot2 = makeScatterplot(d3.select("#scatterplot_2"),
                        function(d) { return d.petalLength; },
                        function(d) { return d.petalWidth; });


////////////////////////////////////////////////////////////////////////
// Callback during brushing
// Selected circles are highlighted with a red stroke
function onBrush() {
  let allCircles = d3.select("body").selectAll("circle");
  if (brush1 === null && brush2 === null) {
    allCircles.attr("stroke", "none");
    return;
  }
  // Selection filter function
  function isSelected(d) {
    let scale1 = plot1.xScale;
    let scale2 = plot1.yScale;
    let scale3 = plot2.xScale;
    let scale4 = plot2.yScale;

    if (brush1 !== null) {
      if (d["sepalLength"] > scale1.invert(brush1[1][0]) || d["sepalLength"] < scale1.invert(brush1[0][0])) {
        return false;
      }
      if (d["sepalWidth"] < scale2.invert(brush1[1][1]) || d["sepalWidth"] > scale2.invert(brush1[0][1])) {
        return false;
      }
    }
    if (brush2 !== null) {
      if (d["petalLength"] > scale3.invert(brush2[1][0]) || d["petalLength"] < scale3.invert(brush2[0][0])) {
        return false;
      }
      if (d["petalWidth"] < scale4.invert(brush2[1][1]) || d["petalWidth"] > scale4.invert(brush2[0][1])) {
        return false;
      }
    }
    return true;

  }
  
  let selected = allCircles
    .filter(isSelected);
  let notSelected = allCircles
    .filter(function(d) { return !isSelected(d); });

  selected.attr("stroke", "red");
  notSelected.attr("stroke", "none");

  // selected and notSelected are d3 selections, write code to set their
  // attributes as per the assignment specification.
}

// Callback for click of a circle
// Displays the circle's iris data and enlarges the circle on both plots
function onClick(d) {
  console.log(d["species"]);
  let allCircles = d3.select("body").selectAll("circle");
  
  // Selection filter function
  function isSelected(s) {
    if (d["species"] != s["species"]) {
      return false;
    }
    if (d["sepalWidth"] != s["sepalWidth"]) {
      return false;
    }
    if (d["sepalLength"] != s["sepalLength"]) {
      return false;
    }
    if (d["petalLength"] != s["petalLength"]) {
      return false;
    }
    if (d["petalWidth"] != s["petalWidth"]) {
      return false;
    }
    return true;
  }
  
  let selected = allCircles
    .filter(isSelected);
  let notSelected = allCircles
    .filter(function(s) { return !isSelected(s); });

  selected.attr("r", "12")
  notSelected.attr("r", 5.5);

  document.getElementById("table-sepalLength").innerHTML = d["sepalLength"];
  document.getElementById("table-sepalWidth").innerHTML = d["sepalWidth"];
  document.getElementById("table-petalLength").innerHTML = d["petalLength"];
  document.getElementById("table-petalWidth").innerHTML = d["petalWidth"];
  document.getElementById("table-species").innerHTML = d["species"];

  return;
}

////////////////////////////////////////////////////////////////////////
//
// d3 brush selection
//
// The "selection" of a brush is the range of values in either of the
// dimensions that an existing brush corresponds to. The brush selection
// is available in the d3.event.selection object.
// 
//   e = d3.event.selection
//   e[0][0] is the minimum value in the x axis of the brush
//   e[1][0] is the maximum value in the x axis of the brush
//   e[0][1] is the minimum value in the y axis of the brush
//   e[1][1] is the maximum value in the y axis of the brush
//
// The most important thing to know about the brush selection is that
// it stores values in *PIXEL UNITS*. Your logic for highlighting
// points, however, is not based on pixel units: it's based on data
// units.
//
// In order to convert between the two of them, remember that you have
// the d3 scales you created with the makeScatterplot function above.
//
// It is not necessary to use, but you might also find it helpful to
// know that d3 scales have a function to *invert* a mapping: if you
// create a scale like this:
//
//  s = d3.scaleLinear().domain([5, 10]).range([0, 100])
//
// then s(7.5) === 50, and s.invert(50) === 7.5. In other words, the
// scale object has a method invert(), which converts a value in the
// range to a value in the domain. This is exactly what you will need
// to use in order to convert pixel units back to data units.
//
//
// NOTE: You should not have to change any of the following:

function updateBrush1() {
  brush1 = d3.event.selection;
  onBrush();
}

function updateBrush2() {
  brush2 = d3.event.selection;
  onBrush();
}

plot1.brush
  .on("brush", updateBrush1)
  .on("end", updateBrush1);

plot2.brush
  .on("brush", updateBrush2)
  .on("end", updateBrush2);


