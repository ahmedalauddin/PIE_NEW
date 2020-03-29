import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Paper from "@material-ui/core/Paper/index";
import Typography from "@material-ui/core/Typography/index";
import Grid from "@material-ui/core/Grid/index";
import InstructionDialog from "../dialogs/InstructionDialog";
import SwipeDialog from "../dialogs/SwipeDialog";
import Topbar from "../Topbar";
import ProjectCardItem from "../cards/ProjectCardItem";
import ActionCardItem from "../cards/ActionCardItem";
import styles from "../styles/DashboardStyles";

class HighlightDashboard extends Component {
  state = {
    learnMoreDialog: false,
    getStartedDialog: false,
    projects: [],
    actions: []
  };

  componentDidMount() {
    fetch("/api/projects-recent")
      .then(res => res.json())
      .then(projects => this.setState({ projects }));
    fetch("/api/tasks/mostrecent")
      .then(res => res.json())
      .then(actions => this.setState({ actions }));
  }

  openDialog = event => {
    this.setState({ learnMoreDialog: true });
  };

  dialogClose = event => {
    this.setState({ learnMoreDialog: false });
  };

  openGetStartedDialog = event => {
    this.setState({ getStartedDialog: true });
  };

  closeGetStartedDialog = event => {
    this.setState({ getStartedDialog: false });
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    let i = 1;
    let j = 1;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Projects</Typography>
                    <Typography variant="body2">
                      Active projects listed by last update.
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={24} xs={12} justify="center">
                {this.state.projects.map(Project => {
                  if (i <= 3) {
                    i++;
                    return (
                      <Grid item xs={12} md={4}>
                        <ProjectCardItem title={Project.title} projid={Project.id} description={Project.description}
                          started={Project.startAt}/>
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })
                }
              </Grid>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Actions</Typography>
                    <Typography variant="body2">
                      Active action items listed by last update.
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={24} xs={12} justify="center">
                {this.state.actions.map(Action => {
                  if (j <= 6) {
                    j++;
                    return (
                      <Grid item xs={12} md={4}>
                        <ActionCardItem title={Action.title} actionid={Action.id} description={Action.description}
                                        status={Action.taskstatus} updated={Action.updatedAt}/>
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })}
              </Grid>
            </Grid>
          </Grid>
          <SwipeDialog
            open={this.state.learnMoreDialog}
            onClose={this.dialogClose}
          />
          <InstructionDialog
            open={this.state.getStartedDialog}
            onClose={this.closeGetStartedDialog}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(HighlightDashboard));
