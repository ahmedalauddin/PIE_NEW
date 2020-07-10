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
import ActionNewVsCloseWidget from "./widgets/ActionNewVsCloseWidget";
import MileStonePriorityWidget from "./widgets/MileStonePriorityWidget";
import CircularProgress from '@material-ui/core/CircularProgress';

class AnalyticsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgId: "",
      orgName: "",
      orgProjectStatus:null,
      orgProjectActionStatus:null,
      orgProjectMilstoneStatus:null,
      orgProjectMilstonePriority:null,
      actionNewVsClose:null
    };
  }

  // componentDidCatch(error, info) {
  //   console.log("error: " + error + ", info: " + info);
  //   this.setState({ hasError: true });
  //   return <Redirect to="/Login" />;
  // };

  componentDidMount() {
    this.fetchData();
  };

  fetchData = async ()=>{
    const orgId= getOrgId();
    const orgName= getOrgName();
    this.setState({orgId,orgName});

    const res = await fetch(`/api/orgnization-project-status/${orgId}`);
    const orgProjectStatus = await res.json();
    this.setState({orgProjectStatus});

    const res2 = await fetch(`/api/orgnization-project-action-status/${orgId}`);
    const orgProjectActionStatus = await res2.json();
    this.setState({orgProjectActionStatus});

    //const res3 = await fetch(`/api/orgnization-milstone-status/${orgId}`);
    //const orgProjectMilstoneReponse = await res3.json();
    //this.setState({orgProjectMilstoneStatus:orgProjectMilstoneReponse.progressData,orgProjectMilstonePriority:orgProjectMilstoneReponse.priorityData});

    const res4 = await fetch(`/api/orgnization-project-action-new-vs-close/${orgId}`);
    const actionNewVsClose = await res4.json();
    this.setState({actionNewVsClose});

    
  }


  renderCards(){
    const { classes } = this.props;
     const { orgId , orgName, orgProjectStatus, orgProjectActionStatus,orgProjectMilstoneStatus,orgProjectMilstonePriority, actionNewVsClose } = this.state;

      return(
        <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
             <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                  <Typography className={classes.heading} >Project Status</Typography>
                </Paper>
                <Paper className={classes.paperWidget} >
                      
                      {orgProjectStatus ? <ProjectStatusWidget orgProjectStatus={orgProjectStatus}/> : <CircularProgress  />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                  <Typography className={classes.heading} >Department Load</Typography>
                </Paper>
                <Paper className={classes.paperWidget}>
                {orgProjectStatus ? <DepartmentLoadWidget orgProjectStatus={orgProjectStatus}/> : <CircularProgress  />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                  <Typography className={classes.heading} >Milestones Status</Typography>
                </Paper>
                <Paper className={classes.paperWidget}>
                {orgProjectStatus ? <MileStoneWidget orgProjectStatus={orgProjectStatus}  /> : <CircularProgress  />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                  <Typography className={classes.heading} >Actions Status</Typography>
                </Paper>
                <Paper className={classes.paperWidget}>
                {orgProjectActionStatus ? <ActionWidget orgProjectActionStatus={orgProjectActionStatus} /> : <CircularProgress  />}
                </Paper>
              </Grid>
              

              <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                  <Typography className={classes.heading} >New vs Completed</Typography>
                </Paper>
                <Paper className={classes.paperWidget}>
                  {actionNewVsClose ? <ActionNewVsCloseWidget actionNewVsClose={actionNewVsClose} /> : <CircularProgress  />}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper style={{margin:1,padding:10}} className={classes.paperWidget}>
                    <Typography className={classes.heading} >Priority wise Milestones</Typography>
                </Paper>
                <Paper className={classes.paperWidget}>
                    {orgProjectStatus ? <MileStonePriorityWidget orgProjectStatus={orgProjectStatus} /> : <CircularProgress  />}
                </Paper>
              </Grid>
              
        
        
        </Grid>
      )
  }
  render() {
    const { classes } = this.props;
    const { orgId , orgName, orgProjectStatus, orgProjectActionStatus,orgProjectMilstoneStatus } = this.state;
    

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath="/analytics-dashboard" />
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={orgName+ " Dashboard"} />
            <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
              {this.renderCards()}
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
