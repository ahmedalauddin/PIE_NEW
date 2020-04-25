/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/ProjectPersons.js
 * Descr:    Allows selection of people assigned to a project.  SHould be a mixture of ValueInfinity
 *           personnel and client organization personnel.
 * Created:  2019-04-13
 * Author:   Brad Kaufman
 *
 * Modified: 2020-02-26
 * Editor:   Brad Kaufman
 * Changes:  Refactoring, add Redux call to setProject once the list of people assigned have been updated.
 */
import React, {Component} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import { styles } from "../styles/MaterialSense";
import { getOrgId, setProject, store, checkPermision } from "../../redux";
import Button from "@material-ui/core/Button/index";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";

const rows = [
  { id: "assigned", numeric: false, disablePadding: false, label: "Assigned" },
  { id: "owner", numeric: false, disablePadding: false, label: "Owner" },
  { id: "person", numeric: false, disablePadding: true, label: "Person" },
  // { id: "delete", numeric: false, disablePadding: true, label: "Actions" }
];

class MyTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {order, orderBy} = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                {row.label}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

class ProjectPersons extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOwnerToggle = this.handleOwnerToggle.bind(this);
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: 0,
      checked: [0],
      orgPersons: [],
      ownerPersons: [],
      assignPersons: [],
      projectPersons: [],
      projectName: "",
      hasError: "",
      selected: [],
      persons: [],
      project: {},
      organizations: [],
      departments: [],
      projid: 0,
      title: "",
      businessGoal: "",
      org: "",
      orgName: "",
      description: "",
      summary: "",
      mainKpiId: null,
      kpis: [],
      startAt: "",
      endAt: "",
      progress: 0,
      message: "",
      buttonText: "Create",
      isEditing: false,
      redirect: false,
      isNew: false,
      expanded: false,
      labelWidth: 0,
      statusList: [],
      updatedTime: ''
    };
  }

  componentDidCatch(error, info) {
    // console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login"/>;
  }

  handleToggle = value => () => {
    const {orgPersons} = this.state;
    const idArray = orgPersons.map(p => {
      return (p.id);
    });
    const personId = value;
    const currentIndex = idArray.indexOf(parseInt(value));
    orgPersons[currentIndex].inProject = !orgPersons[currentIndex].inProject;

    if (this.state.assignPersons.includes(parseInt(personId))) {
      let assignPersons = [...this.state.assignPersons];
      var index = assignPersons.indexOf(parseInt(personId))
      if (index !== -1) {
        assignPersons.splice(index, 1);
        this.setState({assignPersons});
      }
    } else {
      let assignPersons = [...this.state.assignPersons];
      assignPersons.push(parseInt(personId))
      this.setState({assignPersons});
    }


    this.setState({
      orgPersons: orgPersons,
    });
  };

  handleOwnerToggle = value => () => {
    const {orgPersons} = this.state;

    const idArray = orgPersons.map(p => {
      return (p.id);
    });
    // console.log('idArray--',idArray);
    // get the ID from the name of the checkbox, which is something like "own23".
    const personId = value.substring(3);
    const currentIndex = idArray.indexOf(parseInt(personId));

    orgPersons[currentIndex].owner = !orgPersons[currentIndex].owner;

    if (this.state.ownerPersons.includes(parseInt(personId))) {
      let ownerPersons = [...this.state.ownerPersons];
      var index = ownerPersons.indexOf(parseInt(personId))
      if (index !== -1) {
        ownerPersons.splice(index, 1);
        this.setState({ownerPersons});
      }
    } else {
      let ownerPersons = [...this.state.ownerPersons];
      ownerPersons.push(parseInt(personId))
      this.setState({ownerPersons});
    }

    this.setState({
      orgPersons: orgPersons,
    });
  };

  /*
  // Fetch project and update the Redux store.
  fetchProject(projectid) {
    fetch(`/api/projects/${projectid}`)
      .then(res => res.json())
      .then(project => {
        this.setState({
          id: projectid,
          businessGoal: project.businessGoal,
          title: project.title,
          description: project.description,
          org: project.organization.name,
          orgId: project.orgId,
          summary: project.summary,
          mainKpiId: project.mainKpiId,
          kpis: project.kpis,
          progress: project.progress,
          statusId: project.statusId,
          startAt: moment(project.startAt).format("YYYY-MM-DD"),
          endAt: moment(project.endAt).format("YYYY-MM-DD"),
          buttonText: "Update"
        });
        return project;
      })
      .then(project => {
        store.dispatch(setProject(JSON.stringify(project)));
      });
  } */

  handleSubmit = (event) => {
    event.preventDefault();
    let projectId = this.props.projectId;

    setTimeout(() => {
      if (projectId > 0) {
        let updatePath = "/api/projectpersons/" + projectId;
        fetch(updatePath, {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(this.state)
        })
          .then(data => {
            this.setState({message: "Project updated.",updatedTime: Date.now()});
            this.props.messages("Project updated.");
            this.setState({loader: false});
          })
          .catch(err => {
            this.setState({message: "Error occurred.",updatedTime: Date.now()});
            this.props.messages("Error occurred.");
            this.setState({loader: false});
          });
      }
    }, 2000);
  }

  componentDidMount() {
    let projectId = this.props.projectId;
    let orgId = getOrgId();

    if (parseInt(projectId) > 0) {
      // First use the api/persons/project to get the team associated with the project
      // and all people who are part of the organization.
      let assignedMenuItems = [];
      let menuItem = "";
      let jsonItem = undefined;

      fetch("/api/project-persons/" + projectId + "/" + orgId)
        .then(res => res.json())
        .then(persons => {
          let owners = [];
          fetch(`/api/persons-owned/${projectId}`)
            .then(res => res.json())
            .then(ownersArray => {
              let assigned = [];
              fetch(`/api/persons-assigned/${projectId}`)
                .then(resass => resass.json())
                .then(personsass => {
                  /* owners */
                  owners = ownersArray.map(person => person.id);
                  assigned = personsass.map(personAssigned => personAssigned.id);

                  persons.map((singlePerson) => {
                    if (assigned.includes(singlePerson.id)) {
                      singlePerson.inProject = true;
                    } else {
                      singlePerson.inProject = false;
                    }

                    if (owners.includes(singlePerson.id)) {
                      singlePerson.owner = true;
                    } else {
                      singlePerson.owner = false;
                    }

                    this.setState({orgPersons: [...this.state.orgPersons, singlePerson]});
                  });

                  this.setState({
                    ownerPersons: owners,
                    assignPersons: assigned
                  });
                  /* owners */

                }); // assigned
            }); // Owners
        })
        .catch(err => {
          this.setState({hasError: true});
        });
      // console.log('Getting Project OwnersIds--owners--->',owners);

    }
  }

  // async deactivatePeople(id) {
  //   let orgnId = getOrgId();

  //   if (id > 0) {
  //     // Deactivate a KPI
  //     this.setState({
  //       delLoader: id
  //     })
  //     let removePath = "/api/persons/disable_from_proj/" + id + "/" + this.props.projectId;
  //     await fetch(removePath, {
  //       method: "PUT",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify({
  //         disabled: true,
  //         disabledAt: new Date()
  //       })
  //     })
  //     .then(resass => resass.json())
  //       .then(data => {
  //         let projectId = this.props.projectId;
  //         this.setState({
  //           updatedTime: Date.now(),
  //           delLoader: 0,
  //           message: data.message, 
  //           openSnackbar: true
  //         });
  //         if (parseInt(projectId) > 0) {
  //           // First use the api/persons/project to get the team associated with the project
  //           // and all people who are part of the organization.
  //           fetch("/api/project-persons/" + projectId + "/" + orgnId)
  //             .then(res => res.json())
  //             .then(persons => {
  //               this.setState({
  //                 orgPersons: persons
  //               });
  //             })
  //             .catch(err => {
  //               this.setState({hasError: true});
  //             });
  //         }

  //         this.setState({message: "Person deleted."});
  //       })
  //       .catch(err => {
  //         this.setState({message: "Error occurred.", delLoader: 0, openSnackbar: true});
  //       });
  //   }
  // }

  render() {
    const {classes} = this.props;
    // console.log('ownerPersons',this.state.ownerPersons);
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <div>
        <div>
          <Typography variant="body1" gutterBottom>
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
              >
                <MyTableHead/>
                <TableBody>
                  {this.state.orgPersons.map((person) => {
                    return (
                      <TableRow
                        hover
                        onClick={event => {
                        }}
                        tabIndex={-1}
                        key={person.id}
                      >
                        <TableCell align="left" width="15%">
                          <Checkbox
                            key={person.id}
                            // checked={!!+person.inProject}
                            checked={this.state.assignPersons.includes(person.id)}

                            tabIndex={-1}
                            onChange={this.handleToggle(person.id)}
                          />
                        </TableCell>
                        <TableCell align="left" width="15%">
                          <Checkbox
                            key={"own" + person.id}
                            // checked={!!+person.owner}
                            checked={this.state.ownerPersons.includes(person.id)}
                            tabIndex={-1}
                            onChange={this.handleOwnerToggle("own" + person.id)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <strong>{person.lastName}, {person.firstName}<br/></strong>
                          {person.email}
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                          {
                            this.state.delLoader != 0 && this.state.delLoader == person.id ?
                              <CircularProgress/>
                              :
                              <IconButton
                                onClick={() => {
                                  this.deactivatePeople(person.id);
                                }}
                              >
                                <DeleteIcon color="primary"/>
                              </IconButton>
                          }
                        </TableCell> */}


                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Typography>
        </div>
        <div className={classes.spaceTop}>
        {checkPermision('Projects People','modify') &&
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
            className={classes.secondary}
          >
            Update People
          </Button>
          }
        </div>
        <br/>

      </div>
    );
  }
}

export default withStyles(styles)(ProjectPersons);
