/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-08-29
 * Changes:  Added editor folding.  Styles for D3 and svg now specified more in mindmap.scss.
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import { store, getOrgId, getOrgName, setMindmapNode, setMindmap, getMindmap } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import "./mindmap.scss";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { createId, createNewMapJson } from "./MindMapFunctions";
import TextField from "@material-ui/core/TextField";
import * as jsonq from "jsonq";
import { createTreeLayout } from "./MindmapLayout";
import { hasChildren, hasParent, findNode, findParentNode, getNodeById, getNodeJson} from "./JsonNodeFunctions";
import { jsonTestData } from "./TestJsonData";

//<editor-fold desc="// Constant declarations">
const styles = theme => ({
  grid: {
    width: 1500,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  typography: {
    padding: theme.spacing.unit * 2
  },
  main: {
    //stroke: "#05668D",
    //fill: "white",
    strokeWidth: "2px"
  },
  title: {
    fontFamily: "Arial, Helvetica, Geneva, sans-serif",
  },
  text: {
    fill: "black",
    fontFamily: "Verdana, Arial, Helvetica, Geneva, sans-serif",
    //fontSize: "10px",
  },
  nodeTitle: {
    fontFamily: "Arial"
  },
  note: {
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    outline: "none"
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  }
});
// eslint-disable-next-line no-unused-vars
const duration = 100;
const dx = 100;
const dy = 100;
const DEBUG_USE_TEST_DATA = false;
const margin = { top: 40, right: 100, bottom: 40, left: 100 };
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
// const vWidth = 350;
// const vHeight = 600;
const vDuration = 1000;
// const vDelay = 250;
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
    this.selectNode = this.selectNode.bind(this);
    this.deselectNode = this.deselectNode.bind(this);
    this.updateNodeValue = this.updateNodeValue.bind(this);
    this.setButtonStates = this.setButtonStates.bind(this);
    this.saveJson = this.saveJson.bind(this);
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
      width: window.innerWidth * 0.7,         // width for the mind map
      height: window.innerHeight - 400,       // height for the mind map
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
      notesStringArray: []
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

    const nodes = root.descendants();
    const links = root.links();
    let g = d3.select("svg");

    this.openNote();
  };

  // Save all notes into JSON.
  saveNoteToJson = () => {
    let svg = d3.select("svg");
    let json = getMindmap();

    console.log("called saveNoteToJson");
    let nodes = svg.selectAll("#nodes").selectAll("g").selectAll("foreignObject.note");
    nodes.each((d, i) => {
      console.log("d note " + d.note + ", id " + d.id);
      let jsonNode = getNodeById(d.id, json);
      if (this.textContent) {
        // note text has been updated
        console.log("jsonNode note updated: " + this.textContent);
        // TODO: may have to ctach this and update here.
      }
      console.log("jsonNode note: " + jsonNode.note + ", id: " + jsonNode.id);

    });
    // TODO: check to see if note updates JSON.

    console.log("saveNoteToJson complete.");
  };

  // Open post-it note for selected ID
  openNote = () => {
    let selectedNode = this.findSelectedNode();

    // This changes the note to a yellow square.
    selectedNode.select("rect")
    // selectedNode.append("rect")
      .transition().duration(vDuration)
      .attr("rx", 0).attr("x", 10).attr("y", 8)
      .attr("width", vRad * 8).attr("height", vRad * 10)
      .style("fill", function(d) { return noteColor[0]; })
      .style("stroke", function(d) { return noteColor[0]; })
      .style("opacity", 1.0);
    selectedNode.raise();

    // Add <text> and labels
    let selectedPostit = selectedNode.select("foreignObject.note");
      //.transition().duration(vDuration);

    selectedPostit
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad * 7)
      .attr("height", vRad * 9)
      .append("xhtml:p")
      .attr("contenteditable", true)
      .text(d => d.data.note)
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px");

    selectedNode.attr("note-state", "expanded");

    this.setState({
      closeNoteDisabled: false,
      openNoteDisabled: true
    });

    console.log("openNote complete.");
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
    // Try this later.
    // const noteText = selectedPostit.select("p.note").text();

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


    // TODO: test and fix
    // New code 9/22/19
    this.updateJsonData();
    // end new code
    // store.dispatch(setMindmap(JSON.stringify(newJsonData)));

    this.setState({
      closeNoteDisabled: true,
      openNoteDisabled: false
    });
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
    }
  }

  addNoteRects = (nodeContainers) => {
    let g = d3.select("svg");
    // Add <g>s
    //let vRects = g.selectAll("g").data(nodes).enter().append("g");
    // .attr("transform", function (d) { return "translate(" + (d.y - vRad) + "," + (d.x - vRad) + ")"; });

    // Draw <rect>s
    nodeContainers.append("rect").attr("class","main")
      //.attr("width", 0).attr("height", 0)
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
    store.dispatch(setMindmap(JSON.stringify(jsonData)));

    // Save the JSON back to state.
    this.setState({
      deletedNodes: deletedNodes,
      undoDeleteDisabled: undoDeleteDisabled
    });

    this.update();
  };
  //</editor-fold>

  //<editor-fold desc="// Node functions">
  handleKeypressEsc = svg => {
    // TODO: this isn't getting called.
    svg
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
  };


  findSelectedNodeId = svg => {
    // Operates on mindmap D3 svg.
    let idOfSelectedNode = this.findSelectedNode()
      .attr("id");
    return idOfSelectedNode;
  };

  findSelectedNodeName = () => {
    // Operates on mindmap D3 svg.
    let nameOfSelectedNode = this.findSelectedNode()
      .attr("name");
    return nameOfSelectedNode;
  };

  findSelectedNode = () => {
    // Operates on mindmap D3 svg.
    let svg = d3.select(this.svg);
    let nodeSelected = svg.selectAll("g.node").filter(".node-selected");
    return nodeSelected;
  };

  // Uses our callback to send info to other components.
  updateNodeInfo = (selectedNodeId) => {
    this.props.callback(selectedNodeId);
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
    console.log(message, ": node ID = " + this.findSelectedNodeId(svg) +
      ", name = " + this.findSelectedNodeName());
  };

  getSelectedNode = (nodes, i) => {
    return d3.select(nodes[i]);
  };

  handleClickOnNode = (d, i, nodes) => {
    console.log("handleClickOnNode: clicked on a node.");
    // const currentlySelectedNode = this.getSelectedNode(nodes, i);
    const currentlySelectedNode = d3.selectAll(nodes).filter(".node-selected");

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeId = d3.select(clickedNode).attr("name");
    const otherNodes = d3
      .selectAll(nodes)
      .filter((d, i) => i !== clickedNodeIndex);

    if (
      currentlySelectedNode.size() > 0 &&
      currentlySelectedNode.attr("name") === clickedNodeId
    ) {
      console.log("going into edit mode!");
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
    console.log("handleClickOnPostit: clicked on a post-it note.");
    let svg = d3.select("svg");
    const noteWidth = vRad * 6;
    const noteTextWidth = (vRad * 6) - 6;
    const noteHeight = vRad * 10;
    const selectedNode = this.getSelectedNode(nodes, i);
    const clickedNode = nodes[i];
    const clickedId = d3.select(clickedNode).attr("id");

    let selectionCriteria = "[id=" + clickedId + "]";
    let thisNode = svg.selectAll("g.node").select(selectionCriteria);

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
        .attr("width", 120)
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
  appendChildToSelectedNode = () => {
    // This version appends a child to the JSON, not the svg.  7/17/19.
    let svg = d3.select(this.svg);
    let idOfSelectedNode = this.findSelectedNodeId(svg);

    let json = getMindmap();
    let parent = getNodeById(idOfSelectedNode, json);

    // Create the child.
    let child = {
      name: "new",
      id: createId(),
      description: "",
      side: this.getNewChildDirection(),
      note: ""
    };

    // TODO: change this to add child to the JSON, or get parent directly from the JSON.
    // Should just be able to change the JSON element.  For instance, change this:
    //
    if (parent.children) parent.children.push(child);
    else parent.children = [child];

    store.dispatch(setMindmap(JSON.stringify(json)));
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

    store.dispatch(setMindmap(JSON.stringify(jsonMapData)));
    this.update();
  };

  removeSelectedNodeFromData = () => {
    // Removes selected node from the JSON data, stored in state.  Just need the id field.
    // Also updates our deleted nodes data, so we can undelete later.
    let selectedNode = this.findSelectedNode();
    // let jsonData = [getMindmap()];
    let jsonData = getMindmap();
    let parent = findParentNode(selectedNode.attr("id"), jsonData);

    if (parent && parent.children) {
      // This deletes from the JSON.
      parent.children = parent.children.filter(
        child => child.id !== selectedNode.attr("id")
      );
      parent.children.length === 0 && delete parent.children;
    }
    console.log("JSON for jsonData now is:" + JSON.stringify(jsonData));
    let deletedNode = {
      id: selectedNode.attr("id"),
      name: selectedNode.attr("name"),
      description: selectedNode.attr("description"),
      note: selectedNode.attr("note"),
      parentId: parent.id
    };
    let deletedNodes = this.state.deletedNodes;
    deletedNodes.push(deletedNode);

    store.dispatch(setMindmap(JSON.stringify(jsonData)));
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
    console.log("Org = " + getOrgName());
    if (!(getOrgId() > 0 )) {
      console.log("Need to redirect to login");
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

      // 2.1 Create a container for all the nodes in the graph
      const gNode = svg
        .append("g")
        .attr("id", "nodes")
        .attr("cursor", "pointer");

      // 2.2 Create a container for all the links in the graph
      const gLink = svg
        .append("g")
        .attr("id", "links")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1.5);

      // 3. Fill in the nodes and links with the hierarchy data
      this.update();
      let appendChildToSelectedNode = this.appendChildToSelectedNode;
      let addSiblingToSelectedNode = this.addSiblingToSelectedNode;
      let removeSelectedNode = this.removeSelectedNode;
      let handleKeypressEsc = this.handleKeypressEsc;

      // 4. Register other event handlers
      d3.select("body").on("keydown", function (e) {
        // eslint-disable-next-line no-console
        console.log(`keydown: ${d3.event.keyCode}`);
        // Check to see if a node is being edited
        let nodeIsBeingEdited = gNode.select("g.node-editing").size();

        if (d3.event.keyCode === 9) {
          console.log("tab - append child to selected node");
          // appendChildToSelectedNode(svg);
        } else if (d3.event.keyCode === 13 && !nodeIsBeingEdited) {
          console.log("enter - add sibling to selected node");
          // addSiblingToSelectedNode(svg);
        } else if (d3.event.keyCode === 8 && !nodeIsBeingEdited) {
          console.log("delete - remove selected node");
          // removeSelectedNode(svg);
        } else if (d3.event.keyCode === 27) {
          console.log("esc - deselect node");
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
    console.log(`${node.attr("name")} is being edited`);
  };

  selectNode = node => {
    let updateJsonData = this.updateJsonData;
    let jsonData = getMindmap();
    let nodeId = node.attr("id");
    // 10/2/19 - this is where we'll use our Redux function to store the node.
    // Need to pass in the node's json here, e.g. {"id": "_jb42g162q", "name": "new", "note": "", "side": "left"}.
    let nodeJson = getNodeJson(nodeId, jsonData);
    store.dispatch(setMindmapNode(JSON.stringify(nodeJson)));

    node
      .classed("node-selected", true)
      .select("foreignObject")
      .select("p")
      .attr("contenteditable", true)
      .style("background-color", "#ddd")
      .on("blur", function() {
        updateJsonData();
      });
    node
      .classed("node-selected", true)
      .select("circle")
      .style("fill", "green");

    // This is for the callback to our other components.
    // TODO - check if this works
    this.updateNodeInfo(node.attr("id"));

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
    if (isAnyNodeSelected) {
      const selectedNodeId = node.attr("id");
      const isNoteCollapsed = (node.attr("note-state") === "collapsed");
      const hasChild = hasChildren(selectedNodeId, getMindmap());
      const hasParentNode = hasParent(selectedNodeId, getMindmap());

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
    console.log("Selected node id = " +  idOfSelectedNode + ", name = " +  d3.select(nodes[i]).attr("name"));

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
      .select("p")
      .attr("contenteditable", false)
      .style("background-color", null);

    this.updateNodeValue(idOfSelectedNode, newTextValue);

    // TODO - save newValue to JSON
    this.updateNodeInfo("");
  };

  updateNodeValue = (idOfSelectedNode, newValue) => {
    let node = findNode(idOfSelectedNode, getMindmap());
    node.name = newValue;
  };

  handleClickOnCanvas = (d, i, nodes) => {
    console.log("handleClickOnCanvas, nodes: " + nodes[i]);
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



  // Draw the full bidirectional tree.
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

    const transition = svg
      .transition()
      .duration(duration)
      .attr("height", this.state.height)
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Update the nodes. See https://medium.com/@bryony_17728/d3-js-merge-in-depth-a3069749a84f.
    // selectAll has to be a unique name.  Note we use d.id for data as we need a key field.
    let node = svg
      .selectAll("#nodes")
      .selectAll("g")
      .data(nodes, d => d.id);

    node.exit().remove();

    // try adding the links first.
    let linkPaths = svg.append("g").attr("class", "links")
      .selectAll("path")
      .data(links, d => d.target.id);


    // Update the links.
    /*
    let linkPaths = svg
      .select("#links")
      .selectAll("path")
      .data(links, d => d.target.id);
    */



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
      .attr("transform", "translate(" + this.state.width / 2 + ",0)")
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    let linkPathsExit = linkPaths
      .exit()
      .transition()
      .duration(duration)
      .attr("d", diagonal)
      .remove();


    // Enter any new nodes at the parent's previous position.
    // Create new node containers that each contains a circle and a text label
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
      .attr("width", 400)
      .attr("height", 50)
      // .attr("x", -80)
      // .attr("y", -50)
      .append("xhtml:p")
      .attr("class", "node-title")
      .text(d => d.data.name);


    nodeEnter.append("circle")
    //.style("opacity", 1.0)
      .style("fill", "#f46d43").raise();
    //.style("fill-opacity", 1.0);

    // Transition nodes to their new position. Increase opacity from 0 to 1 during transition.
    let nodeUpdate = node.merge(nodeEnter)
      .on("click", this.handleClickOnNode);

    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) {
        console.log("nodeUpdate, debug: id = " + d.id + ", x pos = " + d.y + ", y pos = " + d.x);
        return "translate(" + d.y + "," + d.x + ")";
      })
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    nodeUpdate.raise();

    // Exiting nodes - remove any exiting nodes
    let nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        console.log("nodeExit, debug: id = " + d.id + ", y = " + d.y + ", x = " + d.x);
        return "translate(" + d.y + "," + d.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    /*
    // Transition exiting nodes to the parent's new position.
    // Reduce opacity from 1 to 0 during transition
     let nodeExit = nodeContainers
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", d => `translate(${root.y},${root.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);
     */



    // #newcode - Post-it notes
    this.addNoteRects(nodeEnter);

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  update = () => {
    // d3.hierarchy object is a data structure that represents a hierarchy.  It has a number of functions defined
    // on it for retrieving things like ancestor, descendant, and leaf nodes, and for computing the path between nodes.
    let jsonMapData = getMindmap();
    if (jsonMapData && (jsonMapData != "")) {
      this.drawTree();
      this.setState({
        isNewMap: false
      });
    }
  };
  //</editor-fold>

  //<editor-fold desc="// JSON and load data functions">
  // This is for root children only, to determine which side to add the the node to.
  getNewChildDirection = (selectedNodeId) => {
    // If we are appending to the root, we need to determine which side of the map to add the child.
    let jsonData = getMindmap();
    let parent = getNodeById(selectedNodeId, jsonData);
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

  newMap = () => {
    // Create new JSON data as defined in the global const, then set state.
    const newJsonData = createNewMapJson();
    store.dispatch(setMindmap(JSON.stringify(newJsonData)));

    this.setState({
      isNewMap: true
    }, () => {
      this.update();
    });
  };

  saveJson = () => {
    this.saveNoteToJson();
    console.log("JSON:" + JSON.stringify(getMindmap()));
    let postData = {
      orgId: this.state.orgId,
      mapData: getMindmap()
    };

    // Method -- POST (create) or PUT (update) depending if we're working on a new mindmap.
    let method = (!this.state.isNewMap) ? "PUT" : "POST";
    let url = (!this.state.isNewMap) ? "/api/mindmaps" + this.props.mindmapId : "/api/mindmaps";

    setTimeout(() => {
      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      })
        .then(response => {
          if (response.status !== 400) {
            this.setState({
              openSnackbar: true,         // Success - open the snackbar
              message: "Mind map saved."
            });
          } else {
            // TODO: consider handling a 400 response.
          }
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  };
  //</editor-fold>

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
    const mindmapId = this.props.mindmapId;

    // Try to fetch data.
    if (mindmapId > 0) {
      fetch(`/api/mindmaps/${mindmapId}`)
        .then(response => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(map => {
              // process your JSON data further
              if (map) {
                this.setState({
                  mapName: map.mapName,
                  mapDescription: map.mapDescription
                });
                // Call Redux here.
                store.dispatch(setMindmap(JSON.stringify(map.mapData)));
              } else {
                this.newMap();
              }
            });
          } else {
            this.newMap();
          }
        })
        .then(() => {
          this.chart();
        });
    } else {
      this.newMap();
      this.chart();
    }
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

    return (
      <React.Fragment>
        <Grid
          container
          alignItems="center"
          justify="center"
          spacing={24}
          className={classes.root}
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
          <Grid item sm={12}>
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
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.openNoteDisabled}
              onClick={this.openNote}
              className={classes.outlinedButton}
            >
              Open Note
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.closeNoteDisabled}
              onClick={this.closeNote}
              className={classes.outlinedButton}
            >
              Close Note
            </Button>
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
              onClick={this.saveJson}
              className={classes.outlinedButton}
            >
              Save Mind Map
            </Button>
          </Grid>
          <Grid item sm={12}>
            <svg width="900" height="600" ref={svg => (this.svg = svg)} />
          </Grid>
        </Grid>
        <Grid item sm={12}>
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
