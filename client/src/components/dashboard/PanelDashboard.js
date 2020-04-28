/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/PanelDashboard.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-01-16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-12-23
 * Changes:  Formatting
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Redirect } from "react-router-dom";
import { getOrgName, getOrgId } from "../../redux";
import DashboardFilter from "./DashboardFilter";
import ProjectPanelList from "./ProjectPanelList";
import { styles } from "../styles/DashboardStyles";
import PageTitle from "../PageTitle";
import OrganizationActionTable from "./OrganizationActionTable";
import OrganizationDocumentTable from "./OrganizationDocumentTable";

class PanelDashboard extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization:"",
      orgName: "",
      projects: [],
      projectId: null,
      readyToEdit: false,
      readyToRedirect: false,
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
  };

  componentDidMount() {
  };

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  };

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  };

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    this.renderEditRedirect();

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard"> 
            
            <PageTitle pageTitle={"Projects listed for "+getOrgName()} />
            
            <Grid item xs={12} md={10} className="dashboard-filter-menu">
              <DashboardFilter allClients={false}/>
            </Grid>
            <Grid item xs={12} md={10} className="dashboard-filter-menu">
              <ProjectPanelList allClients={false} />
            </Grid>
          
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PanelDashboard);
