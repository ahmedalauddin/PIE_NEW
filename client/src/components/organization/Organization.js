/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/organization/0rganization.js
 * Created:  2019-05-22
 * Author:   Brad Kaufman
 * -----
 * Modified: 2020-01-18
 * Changes:  Added currentPath to Topbar for appbar highlighting.
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { Link, Redirect } from "react-router-dom";
import "../../stylesheets/Draft.css";
import OrganizationDetail from "./OrganizationDetail";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import PersonTable from "../person/PersonTable";
import DepartmentTable from "../department/DepartmentTable";
import KpiTable from "../kpi/KpiTable";
import {getOrg, isAdministrator, checkPermision} from "../../redux";

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

// Transition for the snackbar
// eslint-disable-next-line no-unused-vars
function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class Organization extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  state = {
    project: {},
    organizations: [],
    departments: [],
    projid: 0,
    title: "",
    businessGoal: "",
    org: "",
    orgId: "",
    orgName: "",
    description: "",
    value: 0,
    hasError: "",
    expanded: null,
    openSnackbar: false,
    snackbarMessage: "",
    message: ""
  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidMount() {
    let message = "";
    if (this.props.location.state && this.props.location.state.message)  {
      message = this.props.location.state.message;
      this.setState({
        openSnackbar: true,
        message: message
      });
    }
  }

  showMessages = (message) => {
    this.setState( {
      openSnackbar: true,
      message: message
    });
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const currentPath = this.props.location.pathname;
    const { expanded } = this.state;
    // console.log('this.props.location.statethis.props.location.state==',this.props.location.state);
    if(isAdministrator()){
      var orgId = this.props.location.state ? this.props.location.state.organizationId : getOrg().id;
    }else{
      var orgId = getOrg().id;
    }
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/orgdashboard"}/>
        <div className={classes.root} >
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10} className="page-org">
              <Paper className={classes.paper}>
                <Typography
                  variant="h5"
                  component="h2"
                  color="secondary"
                  gutterBottom
                >
                  Organization
                </Typography>
                <OrganizationDetail orgId={orgId} messages={this.showMessages}/>
              </Paper>
            </Grid>
            <Grid item lg={10} className="page-org">
              
            {checkPermision('Organization Department','read') && 
              <ExpansionPanel expanded={expanded === "panelDepartments"} onChange={this.handlePanelChange("panelDepartments")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Departments</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={10} className="org-people-search">
                      {checkPermision('Organization Department','write') && 
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Add" to={{pathname: "/department", state: {organizationId: orgId} }} >
                        Add New
                        <AddIcon className={classes.rightIcon} />
                      </Button>
                        }
                      <DepartmentTable organizationId={orgId}/>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            }

          {checkPermision('Organization KPI','read') && 
              <ExpansionPanel expanded={expanded === "panelKpis"} onChange={this.handlePanelChange("panelKpis")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>KPIs</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item lg={10} className="org-people-search">
                  {checkPermision('Organization KPI','write') &&
                    <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                      aria-label="Add" to={{pathname: "/kpi", state: {organizationId: orgId} }} >
                      Add New
                      <AddIcon className={classes.rightIcon} />
                    </Button>
                   }
                    <KpiTable organizationId={orgId}/>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              </ExpansionPanel>
              }

          {checkPermision('Organization People','read') && 
              <ExpansionPanel expanded={expanded === "panelPersons"} onChange={this.handlePanelChange("panelPersons")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>People</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={10} className="org-people-search">
                    {checkPermision('Organization People','write') &&
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Add" to={{pathname: "/person", state: {organizationId: orgId} }} >
                        Add New
                        <AddIcon className={classes.rightIcon} />
                      </Button>}
                      <PersonTable organizationId={orgId} />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              }
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

export default withStyles(styles)(Organization);
