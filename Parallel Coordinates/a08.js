// 
// a08.js
// Denny Ho
//
// This file provides the template code for A08, providing a skeleton
// for how to initialize and draw the parallel coordinates plot  
//

////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

let data = iris;

// dims will store the four axes in left-to-right display order
let dims = [
  "sepalLength",
  "sepalWidth",
  "petalLength",
  "petalWidth"
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
  "sepalLength": "Sepal Length",
  "sepalWidth": "Sepal Width",
  "petalLength": "Petal Length",
  "petalWidth": "Petal Width",
};


////////////////////////////////////////////////////////////////////////
// Global variables for the svg

let width = dims.length*125;
let height = 500;
let padding = 50;

let svg = d3.select("#pcplot")
  .append("svg")
  .attr("width", width).attr("height", height);


////////////////////////////////////////////////////////////////////////
// Initialize the x and y scales, axes, and brushes.  
//  - xScale stores a mapping from dimension id to x position
//  - yScales[] stores each y scale, one per dimension id
//  - axes[] stores each axis, one per id
//  - brushes[] stores each brush, one per id
//  - brushRanges[] stores each brush's event.selection, one per id

let xScale = d3.scalePoint()
  .domain(dims)
  .range([padding, width-padding]);

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

// For each dimension, we will initialize a yScale, axis, brush, and
// brushRange
dims.forEach(function(dim) {
  //create a scale for each dimension
  yScales[dim] = d3.scaleLinear()
    .domain( d3.extent(data, function(datum) { return datum[dim]; }) )
    .range( [height-padding, padding] );

  //set up a vertical axist for each dimensions
  axes[dim] = d3.axisLeft()
    .scale(yScales[dim])
    .ticks(10);
  
  //set up brushes as a 20 pixel width band
  //we will use transforms to place them in the right location
  brushes[dim] = d3.brushY()
    .extent([[-10, padding], [+10, height-padding]]);
  
  //brushes will be hooked up to their respective updateBrush functions
  brushes[dim]
    .on("brush", updateBrush(dim))
    .on("end", updateBrush(dim))

  //initial brush ranges to null
  brushRanges[dim] = null;
});



////////////////////////////////////////////////////////////////////////
// Make the parallel coordinates plots 

// add the actual polylines for data elements, each with class "datapath"
svg.append("g")
  .selectAll(".datapath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", "datapath")
  .attr("d", function (d) {
      return d3.line()([
        [xScale(dims[0]), yScales[dims[0]](d[dims[0]])], 
        [xScale(dims[1]), yScales[dims[1]](d[dims[1]])], 
        [xScale(dims[2]), yScales[dims[2]](d[dims[2]])], 
        [xScale(dims[3]), yScales[dims[3]](d[dims[3]])]]);
  })
  .attr("stroke", function (d) {
    if (d["species"] == "virginica") return d3.lab(65, 35,35); 
    else if (d["species"] == "versicolor") return d3.lab(50, 20, -40); 
    else if (d["species"] == "setosa") return d3.lab(65, -60, 0);
  })
  .attr("stroke-opacity", .75)
  .attr("fill", "none");


// add the axis groups, each with class "axis"
svg.selectAll(".axis")
  .data(dims)
  .enter()
  .append("g")
  .attr("class", "axis")
  .attr("transform", function(d) {
    return `translate(${xScale(d)},${0})`
  })
  .each(function(d) {
    return d3.select(this).call(axes[d]);
  });

// add the axes labels, each with class "label"
svg.selectAll(".label")
  .data(dims)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("y", padding/2)
  .attr("x", 0)
  .attr("transform", function(d) {
    return `translate(${xScale(d)},${0})`
  })
  .style("text-anchor", "middle")
  .on("click", function (d) { onClick(d)})
  .text(function(d) {
    return d;
  });

// add the brush groups, each with class ".brush" 
svg.selectAll(".brush")
  .data(dims)
  .enter()
  .append("g")
  .attr("class", "brush")
  .attr("transform", function(d) {
    return `translate(${xScale(d)},${0})`
  })
  .each(function(d) {
    return d3.select(this).call(brushes[d]);
  });




////////////////////////////////////////////////////////////////////////
// Interaction Callbacks

// Callback for swaping axes when a text label is clicked.
function onClick(d) {
  // Swap the labels in dims
  for (i = 0; i < dims.length; i++) {
    if (d == dims[i]) {
      console.log("here");
      if (i != dims.length - 1) {
        var temp = dims[i];
        dims[i] = dims[i+1];
        dims[i+1] = temp; 
      }
      else {
        var temp = dims[i];
        dims[i] = dims[i-1];
        dims[i-1] = temp;
      }
      break;
    }
  }

  // Update xScale to match new dims
  xScale = d3.scalePoint()
    .domain(dims)
    .range([padding, width-padding]);

  // Rebind axes
  svg.selectAll(".axis")
    .transition()
    .duration(1000)
    .attr("transform", function(d) {
      return `translate(${xScale(d)},${0})`
    });

  // Rebind labels
  svg.selectAll(".label")
    .transition()
    .duration(1000)
    .attr("transform", function(d) {
      return `translate(${xScale(d)},${0})`
    });
    
  // Rebind paths
  svg.selectAll(".datapath")
    .transition()
    .duration(1000)
    .attr("d", function (d) {
      return d3.line()([
        [xScale(dims[0]), yScales[dims[0]](d[dims[0]])], 
        [xScale(dims[1]), yScales[dims[1]](d[dims[1]])], 
        [xScale(dims[2]), yScales[dims[2]](d[dims[2]])], 
        [xScale(dims[3]), yScales[dims[3]](d[dims[3]])]]);
  });

  // Rebind brushes
  svg.selectAll(".brush")
    .transition()
    .duration(1000)
    .attr("transform", function(d) {
      return `translate(${xScale(d)},${0})`
    });
}

// Returns a callback function that calls onBrush() for the brush
// associated with each dimension
function updateBrush(dim) {
  return function() {
    brushRanges[dim] = d3.event.selection;
    onBrush();
  };
}

// Callback when brushing to select elements in the PC plot
function onBrush() {
  let allPaths = d3.selectAll(".datapath");

  // Select paths within brush range
  function isSelected(s) {
    let i;
    for (i = 0; i < dims.length; i++) {
      let brush = brushRanges[dims[i]];

      if (brush !== null) {
        let scale = yScales[dims[i]];
        let min = scale.invert(brush[0]);
        let max = scale.invert(brush[1]);

        if (s === null) {
          return false;
        }
        if (s[dims[i]] > min || s[dims[i]] < max) {
          return false;
        }
      }
    }

    return true;
  }

  let selected = allPaths
    .filter(isSelected);
  let notSelected = allPaths
    .filter(function(d) { return !isSelected(d); });

  // Update the style of the selected and not selected data
  selected.attr("stroke-opacity", .75);
  notSelected.attr("stroke-opacity", .1);
}

