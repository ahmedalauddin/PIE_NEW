/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 *
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-01-11
 * Changes:  Adding functions for saving JSON.
 * Editor:   Brad Kaufman
 **/
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import { store, getOrgId, getOrgName, setMindmap, setMindmapNode, getMindmap, checkPermision } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import "./mindmap.scss";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { createId, createNewMapJson } from "./MindMapFunctions";
import TextField from "@material-ui/core/TextField";
import { createTreeLayout } from "./MindmapLayout";
import { hasChildren, hasParent, findNode, findParentNode, getNodeById, getNodeJson} from "./JsonNodeFunctions";
import { jsonTestData } from "./save/TestJsonData";
import { styles } from "../styles/MindMapStyles";

//<editor-fold desc="// Constant declarations">

// eslint-disable-next-line no-unused-vars
const duration = 200;
const DEBUG_USE_TEST_DATA = false;
// const margin = { top: 40, right: 100, bottom: 40, left: 100 };
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
const vDuration = 1000;
const vRad = 25;
const noteColor = ["#feff9c", "#7afcff", "#ff7eb9"];
//</editor-fold>

class TreeMindMap extends React.Component {
  constructor(props) {
    super(props);
    //<editor-fold desc="// Constructor bindings">
    this.update = this.update.bind(this);
    this.chart = this.chart.bind(this);
    this.appendChildToSelectedNode = this.appendChildToSelectedNode.bind(this);
    this.addSiblingToSelectedNode = this.addSiblingToSelectedNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.undoDeleteNode = this.undoDeleteNode.bind(this);
    this.getLastDeletedNode = this.getLastDeletedNode.bind(this);
    this.newMap = this.newMap.bind(this);
    this.setMindmapJson = this.setMindmapJson.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.deselectNode = this.deselectNode.bind(this);
    this.updateNodeValue = this.updateNodeValue.bind(this);
    this.setButtonStates = this.setButtonStates.bind(this);
    
    this.saveNoteToJson = this.saveNoteToJson.bind(this);
    this.findSelectedNodeId = this.findSelectedNodeId.bind(this);
    this.findSelectedNodeName = this.findSelectedNodeName.bind(this);
    this.findSelectedNode = this.findSelectedNode.bind(this);
    this.drawTree = this.drawTree.bind(this);
    this.logNode = this.logNode.bind(this);
    this.getNewChildDirection = this.getNewChildDirection.bind(this);
    this.handleKeypressEsc = this.handleKeypressEsc.bind(this);
    this.handleClickOnNode = this.handleClickOnNode.bind(this);
    this.handleClickOnPostit = this.handleClickOnPostit.bind(this);
    this.handleClickOnCanvas = this.handleClickOnCanvas.bind(this);
    this.removeSelectedNode = this.removeSelectedNode.bind(this);
    this.removeSelectedNodeFromData = this.removeSelectedNodeFromData.bind(this);
    this.removeSelectedNodeFromGraph = this.removeSelectedNodeFromGraph.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateNodeInfo = this.updateNodeInfo.bind(this);
    this.updateJsonData = this.updateJsonData.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
    this.closeNote = this.closeNote.bind(this);
    this.addNoteRects = this.addNoteRects.bind(this);
    this.update = this.update.bind(this);
    //</editor-fold>
    //<editor-fold desc="// Constructor set state">
    this.state = {
      hasError: false,
      width: window.innerWidth * 0.8,         // width for the mind map
      height: window.innerHeight * 0.65,       // height for the mind map
      svg: d3.select(this.svg),
      orgName: getOrgName(),
      orgId: getOrgId(),
      mindmapId: this.props.mindmapId,
      jsonData: DEBUG_USE_TEST_DATA ? jsonTestData : "",
      isNewMap: false,
      openSnackbar: false,
      message: "",
      open: false,
      openPopover: false,
      placement: undefined,
      anchorEl: null,
      setOpen: false,
      mapName: "",
      mapDescription: "",
      myCounter: 0,
      deletedNodes: [],
      deleteDisabled: true,
      addChildDisabled: true,
      addSiblingDisabled: true,
      renameDisabled: true,
      undoDeleteDisabled: true,
      closeNoteDisabled: true,
      openNoteDisabled: true,
      notesStringArray: [],
      scrollable: false
    };
    //</editor-fold>
  }

