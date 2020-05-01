import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName, getOrgDepartments,checkPermision } from "../../redux";
import "../../stylesheets/Draft.css";
import ProjectPersons from "./ProjectPersons";
import ProjectDetail from "./ProjectDetail";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Fab from "@material-ui/core/Fab";
import KpiTable from "../kpi/KpiTable";
import ActionTable from "./ActionTable";
import MilestoneList from "./MilestoneList";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { styles } from "../styles/ProjectStyles";
import Gantt from "../gantt/Gantt";
import ccss from "../custom.css";
import ProjectActionTable from "./ProjectActionTable";
import ProjectDocumentTable from "./ProjectDocumentTable";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.state = {
      project: {},
      organizations: [],
      departments: [],
      projid: 0,
      refreshPersonList: false,   // new state var to indicate that the Gantt chart child component should refresh
      title: "",
      businessGoal: "",
      org: "",
      orgId: "",
      orgName: "",
      description: "",
      updatedTime: null,
      value: 0,
      hasError: "",
      expanded: null,
      openSnackbar: false,
      snackbarMessage: "",
      message: "",
      show : true,
      projectProgress:0
    };
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
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

  renderNewProject = (newprojectid) => {
    // console.log('newprojectid on project componet', newprojectid);
  }

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidMount() {
    this.setOrganizationInfo();
    let message = "";
    
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  showMessages = (message) => {
    this.setState( {
      openSnackbar: true,
      updatedTime: Date.now(),
      message: message
    });
  };

  refeshePage=()=>{
    this.setState({show:false})
    setTimeout(()=>this.setState({show:true}),100);
  }

  updateProjectProgress=(projectProgress)=>{
    this.setState({projectProgress})
  }

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    const { expanded } = this.state;
    
    let projId = this.props.match.params.id || (this.props.location.state ? this.props.location.state.projId : '');

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />

        {this.state.show && 
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <Typography
                  color="secondary"
                  gutterBottom
                >
                  Project Detail
                </Typography>
                <Typography variant="h7">
                  Organization: {getOrgName()}
                </Typography>
                <ProjectDetail projectId={projId} messages={this.showMessages} progress={this.state.projectProgress} renderNewProject={(id) => this.renderNewProject(id)} />
              </Paper>
            </Grid>
            {projId === 0 || projId === '' ? '' :
              <Grid item lg={10} className="page-project">
                {checkPermision('Projects KPIs','read') &&
                <ExpansionPanel expanded={expanded === "panelKpis"} onChange={this.handlePanelChange("panelKpis")}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>KPIs</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container>
                      <Grid item lg={12}>
                        {checkPermision('Projects KPIs','write') &&
                        <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                          aria-label="Add" to={{ pathname: "/kpi", state: { projectId: projId } }} >
                          Add New
                        <AddIcon className={classes.rightIcon} />
                        </Button>
                          }
                           {checkPermision('Projects KPIs','write') &&
                        <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                          aria-label="Search KPIs" to={{ pathname: "/kpisearch", state: { projectId: projId } }} >
                          Search and Assign
                        <SearchIcon className={classes.rightIcon} />
                        </Button>
                          }
                        <KpiTable projectId={projId} refeshePage={this.refeshePage} />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                }

                {checkPermision('Projects People','read') &&
                <ExpansionPanel expanded={expanded === "panelPersons"} onChange={this.handlePanelChange("panelPersons")}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>People</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container>
                      <Grid item lg={12}>
                        <Typography className={classes.secondaryHeading}>
                          Select owners and people assigned to the project
                      </Typography>
                        <ProjectPersons projectId={projId} messages={this.showMessages} />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              }

                {checkPermision('Projects Milestones','read') &&
                <ExpansionPanel expanded={expanded === "panelMilestones"} onChange={this.handlePanelChange("panelMilestones")}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Milestones and Actions</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div className="gantt-container">
                      <Gantt projectId={projId} messages={this.showMessages} refresh={this.state.updatedTime} updateProjectProgress={this.updateProjectProgress} />
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                  }

              {checkPermision('Projects Additional Actions','read') &&  
                <ExpansionPanel expanded={expanded === "projectAction"} onChange={this.handlePanelChange("projectAction")}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Additional Actions</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                  <Grid container>
                      <Grid item lg={12}>

                      {checkPermision('Projects Additional Actions','write') && 
                        <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                          aria-label="Add" to={{ pathname: "/ProjectAction", state: { projectId: projId } }} >
                          Add New
                        <AddIcon className={classes.rightIcon} />
                        </Button>}


                    
                      <ProjectActionTable projectId={projId} messages={this.showMessages} />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                }

                {checkPermision('Projects Documents','read') &&  
                <ExpansionPanel expanded={expanded === "projectDocument"} onChange={this.handlePanelChange("projectDocument")}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Document(s)</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                  <Grid container>
                      <Grid item lg={12}>
                      {checkPermision('Projects Documents','write') &&  
                        <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                          aria-label="Add" to={{ pathname: "/ProjectDocument", state: { projectId: projId } }} >
                          Add New
                        <AddIcon className={classes.rightIcon} />
                        </Button>
                        }
                      <ProjectDocumentTable projectId={projId} messages={this.showMessages} />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                  }

              </Grid>
            }
          </Grid>
        </div>
        }
        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Project);
