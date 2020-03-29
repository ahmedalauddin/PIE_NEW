/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/Project.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-02
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../../Topbar";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName, getOrgDepartments, store, setOrg } from "../../../redux";
import "../../../stylesheets/Draft.css";
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
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

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

class Project extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
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
    expanded: null
  };

  setOrganizationInfo = () => {

    this.setState({
      orgName: "Test Org",
      orgId: 2,
      //departments: departments
    });
  };

  componentDidMount() {
    this.setOrganizationInfo();
    fetch("/api/organizations/2")
      .then(response => {
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          console.log("ClientOrg.js, org selected. Status = 200");
          return response.json();
        }
      })
      .then(data => {
        store.dispatch(setOrg(JSON.stringify(data)));
        console.log("ClientOrg.js, organization:" + JSON.stringify(data));
      })
      .then(response => {
        this.setState({ readyToRedirect: true });
      })
      .catch(err => {
        // TODO - set error login on form.
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
    let projId = 118;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <Grid className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <ProjectDetail projectId={118}/>
              </Paper>
            </Grid>
            <Grid item lg={10}>
              <ExpansionPanel expanded={expanded === "panel1"} onChange={this.handlePanelChange("panel1")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>KPIs</Typography>

                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={10}>
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Add" to={{pathname: "/kpi", state: {projectId: projId} }} >
                        Add New
                        <AddIcon className={classes.rightIcon}>
                          Add New</AddIcon>
                      </Button>
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Search KPIs" to={{pathname: "/kpisearch", state: {projectId: projId} }} >
                        Search and Assign
                        <SearchIcon className={classes.rightIcon} />
                      </Button>
                      <KpiTable projectId={118}/>
                    </Grid>
                  </Grid>

                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Project);
