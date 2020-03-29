/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ListDepartments.js
 * Descr:    List departments for an organization.
 * Created:  2019-04-12
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-12
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody/index";
import TableCell from "@material-ui/core/TableCell/index";
import TableHead from "@material-ui/core/TableHead/index";
import TableRow from "@material-ui/core/TableRow/index";
import Paper from "@material-ui/core/Paper/index";
import TableSortLabel from "@material-ui/core/TableSortLabel/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import { styles } from "../styles/MaterialSense";
import { stableSort, getSorting } from "../TableFunctions";
import Button from "@material-ui/core/Button/index";

const rows = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "name", numeric: false, disablePadding: true, label: "Department Name" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  }
];

class MyTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

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
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}
var msg = "";

class ListDepartments extends Component {
  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    selected: [],
    departments: [],
    readyToRedirect: false,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
    let orgId = parseInt(this.props.organizationId);

    if (parseInt(orgId) > 0) {
      // If there is an organization, select only the departments for that org.
      fetch("/api/organizations/" + orgId)
        .then(res => {
          return res.json();
        })
        .then(organization => {
          this.setState({
            departments: organization.departments,
            orgName: organization.name
          });
        });
    } else {
      //this.setState({readyToRedirect: true});

      // Else select all projects.
      fetch("/api/departments")
        .then(res => res.json())
        .then(departments => this.setState({ departments }));
      msg = "List of departments for all organizations";
    }
  };

  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;
    // const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar/>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      <Table>
                        <TableRow>
                          <TableCell>
                            <Typography color="secondary" gutterBottom>
                              Departments listed for {this.state.orgName}.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <div className={classes.spaceTop}>
                              <Button
                                component={Link}
                                variant="contained"
                                color="primary"
                                to={`/Department`}
                              >
                                New Department
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </div>
                    <div>
                      <Typography variant="body1" gutterBottom>
                        <Paper className={classes.root}>
                          <div className={classes.tableWrapper}>
                            <Table
                              className={classes.table}
                              aria-labelledby="tableTitle"
                            >
                              <MyTableHead />
                              <TableBody>
                                {stableSort(
                                  this.state.departments,
                                  getSorting("asc", "title")
                                ).map(department => {
                                  return (
                                    <TableRow
                                      hover
                                      onClick={event => {
                                        this.handleClick(event, department.id);
                                      }}
                                      tabIndex={-1}
                                      key={department.id}
                                    >
                                      <TableCell align="right">
                                        {department.id}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Link to={`/department/${department.id}`}>
                                          {department.name}
                                        </Link>
                                      </TableCell>
                                      <TableCell width="45%" align="left">
                                        {department.description}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </Paper>
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListDepartments);
