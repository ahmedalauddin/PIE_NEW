/**
 * See http://bl.ocks.org/jdarling/2d4e84460d5f5df9c0ff
 * Bidirectional version of mind map.
 *
 *
 */
import React from "react";
import * as d3 from "d3";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../../Topbar";
import { red, grey } from "@material-ui/core/colors";
import "../tree-styles.scss";
import * as Mousetrap from "mousetrap";

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
const jsonData = {
  "name": "Root",
  "children": [
    {
      "name": "Reduce operating costs",
      "children":
        [
          {
            "name": "Reduce inventory",
            "children": [
              {
                "name": "Review part models"
              },
              {
                "name": "Optimize supply chain"
              }
            ]
          }, {
          "name": "Operating procedures"
        }
        ]
    }, {
      "name": "Review supply chain processes"
    }, {
      "name": "Introduce automation"
    }
  ]};

export default class TreeMap extends React.Component {
  constructor(props) {
    super(props);
    //this.update = this.update.bind(this);
    //this.toArray = this.toArray.bind(this);
    //this.handleClick = this.handleClick.bind(this);
  }

  state = {
    root: null,
    width: 700,
    height: 500,
    data2: [
      { name: "ProjectA", parent: "" },
      { name: "ApplicationA", parent: "ProjectA" },
      { name: "EnvironmentB", parent: "ProjectA" },

      { name: "TierC", parent: "ApplicationA" },
      { name: "TierD", parent: "ApplicationA" },
      { name: "TierE", parent: "ApplicationA" },

      { name: "ServiceF", parent: "EnvironmentB" },

      { name: "ContainerG", parent: "TierE" },
      { name: "ContainerH", parent: "TierE" }
    ],
    data: [
      { name: "Main KPI", parent: "" },
      { name: "Reduce waste", parent: "Main KPI" },
      { name: "Lower inventory", parent: "Main KPI" },
      { name: "Increase uptime", parent: "Main KPI" },
      { name: "Reduce replacement time", parent: "Increase uptime" },
      { name: "Lower unnecessary inventory", parent: "Increase uptime" },
      { name: "Reduce costs for inventory", parent: "Increase uptime" },
      { name: "Optimize supply chain", parent: "Lower inventory" },
      { name: "Tag inventory", parent: "Lower unnecessary inventory" },
      { name: "Eliminate incorrect parts", parent: "Tag inventory" }
    ],
    data3:
      {
        name: "Root",
        children: [
          {
            name: "Branch 1",
            children: [{ name: "Leaf 3" }, { name: "Leaf 4" }]
          },
          { name: "Branch 2" }
        ]
      }
  };

