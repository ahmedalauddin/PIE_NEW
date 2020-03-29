/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ListActions.js
 * Created:  2019-03-22
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-22
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/index";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody/index";
import TableCell from "@material-ui/core/TableCell/index";
import TableHead from "@material-ui/core/TableHead/index";
import TableRow from "@material-ui/core/TableRow/index";
import TableSortLabel from "@material-ui/core/TableSortLabel/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import Typography from "@material-ui/core/Typography/index";
import { Link } from "react-router-dom";
import { styles } from "../styles/MaterialSense";
import { stableSort, getSorting } from "../TableFunctions";

const rows = [
  { id: "title",
    numeric: false,
    disablePadding: true,
    label: "Action"
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },
  {
    id: "taskstatus",
    numeric: false,
    disablePadding: false,
    label: "Status"
  },
  {
    id: "assigned",
    numeric: false,
    disablePadding: false,
    label: "Assigned To"
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

class ListActions extends Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    tasks: [],
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    // ListActions is expected to take a param of project ID, and fetch the tasks
    // associated only with that project.
    let projectid = 0;
    projectid = this.props.match.params.id;

    if (projectid) {
      // Fetch the tasks only for a single project
      fetch(`/api/tasks/project/${projectid}`)
        .then(res => res.json())
        .then(tasks => {
          this.setState({ tasks: tasks });
        });
    }
    // TODO - figure out how to gracefully handle condition where projectid is not provided.
  }

  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    /* react-router has injected the value of the attribute ID into the params */
    //const projectId = this.props.match.params.id;

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
                        List of Actions
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
                                  this.state.tasks,
                                  getSorting("asc", "title")
                                ).map(task => {
                                  return (
                                    <TableRow
                                      hover
                                      onClick={event => {
                                        this.handleClick(event, task.id);
                                      }}
                                      tabIndex={-1}
                                      key={task.id}
                                    >
                                      <TableCell width="25%" align="left">
                                        <Link to={`/action/${task.id}`}>
                                          {task.title}
                                        </Link>
                                      </TableCell>
                                      <TableCell width="35%" align="left">
                                        {task.description}
                                      </TableCell>
                                      <TableCell width="15%" align="left">
                                        {task.taskstatus}
                                      </TableCell>
                                      <TableCell align="left">
                                        {task.assigned.fullName}
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

export default withStyles(styles)(ListActions);
