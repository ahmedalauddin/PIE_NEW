// List for editing persons, 1/22/19.
// Will be removed eventually.  Essentially a test harness for EditPerson.
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/index";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip/index";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { styles } from "../styles/MaterialSense";
import { stableSort, getSorting } from "../TableFunctions";

const rows = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "username", numeric: false, disablePadding: true, label: "Username" },
  {
    id: "firstName",
    numeric: false,
    disablePadding: true,
    label: "First name"
  },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last name" },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email address"
  },
  {
    id: "organization",
    numeric: false,
    disablePadding: false,
    label: "Organization"
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

class ListPersons extends Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    persons: []
  };

  componentDidMount() {
    fetch("/api/persons")
      .then(res => res.json())
      .then(persons => this.setState({ persons }));
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
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
                      <Typography color="secondary" gutterBottom>
                        Innovation Platform User List
                      </Typography>
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
                                  this.state.persons,
                                  getSorting("asc", "email")
                                ).map(person => {
                                  return (
                                    <TableRow
                                      hover
                                      onClick={event => {}}
                                      tabIndex={-1}
                                      key={person.id}
                                    >
                                      <TableCell align="right">
                                        {person.id}
                                      </TableCell>
                                      <TableCell align="left">
                                        {person.firstName}
                                      </TableCell>
                                      <TableCell align="left">
                                        {person.lastName}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Link to={`/editperson/${person.id}`}>
                                          {person.email}
                                        </Link>
                                      </TableCell>
                                      <TableCell align="left">
                                        {person.organization.name}
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

export default withStyles(styles)(ListPersons);