  componentDidMount() {
    var m = [20, 120, 20, 120];
    var w = 900 - m[1] - m[3];
    var h = 500 - m[0] - m[2];
    var i = 0;
    var root;


    var selectNode = function(target) {
      if (target) {
        var selAll = d3.selectAll('#body svg .node');
        var sel = selAll.filter(function(d) {return d.id==target.id})[0][0];
        if (sel) {
          select(sel);
        }
      }
    };
    var getDirection = function(data) {
      if (!data) {
        return "root";
      }
      if (data.position) {
        return data.position;
      }
      return getDirection(data.parent);
    };
    var select = function(node) {
      // Find previously selected, unselect
      d3.select(".selected").classed("selected", false);
      // Select current item
      d3.select(node).classed("selected", true);
    };
    var handleClick = function(d, index){
      select(this);
      update(d);
    };

    var tree = d3.tree()
      .size([h, w]);
    var calcLeft = function(d){
      var l = d.y;
      if (d.position==='left') {
        l = (d.y)-w/2;
        l = (w/2) + l;
      }
      return {x : d.x, y : l};
    };

    var vis = d3.select("#body")
      .append("svg:svg")
      .attr("width", w
        + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + (w/2+m[3]) + "," + m[0] + ")");

    /*
    Mousetrap.bind("left", function() {
      // left key pressed
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        switch (dir) {
          case "right":
          case "root":
            selectNode(data.parent || data.left[0]);
            break;
          case "left":
            selectNode((data.children || [])[0]);
            break;
          default:
            break;
        }
      }
    });
    Mousetrap.bind("right", function() {
      // right key pressed
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        switch (dir) {
          case "left":
          case "root":
            selectNode(data.parent || data.right[0]);
            break;
          case "right":
            selectNode((data.children || [])[0]);
            break;
          default:
            break;
        }
      }
    });
    Mousetrap.bind("up", function() {
      // up key pressed
      var l = 0;
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        switch (dir) {
          case "root":
            break;
          case "left":
          case "right":
            var p = data.parent,
              nl = p.children || [],
              i = 1;
            if (p[dir]) {
              nl = p[dir];
            }
            l = nl.length;
            for (; i < l; i++) {
              if (nl[i].id === data.id) {
                selectNode(nl[i - 1]);
                break;
              }
            }
            break;
        }
      }
      return false;
    });
    Mousetrap.bind("down", function() {
      // down key pressed
      // up key pressed
      var l = 0;
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        switch (dir) {
          case "root":
            break;
          case "left":
          case "right":
            var p = data.parent,
              nl = p.children || [],
              i = 0;
            if (p[dir]) {
              nl = p[dir];
            }
            l = nl.length;
            for (; i < l - 1; i++) {
              if (nl[i].id === data.id) {
                selectNode(nl[i + 1]);
                break;
              }
            }
            break;
        }
      }
      return false;
    });
    Mousetrap.bind("ins", function() {
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        var name = prompt("New name");
        if (name) {
          if (dir === "root") {
            dir = data.right.length > data.left.length ? "left" : "right";
          }
          var cl = data[dir] || data.children || data._children;
          if (!cl) {
            cl = data.children = [];
          }
          cl.push({ name: name, position: dir });
          update(root);
        }
      }
    });
    Mousetrap.bind("del", function() {
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        var dir = getDirection(data);
        if (dir === "root") {
          alert("Can't delete root");
          return;
        }
        var cl = data.parent[dir] || data.parent.children;
        if (!cl) {
          alert("Could not locate children");
          return;
        }
        var i = 0,
          l = cl.length;
        for (; i < l; i++) {
          if (cl[i].id === data.id) {
            let resp = true;
            // let resp = confirm("Sure you want to delete " + data.name + "?");
            if (resp === true) {
              cl.splice(i, 1);
            }
            break;
          }
        }
        selectNode(root);
        this.update(root, null, root, tree);
      }
    });
    Mousetrap.bind("enter", function() {
      var selection = d3.select(".node.selected")[0][0];
      if (selection) {
        var data = selection.__data__;
        data.name = prompt("New text:", data.name) || data.name;
        update(root, null, root, tree);
      }
    });
     */
    /*
    var addNodes = function(dir) {
      root[dir].push(
        { name: "bar", position: dir },
        { name: "none", position: dir },
        { name: "some", position: dir },
        { name: "value", position: dir }
      );
      update(root);
    };
     */

    var json = jsonData;
    root = json;
    window.data = json;

    var l = json.children.length;

    root.x0 = h / 2;
    root.y0 = 0;

    json.left = [];
    json.right = [];
    for (; i < l; i++) {
      if (i % 2) {
        json.left.push(json.children[i]);
        json.children[i].position = "left";
      } else {
        json.right.push(json.children[i]);
        json.children[i].position = "right";
      }
    }
    update(root, true);
    selectNode(root);

    var toArray = function(item, arr, d){
      arr = arr || [];
      var dr = d || 1;
      var i = 0, l = item.children?item.children.length:0;
      arr.push(item);
      if(item.position && item.position==='left'){
        dr = -1;
      }
      item.y = dr * item.y;
      for(; i < l; i++){
        toArray(item.children[i], arr, dr);
      }
      return arr;
    };

    function update(source, slow) {
      var duration = (d3.event && d3.event.altKey) || slow ? 1000 : 100;

      // Compute the new tree layout.
      var nodesLeft = d3.tree()
        .size([h, (w / 2) - 20])
        .children(function (d) {
          return (d.depth === 0) ? d.left : d.children;
        })
        .nodes(root)
        .reverse();
      var nodesRight = d3.tree()
        .size([h, w / 2])
        .children(function (d) {
          return (d.depth === 0) ? d.right : d.children;
        })
        .nodes(root)
        .reverse();


      root.children = root.left.concat(root.right);
      root._children = null;
      var nodes = toArray(root);

      // Update the nodes
      var node = vis.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", function(d){ return d.selected?"node selected":"node"; })
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", handleClick);

      nodeEnter.append("svg:circle")
        .attr("r", 1e-6);

      nodeEnter.append("svg:text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", 14)
        .attr("text-anchor", "middle")
        .text(function(d) { return (d.name || d.text); })
        .style("fill-opacity", 1);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("text")
        .text(function(d) { return (d.name || d.text); });

      nodeUpdate.select("circle")
        .attr("r", 4.5);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

    };
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        D3 Map goes here
        <svg
          width={this.state.width + 100}
          height={this.state.height}
          className="tree-chart"
          ref={r => (this.chartRef = r)}
        >
          <g transform="translate(100, 0)" />
        </svg>
      </React.Fragment>
    );
  }
}
