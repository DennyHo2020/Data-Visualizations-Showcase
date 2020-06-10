// 
// buttons.js
// Buttons Example for CSC444 Assignment 05
//
// This file provides a simple example of using d3 to create buttons in
// an html webpage.  The buttons are created from a list of buttons
// (called buttonList) that specifies the id, display text, and
// event-handler function that should be called for each button click.
//
// All buttons are inserted by d3 within a div whose id is main
//

// Here is a list with objects that specify some buttons.
var buttonList = [
    {
        id: "colormap-button-1",
        text: "Colormap 1",
        click: function() { 
            d3.select("#scatterplot_1")
                .selectAll("circle").transition()
                .duration(1500)
                .style("fill", function(val) { return colorScale1(val["GPA"]);});
        }
    },
    {
        id: "colormap-button-2",
        text: "Colormap 2",
        click: function() { 
            d3.select("#scatterplot_1")
                .selectAll("circle").transition()
                .duration(1500)
                .style("fill", function(val) { return colorScale2(val["GPA"]);});
        }
    },
    {
        id: "colormap-button-3",
        text: "Colormap 3",
        click: function() { 
            d3.select("#scatterplot_1")
                .selectAll("circle").transition()
                .duration(1500)
                .style("fill", function(val) { return colorScale3(val["GPA"]);}); }
    },
    {
        id: "SATM",
        text: "SATM X Axis",
        click: function() { 
            d3.select("#scatterplot_1")
                .selectAll("circle").transition()
                .duration(1500)
                .attr("cx", function(val) { return cxScale(val["SATM"]);});
            d3.select("#x_axis")
                .transition()
                .duration(1500)
                .call(xAxis); 
            d3.select("#x_label")
                .transition()
                .duration(1500)
                .text("SATM");
        }
    },
    {
        id: "SAT-cumulative",
        text: "SAT Cumulative X Axis",
        click: function() { 
            d3.select("#scatterplot_1")
                .selectAll("circle").transition()
                .duration(1500)
                .attr("cx", function(val) { return cxScale2(val["SATM"] + val["SATV"]);});
            d3.select("#x_axis")
                .transition()
                .duration(1500)
                .call(xAxis2); 
            d3.select("#x_label")
                .transition()
                .duration(1500)
                .text("SAT Cumulative");
        }
    }
];

// In the same way that we have been using d3 to create SVG elements,
// we can use d3 to create buttons and give them attributes.
//
// The only new feature in the code below is the use of the on()
// method, which defines *event handlers*.  In this case, we are
// telling d3 to call a function in the event that a button is
// clicked.

d3.select("#main")
    .selectAll("button")
    .data(buttonList)
    .enter()
    .append("button")
    .attr("id", function(d) { return d.id; })
    .text(function(d) { return d.text; })
    .on("click", function(d) {
        // Since the button is bound to the objects from buttonList,
        // the expression below calls the click function from either
        // of the two button specifications in the list.
        return d.click();
    });
