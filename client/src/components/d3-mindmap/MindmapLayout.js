/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindmapLayout.js
 * Descr:    D3 mind map layout functions.  Get some code out of the main mind map component.
 * Created:  2019-10-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-10-08
 * Changes:
 * Editor:   Brad Kaufman
 */
import * as d3 from "d3";
import * as jsonq from "jsonq";

// Compute the positions of nodes in the tree using D3's tree layout.  d3Tree should only be called
// by createTreelayout().
function d3Tree(treeData, direction, height, width) {
  let SWITCH_CONST = 1;
  let adjustedHeight = height;
  let adjustedWidth = (width - 400)/2;

  // console.log("d3tree, direction = " + direction);
  // console.log("d3tree, tree height = " + height + ", tree width = " + width);
  // console.log("d3tree, adjusted height = " + adjustedHeight + ", adjusted width = " + adjustedWidth);
  if (direction === "left") {
    SWITCH_CONST = -1;
  }
  // Compute the layout.
  let tree = d3.tree().size([height, (SWITCH_CONST * adjustedWidth)]);

  return tree(treeData);
}

export function createTreeLayout(svg, height, width, jsonMapData) {
  let leftTree = loadData("left", jsonMapData);
  let rightTree = loadData("right", jsonMapData);

  // Compute the layout.
  // tree.size() sets the available layout size, with x and y values.  Keep in mind we are rotating our
  // tree by 90 degrees, so height is in the x position, and width in the y position.
  // WE SHOULD PROBABLY CHANGE THIS, just very confusing.
  // For the left tree, the y value is negative, meaning the tree is reversed, it goes to the left.
  let treeLeft = d3.tree().size([height, (-1 * width)]);
  let treeRight = d3.tree().size([height, width]);

  // The shift the entire tree by half its width
  let g = svg.select("g").attr("transform", "translate(" + width / 2 + ",0)");

  // Compute the new tree layouts.
  d3Tree(leftTree, "left", height, width);
  d3Tree(rightTree, "right", height, width);

  // Set the origins of each left and right tree to the same x position, which we use as the y position, given
  // we rotate the tree by 90 degrees.
  rightTree.x = height/2;
  leftTree.x = height/2;

  // Combine the outputs from D3 tree.  Check if children exist first, as a new map won't have children.
  if (rightTree.children && rightTree.children.length) {
    rightTree.children.forEach((d, i) => {
      if (leftTree.children) leftTree.children.push(d);
      else leftTree.children = [d];
    });
  }

  // use leftTree as the root
  let root = leftTree;
  return root;
}


function loadData(direction, jsonMapData) {
  // Loads JSON data into a D3 tree hierarchy with right and left sides.  The D3 hierarchy
  // gives up screen coordinates.
  let d3Data = "";

  let childrenLeft = null;
  let childrenRight = null;
  for (let child of jsonMapData.children) {
    if (child.side === "left") {
      child.side = "left";
      if (childrenLeft) {
        childrenLeft.push(child);
      } else {
        childrenLeft = [child];
      }
    } else {
      if (childrenRight) {
        childrenRight.push(child);
      } else {
        childrenRight = [child];
      }
    }
  }
  let childrenData = (direction === "left") ? childrenLeft : childrenRight;

  d3Data = {
    name: jsonMapData.name,
    id: jsonMapData.id,
    description: jsonMapData.description,
    children: JSON.parse(
      JSON.stringify(childrenData)
    )
  };

  // d3.hierarchy object is a data structure that represents a hierarchy.
  // It has a number of functions defined on it for retrieving things like
  // ancestor, descendant, and leaf nodes, and for computing the path between nodes.
  let d3HierarchyData = d3.hierarchy(d3Data);
  return d3HierarchyData;
}
