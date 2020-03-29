// Simpler version of edit project, 1/22/19.
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/index";
import Typography from "@material-ui/core/Typography/index";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    background: "",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
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
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButtom: {
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
  }
});

class EditKpi extends React.Component {
  state = {
    kpi: ""
  };

  componentDidMount() {
    const url1 = "/api/kpis/" + this.props.match.params.id;
    //if (projid > 0) {
    fetch(url1)
      .then(res => res.json())
      .then(kpi => this.setState({ kpi }));
    //}
  }

  render() {
    const { classes } = this.props;

    /* react-router has injected the value of the attribute ID into the params */
    // const id = this.props.match.params.id;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <form>
                      <Typography variant="body1" gutterBottom>
                        <label htmlFor="title">Kpi title</label>
                        <br />
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={this.state.kpi.title}
                        />
                      </Typography>

                      <Typography variant="body1" gutterBottom>
                        <label htmlFor="description">Description</label>
                        <br />
                        <input
                          id="description"
                          name="description"
                          type="description"
                          value={this.state.kpi.description}
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <label htmlFor="progress">Type</label>
                        <br />
                        <input
                          id="type"
                          name="type"
                          type="text"
                          value={this.state.kpi.type}
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <label htmlFor="status">Status</label>
                        <br />
                        <input
                          id="status"
                          name="status"
                          type="text"
                          value={this.state.kpi.taskstatus}
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <button>Submit</button>
                      </Typography>
                    </form>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(EditKpi);