  //<editor-fold desc="// Post-it note and rectangle drawing functions">
  addNote = () => {
    let root = createTreeLayout( d3.select(this.svg), this.state.height, this.state.width, getMindmap());

    root.descendants().forEach((d, i) => {
      d.id = d.data.id;
      d.name = d.data.name;
      d.note = d.data.note;
      d._children = d.children;
    });

    this.openNote();
  };

  // Save all notes into JSON.
  saveNoteToJson = () => {
    let svg = d3.select("svg");
    let json = getMindmap();

    //console.log("called saveNoteToJson");
    let nodes = svg.selectAll("#nodes").selectAll("g").selectAll("foreignObject.note");
    nodes.each((d, i) => {
      //console.log("d note " + d.note + ", id " + d.id);
      let jsonNode = getNodeById(d.id, json);
      if (this.textContent) {
        // note text has been updated
        //console.log("jsonNode note updated: " + this.textContent);
        // TODO: may have to ctach this and update here.
      }
      //console.log("jsonNode note: " + jsonNode.note + ", id: " + jsonNode.id);

    });
    // TODO: check to see if note updates JSON.

    //console.log("saveNoteToJson complete.");
  };

  // Open post-it note for selected ID
  openNote = () => {
    let svg = d3.select("svg");
    svg.attr("height", this.state.height+250)
    let selectedNode = this.findSelectedNode();
    let selectedNodeId = this.findSelectedNodeId(d3.select("svg"));
    let json = getMindmap();

    // This changes the note to a yellow square.
    selectedNode.select("rect")
      .transition().duration(vDuration)
      .attr("rx", 0).attr("x", 10).attr("y", 8)
      .attr("width", vRad * 8).attr("height", vRad * 10)
      .style("fill", function(d) { return noteColor[0]; })
      .style("stroke", function(d) { return noteColor[0]; })
      .style("opacity", 1.0);

    // Add <text> and labels
    let selectedPostit = selectedNode.select("foreignObject.note");
      //.transition().duration(vDuration);

    let jsonNode = getNodeById(selectedNodeId, json);
    let noteText = jsonNode.note;

    selectedPostit
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad * 7)
      .attr("height", vRad * 9)
      .append("xhtml:p")
      .attr("contenteditable", true)
      .text(d => noteText)
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px")
      .style("height", vRad * 9+"px")
      .style("overflow-y", "scroll");

    selectedNode.attr("note-state", "expanded");
    selectedPostit.raise();

