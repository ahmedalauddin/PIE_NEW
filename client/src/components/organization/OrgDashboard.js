/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/organization/OrgDashboard.js
 * Created:  2019-01-16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-18
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import { getOrgId, isAdministrator } from "../../redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import moment from "moment/moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import ccss from "../custom.css";
import Skeleton from 'react-loading-skeleton';
import TablePagination from "@material-ui/core/TablePagination";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOrganizationDialog from '../dialogs/DeleteOrganizationDialog';
import Snackbar from "@material-ui/core/Snackbar";
import PageTitle from "../PageTitle";
import { getOrgName } from "../../redux";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AddUserIcon from "@material-ui/icons/PersonAdd";


const rows = [
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "task", numeric: false, disablePadding: true, label: "Pending Action" },
  { id: "owners", numeric: false, disablePadding: true, label: "Owners" },
  { id: "audience", numeric: false, disablePadding: true, label: "Audience" },
  { id: "mainKpi", numeric: false, disablePadding: true, label: "Targeted KPI" },
  { id: "progress", numeric: true, disablePadding: false, label: "Progress" },
  { id: "start", numeric: false, disablePadding: true, label: "Start Date" },
  { id: "end", numeric: false, disablePadding: true, label: "End Date" },
  { id: "actions", numeric: false, disablePadding: true, label: "Actions" }
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  card: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "22%",
  },
  wideColumn: {
    flexBasis: "26%",
  },
  wideColumnExpand: {
    flexBasis: "29%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

var msg = "";

class OrgDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleNull = this.handleNull.bind(this);
    this.addProject = this.addProject.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organizations: [],
    selected: [],
    projects: [],
    readyToRedirect: false,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false,
    skeletonLoader:true,
    page: 0,
    rowsPerPage: 5,
    openDialog : false,
      deleteId: '',

      openSnackbar: false,
      message: ""
  };

  openDialog(projectId) {
    this.setState({openDialog: true, deleteId:projectId})
  }

  showMessages = (message) => {
    // alert(message);
    this.setState( {
      openSnackbar: true,
      message: message
    });
  };

  deactivateOrganization = (id) => {
    // const thisOne = this;
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a mind map
        let removePath = "/api/organization-deactivate/" + id;
        fetch(removePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => response.json())
          .then((response) => {
            // console.log("response from api/project-deactivate-",response);
            const data = this.state.organizations.filter(i => i.id !== id)
          
            this.setState({organizations:data})
        
            this.setState({
              openSnackbar: true,
              openDialog:false,
              message: response.message ? response.message : 'Organization Deleted'
            });
          })
          .catch(err => {
            console.log("Error occurred omn api/project-deactivate-",err);
            // this.setState({ msg: "Error occurred.",skeletonLoader:false,openSnackbar: true, message: "Error occurred.", openDialog:false  });
          });
      }
    }, 2000);
  }


  handelCloseDialog = () => {
    this.setState({openDialog:false  });
  }
  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleNull(refToParse) {
    try {
      if (refToParse != null) {
        return refToParse;
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }
  }

  componentDidMount() {
    fetch("/api/organizations-dashboard")
      .then(res => {
        this.setState({skeletonLoader:false})
        return res.json();
      })
      .then(organizations => {
        this.setState({
          organizations: organizations,
          skeletonLoader:false
        });
      });

  };

  formatDate(dateInput) {
    let dateOut = "";

    if (dateInput !== null) {
      dateOut = moment(dateInput).format("YYYY-MM-DD");
    }
    return dateOut;
  }

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    const { organizations, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, organizations.length - page * rowsPerPage);

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    var arr = organizations.length;
    var rowsOptions = [];
    for(var i=1;i<=arr;i++){
      var n = i*5;
      if(n < arr)
      rowsOptions.push(n);
    }
    rowsOptions.push(arr);

    if(this.props.location.state && this.props.location.state.redirect && this.props.location.state.organizationId){
      return (
        <Redirect
          to={{
            pathname: this.props.location.state.redirect,
            state: {
              organizationId:this.props.location.state.organizationId
            }
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <DeleteOrganizationDialog open={this.state.openDialog} deleteId={this.state.deleteId} closeFunction={this.handelCloseDialog} delFunction={this.deactivateOrganization} heading="Are you sure you want to delete this Organization?" />
        <Topbar currentPath={"/orgdashboard"}/>
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard"> 
            <PageTitle pageTitle={"All clients and projects"} />
            
            <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <Grid  item xs={12} md={10} className="dashboard-filter-menu" >
                        <Card className={classes.card}>
                          <CardContent className="list-project-panellist">
                            <ExpansionPanel expanded={false}>
                              <ExpansionPanelSummary>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.heading}>
                                    Client organization
                                  </Typography>
                                </div>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.secondaryHeading}>
                                    Projects
                                  </Typography>
                                </div>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.secondaryHeading}>
                                    KPIs
                                  </Typography>
                                </div>
                                <div className={classes.column} style={{paddingLeft:10}}>
                                  <Typography className={classes.secondaryHeading}>
                                    Actions
                                  </Typography>
                                </div>
                              </ExpansionPanelSummary>
                            </ExpansionPanel>
                            {!this.state.skeletonLoader && stableSort(organizations, getSorting(order, orderBy))
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map(organization => {
                              return (
                            <ExpansionPanel key={organization.id}>
                              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.heading}>
                                    {organization.name}
                                  </Typography>
                                </div>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.secondaryHeading}>
                                    
                                    <ul style={{paddingLeft:15,margin:0}}>
                                      {
                                          organization.projects && organization.projects.split(",").map((project,key) => <li key={key} >{project.trim()}</li> )
                                      }
                                    </ul>
                                  </Typography>
                                </div>
                                <div className={classes.wideColumn}>
                                  <Typography className={classes.secondaryHeading}>

                                    <ul style={{paddingLeft:15,margin:0}}>
                                      {
                                          organization.kpis && organization.kpis.split(",").map((kpi,key) => <li key={key} >{kpi.trim()}</li> )
                                      }
                                    </ul>
                                    
                                  </Typography>
                                </div>
                                <div className={classes.column} style={{paddingLeft:0,margin:0}}>
                                  <IconButton variant="contained" color="primary" className={classes.button} component={Link} size="small"
                                      aria-label="Add" to={{pathname: "/organization", state: {organizationId: organization.id} }} >
                                      <EditIcon color="primary" />
                                  </IconButton>

                                  {isAdministrator() &&
                                  <IconButton onClick={() => { this.openDialog(organization.id);  }} >
                                      <DeleteIcon color="primary" />
                                  </IconButton>
                                    }
                                  {isAdministrator() &&
                                  <IconButton variant="contained" color="primary" className={classes.button} component={Link} size="small"
                                      aria-label="Add" to={{pathname: "/person", state: {organizationId: organization.id,organizationName:organization.name} }} >
                                      <AddUserIcon color="primary" />
                                  </IconButton>
                                    }
                                </div>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                      
                                <div className={classes.wideColumnExpand}>
                                  <Typography className={classes.heading} >Departments: </Typography>
                                      <Typography className={classes.secondaryHeading} component="p">
                                      {
                                      organization.departments && organization.departments.split(",").map(department => {
                                        if(department){
                                          return(
                                            <p className="inlineBlock">{department}</p>
                                          )
                                        }
                                      })
                                      }
                                      </Typography>
                                  </div>
                                <div className={classes.wideColumnExpand}>
                                    <Typography className={classes.secondaryHeading} component="p">
                                      <Typography className={classes.heading}>People: </Typography>
                                    {
                                        organization.people && organization.people.split(";").map(peopl => {
                                        if(peopl){
                                          return(
                                          <p className="inlineBlock">{peopl}</p>
                                        )
                                        }
                                      })
                                    }
                                  </Typography>
                                </div>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                            );
                            })}
                            {this.state.skeletonLoader &&                        
                                <Skeleton count={20}/>  
                              }
                              {!this.state.skeletonLoader &&
                              <TablePagination
                                rowsPerPageOptions={rowsOptions}
                                component="div"
                                count={organizations.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                backIconButtonProps={{
                                  "aria-label": "Previous Page"
                                }}
                                nextIconButtonProps={{
                                  "aria-label": "Next Page"
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                              />
                            }
                            <br/>
                            <br/>
                            <Fab component={Link} color="primary" aria-label="Add" to={{pathname: "/organization", state: {organizationId: 0} }} className={classes.fab}>
                              <AddIcon />
                            </Fab>
                          </CardContent>
                        </Card>
                      </Grid>

            </Grid>
            
          </Grid>
          <Snackbar
              open={this.state.openSnackbar}
              onClose={this.handleClose}
              TransitionComponent={this.state.Transition}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={<span id="message-id">{this.state.message}</span>}
            />
        </div>
      </React.Fragment>
    );
  }
}

// export default withStyles(styles)(OrgDashboard);
export default withStyles(styles)(connect()(OrgDashboard));
