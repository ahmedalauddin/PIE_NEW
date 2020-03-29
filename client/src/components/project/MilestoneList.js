import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {Link, Redirect} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import moment from "moment";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import AddIcon from "@material-ui/core/SvgIcon/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { styles } from "../styles/MilestoneStyles";

class MilestoneList extends React.Component {
  constructor(props) {
    super(props);
    this.editMilestone = this.editMilestone.bind(this);
    this.editAction = this.editAction.bind(this);
    this.renderMilestoneRedirect = this.renderMilestoneRedirect.bind(this);
    this.renderActionRedirect = this.renderActionRedirect.bind(this);
  }

  state = {
    milestones: [],
    redirectMilestone: false,
    redirectMilestoneId: 0,
    redirectAction: false,
    redirectActionId: 0
  };

  renderMilestoneRedirect = () => {
    if (this.state.redirectMilestone) {
      return <Redirect to={{
        pathname: '/milestone',
        state: {
          projectId: `${this.props.projectId}`,
          milestoneId: `${this.state.redirectMilestoneId}`
        }
      }}
      />;
    } else {
      return "";
    }
  }

  renderActionRedirect = () => {
    if (this.state.redirectAction) {
      return <Redirect to={{
        pathname: '/action',
        state: {
          projectId: `${this.props.projectId}`,
          actionId: `${this.state.redirectActionId}`
        }
      }}
      />;
    } else {
      return "";
    }
  }

  componentDidMount() {
    // MilestoneList is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    let projectid = parseInt(this.props.projectId);

    if (projectid) {
      // Fetch the KPIs only for a single project
      fetch(`/api/milestones-project/${projectid}`)
        .then(res => res.json())
        .then(milestones => this.setState({ milestones: milestones }));
    }
  }

  editMilestone(id) {
    this.setState({
      redirectMilestone: true,
      redirectMilestoneId: id
    });
  }

  editAction(id) {
    this.setState({
      redirectAction: true,
      redirectActionId: id
    });
  }

  render() {
    const { classes } = this.props;
    const { milestones } = this.state;

    return (
      <div>
        {this.renderActionRedirect()}
        {this.renderMilestoneRedirect()}
        <List component="nav" className={classes.root}>
          {milestones.map((milestone,i) => (
            <div key={milestone}>
              <ListItem alignItems="flex-start">
                <AlarmOnIcon coor="primary" className={classes.leftIcon}/>
                  <ListItemIcon>
                  <IconButton onClick={() => {this.editMilestone(milestone.id);}}>
                    <EditIcon color="primary" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={`Milestone ${i+1}: ${milestone.title}`}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" className={classes.inline} color="textPrimary">
                        Target date: {" " + moment(milestone.targetDate).format("MM/DD/YYYY")},
                        Status: { milestone.status.label }
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
                {milestone.tasks.map(task => (
                  <ListItem className={classes.nested}>
                    <ListItemIcon>
                      <IconButton onClick={() => {this.editAction(task.id);}}>
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText inset
                      primary={`${task.title}: ${task.description}`}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" className={classes.inline} color="textPrimary">
                            Priority: {task.priority.label}<br/>
                            Assigned to: {task.assigned.fullName}<br/>
                            Status: { task.status.label }
                          </Typography>
                        </React.Fragment>
                      }
                    />
                </ListItem>
                )
              )}
            </div>
          ),
          this)
          }
        </List>
        <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
          aria-label="Add Action" to={{pathname: "/action", state: {projectId: this.props.projectId} }} >
          Add Action
          <AddIcon className={classes.rightIcon} />
        </Button>
      </div>
    );
  }
}

MilestoneList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MilestoneList);
