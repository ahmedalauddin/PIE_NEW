/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPanelList.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-06-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2020-01-20
 * Changes:  Removed unused vars.  Removing <Grid> elements to allow centering the list on the screen.
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, isAdministrator,checkPermision,isStandardUser } from "../../redux";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { styles } from "../styles/DashboardStyles";
import { formatDate } from "../common/UtilityFunctions";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import TablePagination from "@material-ui/core/TablePagination";
import TableBody from "@material-ui/core/TableBody";
import Skeleton from 'react-loading-skeleton';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ccss from "../custom.css";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteProjectDialog from '../dialogs/DeleteProjectDialog';


const divStyle = {
  background: '#fff',
  display: 'flex',
  margin: '0px 0px 15px 0px',
  alignItems: 'center',
  flexGrow: '0',
  maxWidth: '100%',
  flexBasis: '83%',
  justifyContent: 'center',
};

class ProjectPanelList extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.fetchProjects = this.fetchProjects.bind(this);
    this.setEditRedirect = this.setEditRedirect.bind(this);
    this.renderClientColumn = this.renderClientColumn.bind(this);
    this.renderClientColumnHeading = this.renderClientColumnHeading.bind(this);
    //<editor-fold desc="// Constructor set state">
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization:"",
      orgName: "",
      allClients: this.props.allClients,      // This is whether we're showing the full ValueInfinity admin project list,
                                              // or for a selected client organization.
      projects: [],
      projectId: null,
      readyToEdit: false,
      readyToRedirect: false,
      user: "",
      toProject: false,
      toProjectId: "",
      hasError: false,
      mindmaps: [],
      selected:[],
      page:0,
      rowsPerPage:5,
      skeletonLoader:true,
      openDialog : false,
      deleteId: '',

      openSnackbar: false,
      message: "",
      readyToEditKpi:null,
      editKpiId:null,
      kpiProjectId:null
    };
    //</editor-fold>
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
  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  }

  fetchProjects = () => {
    let fetchUrl = "/api/projects-filtered";

    let orgId = getOrgId();
    if (parseInt(orgId) > 0) {
      // console.log("Org ID = " + parseInt(orgId));
      const statusFilter = this.props.projectListFilter.status;
      const startYearFilter = this.props.projectListFilter.startYear;
      const endYearFilter = this.props.projectListFilter.endYear;
      const allClients = this.props.allClients;
      const userId=isStandardUser();

      if (parseInt(orgId) > 0) {
        // console.log("ProjectPanelList, before setState for filter values");
        // Use the props for the body of the fetch request.
        const reqBody = {statusFilter, startYearFilter, endYearFilter, allClients, orgId, userId};

        fetch(fetchUrl, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(reqBody)
        })
          .then(res => {
            this.setState({skeletonLoader:false})
            return res.json();
          })
          .then(projects => {
            this.setState({
              projects: projects,
              skeletonLoader:false,
              orgId:orgId
            });
            // console.log("fetch: complete");
          });
      } else {
        this.setState({ hasError: true,skeletonLoader:false });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectListFilter !== prevProps.projectListFilter) {
      this.fetchProjects();
    }
  };

  componentDidMount() {
    // console.log("componentDidMount this.props: " + JSON.stringify(this.props));
    this.fetchProjects();
  };

  deactivateProject = (id) => {
    // const thisOne = this;
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a mind map
        let removePath = "/api/project-deactivate/" + id;
        fetch(removePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => response.json())
          .then((response) => {
            // console.log("response from api/project-deactivate-",response);
            const data = this.state.projects.filter(i => i.id !== id)
          
            this.setState({projects:data})
        
            this.setState({
              openSnackbar: true,
              openDialog:false,
              message: response.message ? response.message : 'Project Deleted'
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

  renderClientColumnHeading = () => {
    let clientColumnHeading = "";
    const { classes } = this.props;

    if (this.props.allClients) {
      clientColumnHeading =
        <div className={classes.columnclient}>
          <Typography className={classes.secondaryHeading}>
            Client
          </Typography>
        </div>;
    }
    return clientColumnHeading;
  };

  renderClientColumn = (organization) => {
    let clientColumnHeading = "";
    const { classes } = this.props;

    if (this.props.allClients) {
      clientColumnHeading =
        <div className={classes.columnclient}>
          <Typography className={classes.secondaryHeading}>
            {organization}
          </Typography>
        </div>;
    }
    return clientColumnHeading;
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  editKpi(mainKpiId,projectId){
    this.setState({readyToEditKpi:true,editKpiId:mainKpiId,kpiProjectId:projectId})
  }
  render() {
    const { classes } = this.props;
    const { projects, mindmaps, order, orderBy, rowsPerPage, page,readyToEditKpi,editKpiId,orgId,kpiProjectId } = this.state;


    if (readyToEditKpi) {
      return (
        <Redirect
          to={{
            pathname: "/kpi",
            state: {
              projectId: kpiProjectId,
              kpiId: editKpiId
            }
          }}
        />
      );
    }

    if (this.state.hasError) {
      return (
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            Client
          </Typography>
        </div>
      );
    } else if (this.state.readyToEdit) {
      // return <Redirect to={`/project/${this.state.projectId}`} />;
      return <Redirect
      to={{
        pathname: '/project/',
        state: {
          projId: this.state.projectId
        }
      }}
    />;

    }


    var arr = projects && projects.length;
    var rowsOptions = [];
    for(var i=1;i<=arr;i++){
      var n = i*5;
      if(n < arr)
      rowsOptions.push(n);
    }
    rowsOptions.push(arr);

    return (
      <React.Fragment>
        <DeleteProjectDialog open={this.state.openDialog} deleteId={this.state.deleteId} closeFunction={this.handelCloseDialog} delFunction={this.deactivateProject} heading="Are you sure you want to delete this Project?" />
            <div style={divStyle}> 
              <Grid item>
                  <Card className={classes.card}>
                    <CardContent className="list-project-panellist">


                      <ExpansionPanel expanded={false}>
                        <ExpansionPanelSummary>

                          <div className={classes.columntitle} >
                            <Typography className={classes.heading} >
                              Project title
                </Typography>
                          </div>
                          {this.renderClientColumnHeading()}
                          <div className={classes.columnstatus} >
                            <Typography className={classes.secondaryHeading} >
                              Status
                </Typography>
                          </div>
                          <div className={classes.columntarget} >
                            <Typography className={classes.secondaryHeading} >
                              Targeted KPI
                </Typography>
                          </div>
                          <div className={classes.columnstartdate} >
                            <Typography className={classes.secondaryHeading} >
                              Start date
                </Typography>
                          </div>
                          <div className={classes.columnenddate} >
                            <Typography className={classes.secondaryHeading} >
                              End date
                </Typography>
                          </div>
                          <div className={classes.columnactions} >
                            <Typography className={classes.secondaryHeading} >
                              Actions
                </Typography>
                          </div>
                        </ExpansionPanelSummary>
                      </ExpansionPanel>
                        {!this.state.skeletonLoader && projects && projects.length>0 && stableSort(projects, getSorting(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map(project => {
                            const tasksString = project.tasks
                            let tasksArray = []
                            if (tasksString && tasksString.length > 0) {
                              if (tasksString[0] !== null) {
                                tasksArray = tasksString[0].split(",")
                              }
                            }


                            const teamsString = project.team
                            let teamarray = []
                            if (teamsString && teamsString.length > 0) {
                              if (teamsString !== null) {
                                teamarray = teamsString.split(",")
                              }
                            }


                            const ownersString = project.owners
                            let ownerarray = []
                            if (ownersString && ownersString.length > 0) {
                              if (ownersString !== null) {
                                ownerarray = ownersString.split(",")
                              }
                            }
                            // console.log('array-',tasksArray);
                            // console.log('tasksString-',tasksString)
                            return (
                              <ExpansionPanel key={project.id}>
                                <ExpansionPanelSummary style={{ paddingLeft: "3%" }} expandIcon={checkPermision('Dashboard Expand Projects', 'read') ? <ExpandMoreIcon /> : null}>


                                  <div className={classes.columntitle} >
                                    <Typography className={classes.heading} >
                                      {project.projectTitle}
                                    </Typography>
                                  </div>
                                  {this.renderClientColumn(project.organization)}
                                  <div className={classes.columnstatus} >
                                    <Typography className={classes.secondaryHeading} >
                                      {project.status}
                                    </Typography>
                                  </div>
                                  <div className={classes.columntarget} >
                                    <Typography className={classes.secondaryHeadingLink} onClick={()=>this.editKpi(project.mainKpiId,project.id)} >
                                      {project.mainKpi}
                                    </Typography>
                                  </div>
                                  <div className={classes.columnstartdate} >
                                    <Typography className={classes.secondaryHeading} >
                                      {formatDate(project.startAt)}
                                    </Typography>
                                  </div>
                                  <div className={classes.columnenddate} >
                                    <Typography className={classes.secondaryHeading} >
                                      {formatDate(project.endAt)}
                                    </Typography>
                                  </div>

                                  <div className={classes.columnactions} >
                                    {checkPermision('Projects', 'read') &&
                                      <IconButton onClick={() => { this.setEditRedirect(project.id); }}>
                                        <EditIcon color="primary" />
                                      </IconButton>
                                    }
                                    {isAdministrator() &&
                                      <IconButton onClick={() => { this.openDialog(project.id); }} >
                                        <DeleteIcon color="primary" />
                                      </IconButton>
                                    }
                                  </div>

                                </ExpansionPanelSummary>
                                {checkPermision('Dashboard Expand Projects', 'read') &&
                                  <ExpansionPanelDetails className={classes.details} style={{ padding: 0, margin: 0 }}>
                                    <Grid container spacing={3} style={{ paddingLeft: "3%", margin: 0 }}>
                                      <div style={{ flexBasis:"16rem" }}>
                                        <Typography className={classes.secondaryHeading} component="p">
                                          <Typography className={classes.heading}>Owner:</Typography>
                                          {ownerarray && ownerarray.map(owner => {
                                            return (
                                              <p className="inlineBlock" style={{ padding: 0, margin: 0 }}>{owner}</p>
                                            )
                                          }
                                          )}
                                        </Typography>
                                      </div>
                                      <div style={{ flexBasis:"15rem" }}>
                                        <Typography className={classes.secondaryHeading} component="p">
                                          <Typography className={classes.heading}>Team:</Typography>
                                          {teamarray && teamarray.map(team => {
                                            return (
                                              <p className="inlineBlock" style={{ padding: 0, margin: 0 }}>{team}</p>
                                            )
                                          }
                                          )}
                                        </Typography>
                                      </div>
                                      <div style={{ flexBasis:"26rem" }}>
                                        <Typography className={classes.secondaryHeading} component="p">
                                          <Typography className={classes.heading}>Tasks:</Typography>
                                          {
                                            tasksArray && tasksArray.map(task => {
                                              return (
                                                <p className="inlineBlock" style={{ padding: 0, margin: 0 }}>{task}</p>
                                              )
                                            })
                                          }
                                        </Typography>
                                      </div>
                                    </Grid>
                                  </ExpansionPanelDetails>
                                }
                              </ExpansionPanel>
                            );
                          })}
                        {this.state.skeletonLoader &&
                          <Skeleton count={20} />
                        }
                      <TablePagination
                        rowsPerPageOptions={rowsOptions}
                        component="div"
                        count={projects.length}
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

                      {checkPermision('Projects', 'write') &&
                        <Fab component={Link} color="primary" aria-label="Add" to={`/project`} className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      }

                    </CardContent>
                  </Card>
              </Grid>
                </div>
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

const mapStateToProps = (state) => {
  return {
    projectListFilter: state.projectListFilter
  };
};

export default withStyles(styles)(connect(mapStateToProps)(ProjectPanelList));
