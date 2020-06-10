// 
// a09.js
// Denny Ho
//
// This file provides the template code for A09, providing a skeleton
// for how to initialize and draw tree maps  
//


////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

//let data = test_1;
//let data = test_2;
let data = flare;



////////////////////////////////////////////////////////////////////////
// Tree related helper functions

function setTreeSize(tree)
{
  if (tree.children !== undefined) {
    let size = 0;
    for (let i=0; i<tree.children.length; ++i) {
      size += setTreeSize(tree.children[i]);
    }
    tree.size = size;
  }
  if (tree.children === undefined) {
    // do nothing, tree.size is already defined for leaves
  }
  return tree.size;
};

function setTreeCount(tree)
{
  if (tree.children !== undefined) {
    let count = 0;
    for (let i=0; i<tree.children.length; ++i) {
      count += setTreeCount(tree.children[i]);
    }
    tree.count = count;
  }
  if (tree.children === undefined) {
    tree.count = 1;
  }
  return tree.count;
}

function setTreeDepth(tree, depth)
{
  tree.depth = depth;
  if (tree.children !== undefined) {
    var maxD = 0;
    for (let i=0; i<tree.children.length; ++i) {
      let temp = setTreeDepth(tree.children[i], depth+1);
      if (temp > maxD) {
        maxD = temp;
      }
    }
  }
  if (tree.children === undefined) {
    return tree.depth;
  }
  return maxD;
};


// Initialize the size, count, and depth variables within the tree
setTreeSize(data);
setTreeCount(data);
let maxDepth = setTreeDepth(data, 0);



////////////////////////////////////////////////////////////////////////
// Main Code for the Treemapping Technique

function setRectangles(rect, tree, attrFun, best)
{
  tree.rect = rect;

  if (tree.children !== undefined) {
    let cumulativeSizes = [0];
    for (let i=0; i<tree.children.length; ++i) {
      cumulativeSizes.push(cumulativeSizes[i] + attrFun(tree.children[i]));
    }
    
    let rectWidth = rect.x2 - rect.x1;
    let rectHeight = rect.y2 - rect.y1; 
    let border = 5;
    if (rectWidth <= 10 || rectHeight <= 10) {
      border = 0;
    }
    
    var scale = d3.scaleLinear()
                  .domain([0, cumulativeSizes[cumulativeSizes.length-1]]);
                  
    if (best && (rectWidth > rectHeight)) {
      scale.range([rect.x1+border, rect.x2-border]);
    }
    else if (best) {
        scale.range([rect.y1+border, rect.y2-border]);
    }
    else {
      if (tree.depth%2 == 0) {
        scale.range([rect.x1+border, rect.x2-border]);
      }
      else {
        scale.range([rect.y1+border, rect.y2-border]);
      }
    }

    // Set the range of the "scale" variable above appropriately,
    // depending on the shape of the current rectangle and the splitting
    // direction.  This will help define newRect for each child.

    for (let i=0; i<tree.children.length; ++i) {
      let val = scale(cumulativeSizes[i]);
      let val2 = scale(cumulativeSizes[i+1]);

      let newRect = { x1: 0, x2: 0, y1: 0, y2: 0 };
      
      if (best && (rectWidth > rectHeight)) {
        newRect = { x1: val, x2: val2, y1: rect.y1 + border, y2: rect.y2 - border};
      }
      else if (best) {
        newRect = { x1: rect.x1 + border, x2: rect.x2 - border, y1: val, y2: val2};
      }
      else {
        if (tree.depth%2 == 0) {
          newRect = { x1: val, x2: val2, y1: rect.y1 + border, y2: rect.y2 - border};
        }
        else {
          newRect = { x1: rect.x1 + border, x2: rect.x2 - border, y1: val, y2: val2};
        }
      }
      setRectangles(newRect, tree.children[i], attrFun, best);
    }
  }
}

// initialize the tree map
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

// compute the rectangles for each tree node
setRectangles(
  {x1: 0, y1: 0, x2: winWidth, y2: winHeight}, data,
  function(t) { return t.size; }
);

// make a list of all tree nodes;
function makeTreeNodeList(tree, lst)
{
  lst.push(tree);
  if (tree.children !== undefined) {
    for (let i=0; i<tree.children.length; ++i) {
      makeTreeNodeList(tree.children[i], lst);
    }
  }
}

let treeNodeList = [];
makeTreeNodeList(data, treeNodeList);



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion

// d3 selection to draw the tree map 
let gs = d3.select("#svg")
           .attr("width", winWidth)
           .attr("height", winHeight)
           .selectAll("g")
           .data(treeNodeList)
           .enter()
           .append("g");

colorScale = d3.scaleLinear()
  .domain([0, maxDepth])
  .range(["purple", "peachpuff"]);

function setAttrs(sel) {
  // WRITE THIS PART.
  sel.attr("width", function(treeNode) { return treeNode.rect.x2 - treeNode.rect.x1;})
     .attr("height", function(treeNode) { return treeNode.rect.y2 - treeNode.rect.y1;})
     .attr("x", function(treeNode) { return treeNode.rect.x1;})
     .attr("y", function(treeNode) { return treeNode.rect.y1})
     .attr("fill", function(treeNode) { 
       return colorScale(treeNode.depth);
      })
     .attr("stroke", function(treeNode) { return "black";})
     .attr("title", function(treeNode) { 
        return treeNode.name;
     });
}

gs.append("rect").call(setAttrs);



////////////////////////////////////////////////////////////////////////
// Callbacks for buttons

d3.select("#size").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, 
    function(t) { return t.size; }, false
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#count").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }, false
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#best-size").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, 
    function(t) { return t.size; }, true
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});

d3.select("#best-count").on("click", function() {
  setRectangles(
    {x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data,
    function(t) { return t.count; }, true
  );
  d3.selectAll("rect").transition().duration(1000).call(setAttrs);
});