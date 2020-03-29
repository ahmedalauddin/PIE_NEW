/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/Dmap.js
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-02
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../../Topbar";
import "../../../stylesheets/Draft.css";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import * as d3 from "d3";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    paddingBottom: 200
  },
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

const jsonData = '{"name": "Root", "children": [{name": "Branch 1", "children": [{"name": "Leaf 3"}, {"name": "Leaf 4"}]}, {"name": "Branch 2"}]}';


class Dmap extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    project: {},
    organizations: [],
    departments: [],
    projid: 0,
    title: "",
    myData: null,
    jsonData: "",
    businessGoal: "",
    org: "",
    orgId: "",
    orgName: "",
    description: "",
    value: 0,
    hasError: "",
    expanded: null,
    openSnackbar: false,
    snackbarMessage: "",
    message: ""
  };

  componentDidMount() {
    this.loadJson();
  }

  loadJson = () => {
    d3.json(jsonData, function(json){
      // do stuff
      this.setState({
        myData: json
      });
    });
    console.log("here.");
    // update(root, true);
    // selectNode(root);

  };

  componentDidCatch() {
    // return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;


    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <Typography
                  variant="h5"
                  component="h2"
                  color="secondary"
                  gutterBottom
                >
                  D3
                </Typography>
                Hi D3 Chart
                <svg width="960" height="500"
                  style={{border:'solid 1px #eee',borderBottom:'solid 1px #ccc'}} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dmap);
