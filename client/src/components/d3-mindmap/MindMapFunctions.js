/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindMapFunctions.js
 * Descr:    Non-class functions for the D3 mind map.
 *           See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-09-21
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-09-22
 * Changes:
 * Editor:   Brad Kaufman
 */
/**
 * @method: guid
 * @desc: Generates unique guid
 **/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
    s4() + "-" + s4() + s4() + s4();
}

export function createId() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

function printNodes(msg, root) {
  // Log where the nodes are.
  console.log(msg);
  root.descendants().forEach((d, i) => {
    console.log("node i: " + i + ", d.depth:" + d.depth + ", data.name: " + d.data.name +
      ", d.x:" + parseFloat(d.x).toFixed(2) + ", d.y: " + parseFloat(d.y).toFixed(2));
  });
};

export function createNewMapJson() {
  let json = {
    id: createId(),
    name: "Root",
    note: "",
    children: []
  };
  return json;
};
