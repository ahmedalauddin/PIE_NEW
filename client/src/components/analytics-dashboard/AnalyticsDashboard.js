import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Redirect } from "react-router-dom";
import { getOrgName, getOrgId } from "../../redux";
import { styles } from "../styles/DashboardStyles";
import PageTitle from "../PageTitle";
import Paper from "@material-ui/core/Paper";
import ProjectStatusWidget from "./widgets/ProjectStatusWidget";
import DepartmentLoadWidget from "./widgets/DepartmentLoadWidget";
import MileStoneWidget from "./widgets/MileStoneWidget";
import ActionWidget from "./widgets/ActionWidget";

class AnalyticsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgId: "",
      orgName: "",
      orgProjectStatus:null
    };
  }

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({ hasError: true });
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
    this.fetchData();
  };

  fetchData = async ()=>{
    const orgId= getOrgId();
    const orgName= getOrgName();
    const res = await fetch(`/api/orgnization-project-status/${orgId}`);
    const orgProjectStatus = await res.json();
    this.setState({orgProjectStatus,orgId,orgName});
  }



  render() {
    const { classes } = this.props;
    const { orgId , orgName, orgProjectStatus } = this.state;
    

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath="/analytics-dashboard" />
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={orgName+ " Dashboard"} />
            <Grid container spacing={24}>
              {orgProjectStatus && <Grid item xs={12} sm={5}>
                <Paper className={classes.paper}>
                    <ProjectStatusWidget orgProjectStatus={orgProjectStatus}/>
                </Paper>
              </Grid>}

              {orgProjectStatus &&<Grid item xs={12} sm={5}>
                <Paper className={classes.paper}>
                    <DepartmentLoadWidget orgProjectStatus={orgProjectStatus}/>
                </Paper>
              </Grid>}

              <Grid item xs={12} sm={5}>
                <Paper className={classes.paper}>
                    <MileStoneWidget />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Paper className={classes.paper}>
                    <ActionWidget />
                </Paper>
              </Grid>
            </Grid>

          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AnalyticsDashboard);
