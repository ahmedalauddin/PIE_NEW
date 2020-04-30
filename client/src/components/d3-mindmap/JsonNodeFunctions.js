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
export function findNode(selectedNodeId, jsonMapData) {
  // Find the node in the JSON data.
  //console.log("findNode -> selectedNodeId: " + selectedNodeId);

  let nodeInTree = [jsonMapData];
  let nodeFound = false;
  let parentNode = null;

  while (nodeInTree.length !== 0) {
    let allCurrentLevelChildren = [];
    for (let node of nodeInTree) {
      if (node.children) {
        allCurrentLevelChildren = allCurrentLevelChildren.concat(
          node.children
        );
      }
      if (node.id === selectedNodeId) {
        nodeFound = true;
        parentNode = node;
      }
    }
    if (nodeFound) break;
    else {
      nodeInTree = allCurrentLevelChildren;
    }
  }

  // TODO: Shouldn't be called parentNode probably.
  if (!parentNode) {
    console.log("findNode, error: parentNode not found");
  }
  return parentNode;
}

export function findParentNode(selectedNodeId, jsonMapData) {
  // Operates on mindmap JSON data.
  // Find the parent of the node in the JSON data.
  console.log("findParentNode -> selectedNodeId: " + selectedNodeId);

  let parentNodes = [jsonMapData];
  let nodeFound = false;
  let parent = null;

  while (parentNodes.length !== 0) {
    let allNextLevelParents = [];
    for (let node of parentNodes) {
      if (node.children) {
        allNextLevelParents = allNextLevelParents.concat(node.children);
        if (node.children.map(child => child.id).includes(selectedNodeId)) {
          nodeFound = true;
          parent = node;
          break;
        }
      }
    }
    if (nodeFound) {
      break;
    } else {
      parentNodes = allNextLevelParents;
    }
  }

  if (!parent) {
    console.log("findNode, error: parentNode not found");
  }
  return parent;
}

// use HasParent to find out if this and the root node and we should disable add sibling.
export function hasParent(selectedNodeId, jsonMapData) {
  // Operates on mindmap JSON data.
  // Find the parent of the node in the JSON data.
  //console.log("hasParent -> selectedNodeId: " + selectedNodeId);

  let parentNodes = [jsonMapData];
  let nodeFound = false;

  while (parentNodes.length !== 0) {
    let allNextLevelParents = [];
    for (let node of parentNodes) {
      if (node.children) {
        allNextLevelParents = allNextLevelParents.concat(node.children);
        if (node.children.map(child => child.id).includes(selectedNodeId)) {
          nodeFound = true;
          break;
        }
      }
    }
    if (nodeFound) {
      break;
    } else {
      parentNodes = allNextLevelParents;
    }
  }

  let hasParent = false;
  if (nodeFound) {
    hasParent = true;
  }
  return hasParent;
}

export function hasChildren(selectedNodeId, jsonMapData) {
  // Operates on mindmap JSON data.
  // Check if the node has children in the JSON data.
  let nodeInTree = [jsonMapData];
  let nodeFound = false;
  let parentNode = null;
  let node = null;

  while (nodeInTree.length !== 0) {
    let allCurrentLevelChildren = [];
    for (node of nodeInTree) {
      if (node.children) {
        allCurrentLevelChildren = allCurrentLevelChildren.concat(
          node.children
        );
      }
      if (node.id === selectedNodeId) {
        nodeFound = true;
        parentNode = node;
        break;
      }
    }
    if (nodeFound) break;
    else {
      nodeInTree = allCurrentLevelChildren;
    }
  }

  let hasChildren = false;
  if (nodeFound && node.children && (node.children.length > 0)) {
    hasChildren = true;
  }
  return hasChildren;
};

// get JSON fragment for a single node.
export function getNodeJson(id, jsonData) {
  // Operates on mindmap JSON data.
  let nodeJson = getNodeById(id, jsonData);
  return nodeJson;
}

// Should return a JSON node.
export function getNodeById(id, node) {
  // Operates on mindmap JSON data.
  // This function works on the JSON data.  The argument "node" is actually JSON, so typically (always?) the
  // this.state.jsonData get passed in.
  var reduce = [].reduce;
  function runner(result, node) {
    if (result || !node) return result;
    return (
      (node.id === id && node) || //is this the proper node?
      runner(null, node.children) || //process this nodes children
      reduce.call(Object(node), runner, result)
    ); //maybe this is some ArrayLike Structure
  }
  return runner(null, node);
}
