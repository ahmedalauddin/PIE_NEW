/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-17
 * Changes:  Moving state into constructor.
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import Tree from 'react-d3-tree';
import { red, grey } from "@material-ui/core/colors";
import "../tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getOrgId, getOrgName } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import "./mindmap.scss";

const styles = theme => ({
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
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
  avatar: {
    backgroundColor: red[500]
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
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
// Use this JSON data to test a new mind map, starting only with root.
// eslint-disable-next-line no-unused-vars
const treeData = {
  "id": "_ns1nvi0ai",
  "name": "Increase plant availability",
  "children": [{
    "id": "_o4r47dq71",
    "name": "Reduce operating costs",
    "children": [{
      "id": "_al6om6znz",
      "name": "Reduce inventory",
      "children": [{"id": "_46ct4o4oy", "name": "Increase parts availability"}, {
        "id": "_ea00nojwy",
        "name": "Optimize supply chain"
      }]
    }, {
      "id": "_z3uk0721f",
      "name": "Operating procedures",
      "children": [{"id": "_je49rrvdq", "name": "TBD"}, {
        "id": "_riy5iihy9",
        "name": "yellow"
      }, {"id": "_sy8zlb7vz", "name": "blue"}]
    }]
  }, {"id": "_uajrljib9", "name": "Review supply chain processes"}, {
    "id": "_uguzpgdta",
    "name": "Introduce automation",
    "children": [{
      "id": "_t8ln1vlwa",
      "name": "white",
      "children": [
        {"id": "_qzltyy8rn", "name": "green"},
        {"id": "_92xtmt66p", "name": "maroon"}
      ]
    }]
  }]
};
const dx = 1200;   // what is dx?
const dy = 125;
const width = 1000;
const height = 1000;
const logCreateNode = true;
const logAppendPaths = true;
const logAppendCircle = true;
const logAppendText = true;
const containerStyles = {
  width: "1200",
  height: "80vh",
}

class D3Tree extends React.Component {
  constructor(props) {
    super(props);
    console.log("End D3Tree constructor.");
  }

  ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };


  componentDidMount() {
    // this.chart();
  }

  drawTree = (root, direction) => {
    console.log("Calling drawTree for direction: " + direction);

    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }

    if (direction === "left") {
      return (
        <Tree data={root}
          translate={{x: 400, y:400}}
          nodeSize={{x: -80, y:50}}/>
      );
    } else {
      return (
        <Tree data={root}
          translate={{x: 400, y:400}}
          nodeSize={{x: 80, y:50}}/>
      );
    }
  }


  loadData = (direction) => {
    // Loads JSOn data into a D3 tree hierarchy.
    let myData = "";

    let jsonData = treeData;
    let split_index = Math.round(jsonData.children.length / 2);

    if (direction === "left") {
      // Left data
      myData = {
        name: jsonData.name,
        children: JSON.parse(JSON.stringify(jsonData.children.slice(split_index)))
      };
    } else {
      // Right data
      myData = {
        name: jsonData.name,
        children: JSON.parse(JSON.stringify(jsonData.children.slice(0, split_index)))
      };
    }
    return myData;
  };

  chart = () => {
    let leftTree = this.loadData("left");
    let rightTree = this.loadData("right");

    // this.drawTree(leftTree, "left");
    return (
      this.drawTree(leftTree, "left"),
      this.drawTree(rightTree, "right")
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid container alignItems="center" justify="center" spacing={24} className={classes.root}>
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
              onClick={this.appendChild}
              className={classes.outlinedButton}
            >
              Add Child Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.addSibling}
              className={classes.outlinedButton}
            >
              Add Sibling Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.addNote}
              className={classes.outlinedButton}
            >
              Add Note
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.deleteNode}
              className={classes.outlinedButton}
            >
              Delete Node
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
            <Typography variant="h6">
              Mind Map
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <div id="treeWrapper" style={containerStyles} >

              {this.drawTree(this.loadData("right"), "right")}
              {this.drawTree(this.loadData("left"), "left")}
            </div>
          </Grid>
        </Grid>
     </React.Fragment>
    );
  }
}

export default withStyles(styles)(D3Tree);