    this.setState({
      closeNoteDisabled: false,
      openNoteDisabled: true
    });
  };

  closeNote = (nodeId) => {
    // This minimizes the note.
    let svg = d3.select("svg");
    let json = getMindmap();

    let selectedNode = this.findSelectedNode();

    selectedNode.selectAll("rect")
      .attr("rx", 0).attr("x", 10).attr("y", 8)
      .attr("width", vRad).attr("height", vRad)
      .style("fill", function(d) {return noteColor[0]; })
      .style("stroke", function(d) {return d.data.color; }).style("opacity", 1);

    // Select <text>s and labels and minimize
    let selectedPostit = selectedNode.select("foreignObject.note");

    // TODO: Save note to JSON first.
    // Save this to JSON: selectedPostit._groups[0][0].textContent
    let noteText = selectedPostit._groups[0][0].textContent;

    if (noteText) {
      let selectedNodeId = this.findSelectedNodeId(svg);
      let jsonNode = getNodeById(selectedNodeId, json);
      jsonNode.note = noteText;
    }

    selectedPostit
      .transition().duration(vDuration)
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad)
      .attr("height", vRad)
      .text(d => "")       // Use this to expand text later.  May have to save text first.
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px");

    selectedNode.attr("note-state", "collapsed");

    // Save map and note JSON to Redux
    store.dispatch(setMindmap(JSON.stringify(json)));

    this.setState({
      closeNoteDisabled: true,
      openNoteDisabled: false
    });
  };

  setMindmapJson = (json) => {
    if (Array.isArray(json)) {
      //console.log("setMindmapJson, error: JSON is an array");
    }
    store.dispatch(setMindmap(JSON.stringify(json)));
  };

  // Update JSON for a node and save it to state.
  // TODO - fix this, confusion between state json and D3.
  updateJsonData = () => {
    let selectedNode = this.findSelectedNode();
    if (!selectedNode.empty()) {
      const nodeId = selectedNode.attr("id");
      const newNodeName = selectedNode.select("p.node-title").text();
      selectedNode.attr("name", newNodeName);
      let json = getMindmap();
      let jsonNode = getNodeById(nodeId, json);
      jsonNode.name = newNodeName;
      this.setMindmapJson(json);
      // Updated 12/3/19
      store.dispatch(setMindmapNode(JSON.stringify(jsonNode)));
    }
  };

  addNoteRects = (nodeContainers) => {
    // Draw <rect>s
    nodeContainers.append("rect").attr("class","main")
      .attr("rx", 0).attr("x", 10).attr("y", 8)
      .attr("width", 0).attr("height", 0)
      .attr("id", d => d.id )
      .each(function(d) { d.data.color = noteColor[0];})
      .style("fill", noteColor[0])
      .style("opacity", 1.0)
      .on("click", this.handleClickOnPostit);

    // Add foreignObject for text
    nodeContainers
      .append("foreignObject")
      .attr("class", "note");
  };
  //</editor-fold>

  //<editor-fold desc="// Delete and undelete node functions">
  getLastDeletedNode = () => {
    let lastDeletedNode = null;
    if (this.state.deletedNodes) {
      let arrayLen = this.state.deletedNodes.length;
      lastDeletedNode = this.state.deletedNodes[arrayLen - 1];
    }
    return lastDeletedNode;
  };

  undoDeleteNode = () => {
    // This is similar to appending a node.  We've saved the deleted node id and its parent to state.
    // Get the last deleted node.
    let deletedNode = this.getLastDeletedNode();

    let parentNodeId = deletedNode.parentId;
    let jsonData = getMindmap();
    let parent = getNodeById(parentNodeId, jsonData);

    // Create the child -- this is the deleted node stored in state.
    if (parent.children) parent.children.push(deletedNode);
    else parent.children = [deletedNode];

    // Pop the deleted node info from our array of deleted nodes in state.
    let deletedNodes = this.state.deletedNodes;
    deletedNodes.pop();

    let undoDeleteDisabled = (deletedNodes.length === 0) ? true : false;
    this.setMindmapJson(jsonData);

    // Save the JSON back to state.
    this.setState({
      deletedNodes: deletedNodes,
      undoDeleteDisabled: undoDeleteDisabled
    });

    this.update();
  };
  //</editor-fold>

  //<editor-fold desc="Node functions">
  handleKeypressEsc = svg => {
    // TODO: this isn't getting called.
    svg
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
  };

  /**
   * Find and return selected node ID from the mindmap D3 svg.
   * @param svg
   * @returns {*|{loc, name, type, value}}
   */
  findSelectedNodeId = svg => {
    return this.findSelectedNode().attr("id");
  };

  /**
   * Find and return the name of the selected node from the mindmap D3 svg.
   * @returns {string} The selected node from the mindmap D3 svg.
   */
  findSelectedNodeName = () => {
    return this.findSelectedNode().attr("name");
  };

  /**
   * Find and return the selected node from the mindmap D3 svg.
   * @returns { D3 node } the selected node
   */
  findSelectedNode = () => {
    return d3.select(this.svg).selectAll("g.node").filter(".node-selected");
  };

  // Uses our callback to send info to other components.
  updateNodeInfo = (selectedNodeId, nodeText, mindmapId) => {
    if (selectedNodeId !== "") {
      this.props.callback(selectedNodeId, nodeText, mindmapId);
    }
  };

  // This is the callback used by TreeMindMap.  Use this to get information from the TreeMindMap.
  sendSelectedNode(nodeId, nodeText, mindmapId) {
    this.setState({
      selectedNodeId: nodeId,
      selectedNodeText: nodeText,
      mindmapId: mindmapId
    });
  }

  logNode = message => {
    let svg = d3.select("svg");
    ////console.log(message, ": node ID = " + this.findSelectedNodeId(svg) + ", name = " + this.findSelectedNodeName());
  };

  getSelectedNode = (nodes, i) => {
    return d3.select(nodes[i]);
  };

  handleClickOnNode = (d, i, nodes) => {
    // const currentlySelectedNode = this.getSelectedNode(nodes, i);
    const currentlySelectedNode = d3.selectAll(nodes).filter(".node-selected");

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeId = d3.select(clickedNode).attr("id");
    const otherNodes = d3
      .selectAll(nodes)
      .filter((d, i) => i !== clickedNodeIndex);

    if (
      currentlySelectedNode.size() > 0 &&
      currentlySelectedNode.attr("id") === clickedNodeId
    ) {
      //console.log("going into edit mode!");
      d3.select(clickedNode)
        .call(this.selectNode);
      d3.select(clickedNode)
        .call(this.editNode);
    } else {
      d3.select(clickedNode)
        .call(this.selectNode);

      // If not already selected, mark as selected
      otherNodes.each(this.deselectNode);
    }

    // d.children = d.children ? null : d._children;
    // update(d);

    /* Prevent triggering clickOnCanvas handler
       https://stackoverflow.com/questions/22941796/attaching-onclick-event-to-d3-chart-background */
    d3.event.stopPropagation();
  };

  handleClickOnPostit = (d, i, nodes) => {
    let svg = d3.select("svg");
    const noteWidth = vRad * 6;
    const noteTextWidth = (vRad * 6) - 6;
    const noteHeight = vRad * 10;
    const selectedNode = this.getSelectedNode(nodes, i);
    const clickedNode = nodes[i];
    const clickedId = d3.select(clickedNode).attr("id");

    // let selectionCriteria = "[id=" + clickedId + "]";
    // let thisNode = svg.selectAll("g.node").select(selectionCriteria);

    if ( (selectedNode.size() > 0) && (selectedNode.attr("name") === clickedId) ) {
      // This changes the note to a yellow square.
      selectedNode.select("rect")
        .transition().duration(vDuration)
        .attr("rx", 0).attr("x", 10).attr("y", 8)
        .attr("height", noteHeight).attr("width", noteWidth)
        .style("fill", function(d) { return noteColor[0]; })
        .style("stroke", function(d) { return noteColor[0]; })
        .style("opacity", 1);

      // Add <text> and labels
      selectedNode
        .select("foreignObject.note")
        .attr("x", 20)
        .attr("y", 10)
        .attr("width", noteTextWidth)
        .attr("height", noteHeight)
        .append("xhtml:p")
        .text(d => d.data.note)
        .style("font-family", "Arial")
        .style("stroke", "none")
        .style("font-size", "13px");
      selectedNode.raise();
    } else {
      d3.select(clickedNode).call(this.selectNode);
    }

    // Prevent triggering clickOnCanvas handler, see https://stackoverflow.com/questions/22941796/attaching-onclick-event-to-d3-chart-background
    d3.event.stopPropagation();
  };
  //</editor-fold>

  //<editor-fold desc="// Main add, sibling, and delete node functions">
  /**
   * Append child node to JSON, below the selected node.
   */
  appendChildToSelectedNode = () => {
    let svg = d3.select(this.svg);
    let selectedNodeId = this.findSelectedNodeId(svg);

    let json = getMindmap();
    let parent = getNodeById(selectedNodeId, json);

    // Create the child.
    let child = {
      name: "new",
      id: createId(),
      description: "",
      side: this.getNewChildDirection(selectedNodeId),
      note: ""
    };

    // TODO: change this to add child to the JSON, or get parent directly from the JSON.
    // Should just be able to change the JSON element.  For instance, change this:
    if (parent.children) parent.children.push(child);
    else parent.children = [child];

    this.setMindmapJson(json);
    this.update();
  };

  addSiblingToSelectedNode = () => {
    let svg = d3.select(this.svg);
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    let jsonMapData = getMindmap();
    let nodeJson = getNodeJson(idOfSelectedNode, jsonMapData)
    let parent = findParentNode(idOfSelectedNode, jsonMapData);

    let sibling = {
      name: "",
      id: createId(),
      description: "",
      side: nodeJson.side,
      note: ""
    };
    parent.children.push(sibling);

    this.setMindmapJson(jsonMapData);
    this.update();
  };

  /**
   * Removes selected node from the JSON data, stored in state.  Just need the id field.
   * Also updates our deleted nodes data, so we can undelete later.
   */
  removeSelectedNodeFromData = () => {
    let selectedNode = this.findSelectedNode();
    let jsonData = getMindmap();
    let parent = findParentNode(selectedNode.attr("id"), jsonData);

    if (parent && parent.children) {
      // This deletes from the JSON.
      parent.children = parent.children.filter(
        child => child.id !== selectedNode.attr("id")
      );
      parent.children.length === 0 && delete parent.children;
    }
    //console.log("JSON for jsonData now is:" + JSON.stringify(jsonData));
    let deletedNode = {
      id: selectedNode.attr("id"),
      name: selectedNode.attr("name"),
      description: selectedNode.attr("description"),
      note: selectedNode.attr("note"),
      parentId: parent.id
    };
    let deletedNodes = this.state.deletedNodes;
    deletedNodes.push(deletedNode);

    this.setMindmapJson(jsonData);
    this.setState({
      deletedNodes: deletedNodes,   // Array of deleted nodes
      undoDeleteDisabled: false
    });
  };

  removeSelectedNodeFromGraph = () => {
    let selectedNode = this.findSelectedNode();

    // Need to delete the child nodes of the selected node, which include the text box and the circle.
    if (selectedNode) {
      let childNodes = selectedNode.selectAll("*");
      if (childNodes) {
        childNodes.remove();
      }
      selectedNode.remove();
    }
  };

  // Called from the remove node button.
  removeSelectedNode = () => {
    let selectedNode = this.findSelectedNode();
    this.removeSelectedNodeFromData();
    this.removeSelectedNodeFromGraph();
    this.setButtonStates(false, selectedNode);
    this.update();
  };
  //</editor-fold>

  /**
   * Create the SVG and attach keystroke events to it.
   * The svg is initialized with height = dx.
   * This will be updated later when the rest of the nodes in the tree are entered.
   * @returns {*}
   */
  chart = () => {
    //console.log("Org = " + getOrgName());
    if (!(getOrgId() > 0 )) {
      //console.log("Need to redirect to login");
      this.setState({
        hasError: true
      });
    } else {
      // 1. append to body, see https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/
      let svg = d3
        .select(this.svg)
        .attr("width", this.state.width)
        .attr("height", this.state.height)
        .style("font", "14px sans-serif")
        .on("click", this.handleClickOnCanvas);

      // 2.2 Create a container for all the links in the graph
      const gLink = svg
        .append("g")
        .attr("id", "links")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1.5);

      // 2.1 Create a container for all the nodes in the graph
      const gNode = svg
        .append("g")
        .attr("id", "nodes")
        .attr("transform", "translate(" + this.state.width / 2 + ",0)")
        .attr("cursor", "pointer");

      // 3. Fill in the nodes and links with the hierarchy data
      this.update();
      /*
      let appendChildToSelectedNode = this.appendChildToSelectedNode;
      let addSiblingToSelectedNode = this.addSiblingToSelectedNode;
      let removeSelectedNode = this.removeSelectedNode;
      let handleKeypressEsc = this.handleKeypressEsc; */

      // 4. Register other event handlers
      d3.select("body").on("keydown", function (e) {
        // eslint-disable-next-line no-console
        //console.log(`keydown: ${d3.event.keyCode}`);
        // Check to see if a node is being edited
        let nodeIsBeingEdited = gNode.select("g.node-editing").size();

        if (d3.event.keyCode === 9) {
          //console.log("tab - append child to selected node");
          // appendChildToSelectedNode(svg);
        } else if (d3.event.keyCode === 13 && !nodeIsBeingEdited) {
          //console.log("enter - add sibling to selected node");
          // addSiblingToSelectedNode(svg);
        } else if (d3.event.keyCode === 8 && !nodeIsBeingEdited) {
          //console.log("delete - remove selected node");
          // removeSelectedNode(svg);
        } else if (d3.event.keyCode === 27) {
          //console.log("esc - deselect node");
          // handleKeypressEsc(svg);
        }
      });

      return svg.node();
    }
  };

  //<editor-fold desc="// Select and edit node functions">
  editNode = node => {
    node
      .classed("node-editing", true)
      .select("foreignObject")
      .select("p")
      .style("background-color", "#ddd");
    //console.log(`${node.attr("name")} is being edited`);
  };

  selectNode = node => {
    const selectedNodes = this.findSelectedNode()
    const selectedNodesCount = selectedNodes["_groups"][0].length + 1
    this.props.updateSelectedNodesCount(selectedNodesCount)
    let updateJsonData = this.updateJsonData;
    let jsonData = getMindmap();
    let nodeId = node.attr("id");
    let nodeJson = getNodeJson(nodeId, jsonData);
    store.dispatch(setMindmapNode(JSON.stringify(nodeJson)));

    node
      .classed("node-selected", true)
      .select("foreignObject")
      .attr("width", 300)
      .select("p")
      .attr("contenteditable", true)
      .style("background-color", "#ddd")
      .style("width", "auto")
      .on("blur", function() {
        updateJsonData();
      });
    node
      .classed("node-selected", true)
      .select("circle")
      .style("fill", "green");

    // This is for the callback to our other components.
    // TODO - check if this works
    this.updateNodeInfo(node.attr("id"), node.attr("name"), this.state.mindmapId);

    // TODO - see if updated content gets save to Redux state
    /*
    let mapData = jsonq(jsonData);

    // Get the node for our selected id.
    var object = mapData.find("id", function () {
      return this === nodeId;
    });

    // object.parent().value() is the node we are looking for.
     */
    this.setButtonStates(true, node);
  };

  // Set button states depending on whether the node has a parent, has children.
  setButtonStates = (isAnyNodeSelected, node) => {
    let jsonMap = getMindmap();
    if (isAnyNodeSelected) {
      const selectedNodeId = node.attr("id");
      const isNoteCollapsed = (node.attr("note-state") === "collapsed");
      const hasChild = hasChildren(selectedNodeId, jsonMap);
      const hasParentNode = hasParent(selectedNodeId, jsonMap);

      this.setState({
        closeNoteDisabled: isNoteCollapsed,
        openNoteDisabled: !isNoteCollapsed,
        deleteDisabled: hasChild,
        renameDisabled: false,
        addChildDisabled: false,
        addSiblingDisabled: !hasParentNode
      });
    } else {
      // All buttons should be deactivated when no node is selected.
      this.setState({
        closeNoteDisabled: true,
        openNoteDisabled: true,
        deleteDisabled: true,
        renameDisabled: true,
        addChildDisabled: true,
        addSiblingDisabled: true
      });
    }
  };

  deselectNode = (d, i, nodes) => {
    this.logNode("deselectNode");
    let idOfSelectedNode = d3.select(nodes[i]).attr("id");
    //console.log("Selected node id = " +  idOfSelectedNode + ", name = " +  d3.select(nodes[i]).attr("name"));

    let newTextValue = d3
      .select(nodes[i])
      .select("foreignObject")
      .select("p")
      .html();

    // TODO - increase opacity.
    d3.select(nodes[i])
      .select("circle")
      .style("fill", d => (d._children ? "#159" : "#159"));

    d3.select(nodes[i])
      .classed("node-editing", false)
      .classed("node-selected", false)
      .select("foreignObject")
      .attr("width", 120)
      .select("p")
      .attr("contenteditable", false)
      .style("width", "100px")
      .style("background-color", null);

    this.updateNodeValue(idOfSelectedNode, newTextValue);

    // TODO - save newValue to JSON
    this.updateNodeInfo("", "", this.state.mindmapId);
  };

  updateNodeValue = (idOfSelectedNode, newValue) => {
    try {
      let json = getMindmap();
      let node = findNode(idOfSelectedNode, json);
      node.name = newValue;
    } catch (error) {
      //console.log(error);
    }
  };

  handleClickOnCanvas = (d, i, nodes) => {
    //console.log("handleClickOnCanvas, nodes: " + nodes[i]);
    d3.select(nodes[i])
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
    this.setButtonStates(false, null);
  };
  //</editor-fold>

  //<editor-fold desc="// Helper functions for drawing the tree">
  appendText = nodeContainers => {
    // The "foreignObject" object will display the name text on the node.
    nodeContainers
      .append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 200)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => {
        return d.data.name;
      });
  };

  appendCircle = (nodeContainers, direction) => {
    //.attr("fill", d => d._children ? "#555" : "#999");
    let color = "#555";
    nodeContainers
      .append("circle")
      .attr("r", 10)
      .attr("fill", function(d) {
        // this.logAppendCircle(d, true);
        return color;
      });
  };

  createLinks = (g, links) => {
    let link = g
      .selectAll(".link")
      .data(links)
      .enter();

    link
      .append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return (
          "M" + d.target.y + "," + d.target.x + "C" + (d.target.y + d.source.y) / 2.5 + "," + d.target.x +
          " " + (d.target.y + d.source.y) / 2 + "," + d.source.x + " " + d.source.y + "," + d.source.x);
      });
  };

  createNodes = (g, nodes) => {
    // This should be like line 741 in TreMindMap-629.js
    // const newNodeContainers = existingNodeContainers.enter().append("g")
    // Add the the id and name and attributes here.

    // .enter() is for the new nodes.
    let node = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", function(d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    return node;
  };


  //</editor-fold>

  //<editor-fold desc="// D3 and tree layout and draw functions">
  /**
   *   Draw the full bidirectional tree.
   */
  drawTree = () => {
    let svg = d3.select("svg");
    let root = createTreeLayout(svg, this.state.height, this.state.width, getMindmap());

    root.descendants().forEach((d, i) => {
      d.id = d.data.id;
      d.name = d.data.name;
      d.note = d.data.note;
      d._children = d.children;
    });

    const nodes = root.descendants();
    const links = root.links();

    // Set both root nodes to be dead center vertically.
    nodes[0].x = this.state.height / 2;

    svg.transition()
      .duration(duration)
      .attr("height", this.state.height)
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    /*
      Use these to identify nodes and links.
      svg.select("#links").selectAll(".link")
      svg.select("#nodes").selectAll(".node")
     */

    // Try adding the links first.  New code.
    let theLinks = svg.append("g").attr("id", "links");

    let linkPaths = svg.select("#links").selectAll(".link")
      .data(links, d => d.target.id);

    // changed from newLinkPaths; just update the current.
    let linkPathEnter = linkPaths
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);

    let linkPathsUpdate = linkPathEnter.merge(linkPaths);

    // Transition links to their new position.
    linkPathsUpdate
      .transition()
      .duration(duration)
      // .attr("transform", "translate(" + this.state.width / 2 + ",0)")
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    let linkPathsExit = linkPaths
      .exit()
      .transition()
      .duration(duration)
      .attr("d", diagonal)
      .remove();

    // Update the nodes. See https://medium.com/@bryony_17728/d3-js-merge-in-depth-a3069749a84f.
    // selectAll has to be a unique name.  Note we use d.id for data as we need a key field.
    let theNodes = svg.append("g").attr("id", "nodes");

    let node = svg.select("#nodes").selectAll(".node")
      .data(nodes, d => d.id);

    node.exit().remove();

    // Enter any new nodes at the parent's previous position.  Create new node containers that each contains a circle and a text label
    let nodeEnter = node
      .enter()
      .append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("note", (d, i) => `${d.data.note}`)
      .attr("note-state", "collapsed")
      .attr("class", "node")
      .attr("transform", d => `translate(${root.y0},${root.x0})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 0);

    // The "foreignObject" object will display the name text on the node.
    nodeEnter
      .append("foreignObject")
      .attr("width", 120)
      .attr("height", 50)
      // .attr("x", -80)
      // .attr("y", -50)
      .append("xhtml:p")
      .attr("class", "node-title")
      .text(d => d.data.name);

    nodeEnter.append("circle")
      .style("opacity", 1.0);

    // Transition nodes to their new position. Increase opacity from 0 to 1 during transition.
    let nodeUpdate = node.merge(nodeEnter)
      .on("click", this.handleClickOnNode);

    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) {
        //console.log("nodeUpdate, debug: id = " + d.id + ", x pos = " + d.y + ", y pos = " + d.x);
        return "translate(" + d.y + "," + d.x + ")";
      })
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    nodeUpdate.raise();

    // Exiting nodes - remove any exiting nodes
    let nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        //console.log("nodeExit, debug: id = " + d.id + ", y = " + d.y + ", x = " + d.x);
        return "translate(" + d.y + "," + d.x + ")";
      })
      .remove();

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // #newcode - Post-it notes
    this.addNoteRects(nodeUpdate);

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // scrollable according to nodes length
    let demo = createTreeLayout(svg, this.state.height, this.state.width, getMindmap());
    const nodeLength = demo.descendants().length
    if (nodeLength > 5) {
      this.setState({
        scrollable: true
      })
    }
  };

  /**
   * Update calls drawTree() to update the D3 mind map.
   */
  update = () => {
    // d3.hierarchy object is a data structure that represents a hierarchy.  It has a number of functions defined
    // on it for retrieving things like ancestor, descendant, and leaf nodes, and for computing the path between nodes.
    let jsonMapData = getMindmap();
    if (jsonMapData && (jsonMapData !== "")) {
      this.drawTree();
    }
  };
  //</editor-fold>

  //<editor-fold desc="// JSON and load data functions">
  /**
   * This is for root children only, determines which side to add a new node.
   * @param selectedNodeId
   * @returns {string}
   */
  getNewChildDirection = (selectedNodeId) => {
    // If we are appending to the root, we need to determine which side of the map to add the child.
    let jsonData = getMindmap();
    // Change 12/1/19
    let parent = getNodeById(selectedNodeId, jsonData);
    // let parent = findParentNode(selectedNodeId, jsonData);

    let side = "";
    const isRoot = !hasParent(selectedNodeId, jsonData);
    if ( isRoot ) {
      // Figure out which side to add the node based on which side currently has fewer immediate child nodes.
      let countRight = 0;
      let countLeft = 0;
      for (let child of jsonData.children) {
        if (child.side === "left") {
          countLeft++;
        } else {
          countRight++;
        }
      }
      side = countLeft >= countRight ? "right" : "left";
    } else {
      side = parent.side;
    }
    return side;
  };

  /**
   * Create new JSON data for the mind map, then store it to Redex.
   */
  newMap = () => {
    const newJsonData = createNewMapJson();
    this.setMindmapJson(newJsonData);

    this.setState({
      isNewMap: true
    }, () => {
      this.update();
    });
  };

  /**
   * Save Mind map JSON to the database.
   */
  
  //</editor-fold>

  componentDidCatch(error, info) {
    //console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
    const { map } = this.props;

    if (map) {
        this.setState({
          mapName: map.mapName,
          mapDescription: map.mapDescription
        });
        this.setMindmapJson(map.mapData);
    } else {
      this.newMap();
    }
    this.chart();
  }

  //<editor-fold desc="// Functions for the snackbar">
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };
  //</editor-fold>

  //<editor-fold desc="// Popover functions">
  handlePopoverClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      openPopover: true
    });
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
      openPopover: false
    });
  };
  //</editor-fold>

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    if (this.state.hasError) {
      return <Redirect to="/Login" />;
    }
    const h = Math.abs(window.innerHeight*0.10);
    const w = window.innerWidth;
    return (
      <React.Fragment>
        <Grid
          container
          alignItems="center"
          justify="center"
          spacing={24}
          className={classes.svgroot}
        >
          <Grid item sm={12}>
            <TextField
              id="mapName"
              label="Name"
              onChange={this.handleChange("mapName")}
              value={this.state.mapName}
              margin="normal"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              id="mapDescription"
              label="Description"
              onChange={this.handleChange("mapDescription")}
              value={this.state.mapDescription}
              margin="normal"
              className={classes.textFieldWide}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          {checkPermision('Mind Map','modify') &&
          <Grid item sm={12} style={{paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0}}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.newMap}
              className={classes.outlinedButton}
            >
              New Mind Map
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.addChildDisabled}
              onClick={this.appendChildToSelectedNode}
              className={classes.outlinedButton}
            >
              Add Child
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.addSiblingDisabled}
              onClick={this.addSiblingToSelectedNode}
              className={classes.outlinedButton}
            >
              Add Sibling
            </Button>
            {/* <Button
              variant="contained"
              color="secondary"
              disabled={this.state.openNoteDisabled}
              onClick={this.openNote}
              className={classes.outlinedButton}
            >
              Open Note
            </Button> */}
            {/* <Button
              variant="contained"
              color="secondary"
              disabled={this.state.closeNoteDisabled}
              onClick={this.closeNote}
              className={classes.outlinedButton}
            >
              Close Note
            </Button> */}
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.deleteDisabled}
              onClick={this.removeSelectedNode}
              className={classes.outlinedButton}
            >
              Delete Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.undoDeleteDisabled}
              onClick={this.undoDeleteNode}
              className={classes.outlinedButton}
            >
              Undo Delete
            </Button>

             <Button
              variant="contained"
              color="secondary"
              onClick={()=>this.props.saveMindmap(this.state.mapName,this.state.mapDescription,this.state.isNewMap)}
              className={classes.outlinedButton}
            >
              Save Mind Map
            </Button>
            
          </Grid>}
         <Grid item sm={12} style={{margin:0,padding:0}}>
            <svg  ref={svg => (this.svg = svg)} />
          </Grid>
        </Grid>
        <Grid item sm={12} style={{overflow:'auto'}}>
          <Snackbar
            open={this.state.openSnackbar}
            onClose={this.handleClose}
            TransitionComponent={this.state.Transition}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.message}</span>}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TreeMindMap);
