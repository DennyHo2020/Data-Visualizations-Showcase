// Denny Ho
// a05.js
//
// Script makes a scatterplot by adding SVG, Circles, and Axes 
// to div vis1 in index.html. The plot's data mapping is scaled 
// with d3 scales. The scatterplot represents data from calvinScores.js. 

// Used to format scatterplot
width = 500;
height = 500;
margin = ({top: 50, right: 50, bottom: 50, left: 50})

// Used to scale scatterplot attributes
let cxScale = d3.scaleLinear()
    .domain([350, 800]) //.domain([d3.min(scores, s => s.SATM), d3.max(scores, s => s.SATM)])
    .range([margin.left, width - margin.right]);
let cyScale = d3.scaleLinear()
    .domain([14,36]) //.domain([d3.min(scores, s => s.ACT), d3.max(scores, s => s.ACT)])
    .range([height - margin.bottom, margin.top]);
let rScale = d3.scaleSqrt()
    .domain([d3.min(scores, s => s.SATV), d3.max(scores, s => s.SATV)])
    .range([2,12]);

// SAT Cumulative x axis Scale    
let cxScale2 = d3.scaleLinear()
    .domain([350, 1600]) //.domain([d3.min(scores, s => s.SATM), d3.max(scores, s => s.SATM)])
    .range([margin.left, width - margin.right]);

// 3 Different Scales for Colors 
let minGPA = d3.min(scores, s => s.GPA);
let maxGPA = d3.max(scores, s => s.GPA);
let meanGPA = d3.mean(scores, s => s.GPA);
let colorScale1 = d3.scaleLinear()
    .domain([minGPA, maxGPA])
    .range(["blue", "red"]);
let colorScale2 = d3.scaleLinear()
    .domain([minGPA, meanGPA, maxGPA])
    .range(["#2c7bb6", "#ffffbf", "#d7191c"]);
let colorScale3 = d3.scaleQuantize()
    .domain([minGPA, maxGPA])
    .range(["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"]);

// Create Scatterplot SVG in vis1 div
d3.select("#vis1").append("svg").attr("width", 500).attr("height", 500).attr("id", "scatterplot_1");
var vis1 = d3.select("#vis1").select("svg").selectAll("circle").data(scores);

// Append Circles
vis1.enter().append("circle")
    .attr("cx", function(val) { return cxScale(val["SATM"]);})
    .attr("cy", function(val) { return cyScale(val["ACT"]);})
    .attr("r", function (val) { return rScale(val["SATV"]);})
    .attr("fill", function(val) { return colorScale1(val["GPA"]);});

// X Y Axes
xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(cxScale).ticks(width / 80).tickSizeOuter(0));

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(cyScale).ticks(height / 80).tickSizeOuter(0));

// SAT Cumulative Axis
xAxis2 = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(cxScale2).ticks(width / 80).tickSizeOuter(0));

// Append Axes to SVG 
d3.select("#scatterplot_1").append("g").attr("id", "x_axis").call(xAxis);
d3.select("#scatterplot_1").append("g").attr("id", "y_axis").call(yAxis);

// Add Axes Labels
d3.select("#scatterplot_1").append("text").attr("id", "x_label")
      .attr("y", height)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .text("SATM");

d3.select("#scatterplot_1").append("text").attr("id", "y_label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("ACT");
