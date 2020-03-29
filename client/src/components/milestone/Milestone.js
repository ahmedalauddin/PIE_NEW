/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Milestone.js
 * Descr:    Milestone component.  Allows create and update.
 * Created:  2019-05-03
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-20
 * Editor:   Brad Kaufman
 * Notes:
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { getOrgId, getOrgName, getOrgDepartments, getProjectName, getProject } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import {red} from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";

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

class Milestone extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.state = {
      project: {},
      projectId: 0,
      title: "",
      id: 0,
      description: "",
      orgId: 0,
      projectName: "",
      projectStartAt: null,
      projectEndAt: null,
      msg: "",
      statusId: 0,
      buttonText: "Create",
      readyToRedirect: false,
      validationError: false,
      openSnackbar: false,
      message: "",
      isEditing: false,
      redirect: false,
      isNew: false,
      expanded: false,
      statusList: [],
      hasError: false,
      labelWidth: 0,
      focus: false,
      nextItem: ""
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleSubmit(event) {
    event.preventDefault();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const milestoneId = parseInt(this.props.location.state.milestoneId);
    let apiPath = "";
    let successMessage = "";
    let validationErrorMessage = "Milestone '" + this.state.title + "' could not be added.  The milestone falls " +
      "outside the range of the project start and end dates.  Please correct the milestone's target " +
      "date and and submit your request again.";
    let method = "";

    if (milestoneId > 0) {
      // For updates
      apiPath = "/api/milestones/" + milestoneId;
      successMessage = "Milestone '" + this.state.title + "' updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/milestones/";
      successMessage = "Milestone '" + this.state.title + "' created."
      method = "POST";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 400) {
            // Error: for now, we'll assume it's with the milestone not being within the project start and end dates.
            this.setState({
              readyToRedirect: false,
              message: validationErrorMessage,
              validationError: true,
              openSnackbar: true
            });
          } else {
            // Redirect to the Project component.
            this.setState({
              readyToRedirect: true,
              message: successMessage
            });
          }
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
      }, 2000);
  };

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });
  };

  componentDidMount() {
    this.setOrganizationInfo();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const milestoneId = this.props.location.state.milestoneId;

    if (parseInt(milestoneId) > 0) {
      fetch(`/api/milestones/${milestoneId}`)
        .then(res => res.json())
        .then(milestone => {
          let project = getProject();
          this.setState({
            id: milestoneId,
            title: milestone.title,
            description: milestone.description,
            targetDate: milestone.targetDate,
            statusId: milestone.statusId,
            projectName: milestone.project.title,
            projectId: projectId,
            projectStartAt: project.startAt,
            projectEndAt: project.endAt,
            buttonText: "Update"
          });
        });
    } else {
      let projectName = getProjectName();
      let project = getProject();
      this.setState({
        isEditing: true,
        projectId: projectId,
        projectName: projectName,
        projectStartAt: project.startAt,
        projectEndAt: project.endAt,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/taskstatuses")
      .then(results => results.json())
      .then(statuses => this.setState({ statusList: statuses }));
  }

  render() {
    const { classes } = this.props;
    const { tags, suggestions } = this.state;
    const projectId = this.props.location.state.projectId;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `/project/${projectId}`,
        state: {
          message: `${this.state.message}`
        }
      }} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    Milestone Detail<br/>
                  </Typography>
                  <Typography variant="h7">
                    Project: {this.state.projectName}
                  </Typography>
                  <Typography variant="h7">
                    Organization: {getOrgName()}
                  </Typography>
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="title-required"
                        label="Title"
                        fullWidth
                        onChange={this.handleChange("title")}
                        value={this.state.title}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="description"
                        label="Description"
                        multiline
                        rowsMax="6"
                        value={this.state.description}
                        onChange={this.handleChange("description")}
                        className={classes.textField}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="targetDate"
                        label="Target Date"
                        type="date"
                        value={this.state.targetDate}
                        onChange={this.handleChange("targetDate")}
                        className={classes.textFieldWide}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="status-simple">
                          Status
                        </InputLabel>
                        <Select
                          value={this.state.statusId}
                          onChange={this.handleSelectChange}
                          inputProps={{
                            name: "statusId",
                            id: "statusId"
                          }}
                        >
                          {this.state.statusList.map(status => {
                            return (
                              <MenuItem key={status.id} value={status.id}>
                                {status.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        className={classes.secondary}
                      >
                        {this.state.buttonText}
                      </Button>
                    </Grid>
                    <br />
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Milestone);
