/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectDashboard.js
 * Created:  2019-01-16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-10-06
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Redirect } from "react-router-dom";
import moment from "moment/moment";
import { styles } from "../styles/DashboardStyles";
import DashboardFilter from "./DashboardFilter";
import ProjectPanelList from "./ProjectPanelList";
import PageTitle from "../PageTitle";
import { getOrgName } from "../../redux";
var msg = "";

class ProjectDashboard extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization: "",
      orgName: "",
      projects: [],
      readyToRedirect: false,
      readyToEdit: false,
      selectChips: null,
      user: "",
      toProject: false,
      toProjectId: "",
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  }


  componentDidMount() {
    /*
    fetch("/api/projects-all")
      .then(res => {
        return res.json();
      })
      .then(projects => {
        this.setState({
          projects: projects
        });
      });

    // Get list of years for filtering.
    fetch("/api/projects-years")
      .then(res => {
        return res.json();
      })
      .then(years => {
        let beginYear = years[0].beginYear;
        let endYear = years[0].endYear;
        let yearList = [];
        let i = 0;
        for (var yr=beginYear; yr <= endYear; yr++) {
          yearList[i] = yr;
          i++;
        }
        this.setState({
          yearList: yearList,
        });
      }); */
  }

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  };

  handleChange = event => {
    this.setState({ status: event.target.value });
  };

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }
  }

  handleUpdate = (event) => {
    event.preventDefault();
    setTimeout(() => {
      fetch("/api/projects-filtered", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => {
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects
          });
        });
    }, 2000);
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          {this.renderEditRedirect()}
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard"> 
          <PageTitle pageTitle={"All projects"} />
            {/* <Grid container spacing={24} alignItems="center" justify="flex-start" className={classes.grid+' heder-title'}>
              <Typography variant="subtitle1" color="secondary" gutterBottom>
                All projects for ValueInfinity
              </Typography>
            </Grid> */}
          </Grid>
          <Grid container direction="row" justify="center" alignItems="flex-end"  className="project-dashboard-list">
            <DashboardFilter allClients={true}/>
            <ProjectPanelList allClients={true}/>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectDashboard);
