import React from "react";
import * as d3 from "d3";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../../Topbar";
import {red, grey} from "@material-ui/core/colors";
import "../tree-styles.scss";

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
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
const m = [20, 120, 20, 120];
const w = 900 - m[1] - m[3];
const h = 500 - m[0] - m[2];

export default class TreeChart extends React.Component {
  constructor(props) {
    super(props);
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
    data3: [
      {
        name: "Root",
        children: [
          {
            name: "Branch 1",
            children: [
              {name: "Leaf 3"},
              {name: "Leaf 4"}
            ]
          },
          { name: "Branch 2" }
        ]
      }
    ],
  };

  componentDidMount() {
    const tree = d3.tree().size([this.state.height, this.state.width - 160]);

    const stratify = d3
      .stratify()
      .id(d => {
        return d.name;
      })
      .parentId(d => {
        return d.parent;
      });

    const root = stratify(this.state.data).sort((a, b) => {
      return a.height - b.height || a.id.localeCompare(b.id);
    });

    this.setState({ root, links: tree(root).links() });
  }

  render() {
    const { classes } = this.props;

    if (!this.state.links) {
      return null;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <svg width={this.state.width + 100} height={this.state.height} className="tree-chart" ref={r => (this.chartRef = r)}>
          <g transform="translate(100, 0)">
            {this.renderLinks()}
            {this.renderNodes()}
          </g>
        </svg>
      </React.Fragment>
    );
  }

  renderLinks() {
    return this.state.links.map(function(data, i) {
      const link = d3
        .linkHorizontal()
        .x(d => {
          return d.y;
        })
        .y(d => {
          return d.x;
        });
      return <path key={`link${i}`} className="tree-chart__link" d={link(data)} />;
    });
  }

  renderNodes() {
    return this.state.root.descendants().map((d, i) => {
      return (
        <g key={`node${i}`} className="tree-chart__node" transform={`translate(${d.y},${d.x})`}>
          <circle r="10" />
          <text dy={20} x={-8} textAnchor={d.children ? "start" : "end"}>
            {d.id}
          </text>
        </g>
      );
    });
  }
}
