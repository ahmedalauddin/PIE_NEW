import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import Paper from "@material-ui/core/Paper/index";
import Button from "@material-ui/core/Button/index";
import Avatar from "@material-ui/core/Avatar/index";
import DescriptionIcon from "@material-ui/icons/Description";
import ButtonBar from "../buttons/ButtonBar";
import CssBaseline from "./ProjectContainer";
import Topbar from "../Topbar";
import Grid from "../MindMapStatic";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: 10,
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
  },
  avatarContainer: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginBottom: theme.spacing.unit * 4
    }
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  },
  baseline: {
    alignSelf: 'baseline',
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
      marginLeft: 0
    }
  },
  inline: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  },
  inlineRight: {
    width: '30%',
    textAlign: 'right',
    marginLeft: 50,
    alignSelf: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      textAlign: 'center'
    }
  },
  backButton: {
    marginRight: theme.spacing.unit * 2
  }
});

class ProjectCardStatic extends Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Topbar/>
        <Paper className={classes.paper}>
          <div className={classes.itemContainer}>
            <div className={classes.avatarContainer}>
              <Avatar className={classes.avatar}>
                <DescriptionIcon />
              </Avatar>
            </div>
            <div className={classes.baseline}>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                >
                  Project
                </Typography>
                <Typography variant="h4" gutterBottom>
                  Improve predictability of failure
                  <br />
                </Typography>
                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                >
                  Description
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Analyze and categorize historical data coming from all plants
                  and systems to <br />
                  understand typical causes and indicators of impending
                  failures.
                  <br />
                  Affects requirement planning.
                </Typography>
              </div>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>

                </Typography>
              </div>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                >
                  Business Goal
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Improved reliability of systems, identification of signs to
                  replace parts to eliminate
                  <br /> most system failures.
                </Typography>
                <ButtonBar />
              </div>
            </div>
            <div className={classes.inlineLeft}>
              <Typography variant="h6" style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
              >
                Prioritized KPIs
              </Typography>
              <Typography variant="h5" gutterBottom>
                Service BOM Accuracy
              </Typography>
              <Typography variant="h7" gutterBottom>
                Leading KPI
                <br />
                Project started 12 February 2018
                <br />
              </Typography>
              <Typography variant="h5" gutterBottom>
                Reduction in Unplanned Activities
              </Typography>
              <Typography variant="h7" gutterBottom>
                Leading KPI
                <br />
                Project started 14 March 2018
                <br />
              </Typography>
              <Typography variant="h5" gutterBottom>
                Increase in Local Source
              </Typography>
              <Typography variant="h7" gutterBottom>
                Leading KPI
                <br />
                Project started 14 March 2018
                <br />
              </Typography>
              <Typography variant="h5"  gutterBottom>
                Improve Predictablity of Failure
              </Typography>
              <Typography variant="h7" gutterBottom>
                Leading KPI
                <br />
                Project in planning
                <br />
                <br />
              </Typography>
              <Typography variant="h5"  gutterBottom>
                First Time Right
              </Typography>
              <Typography variant="h7" gutterBottom>
                Leading KPI
                <br />
                Project in planning
              </Typography>
            </div>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectCardStatic);
