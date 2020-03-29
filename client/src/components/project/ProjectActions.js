/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/ProjectActions.js
 * Descr:    List of tasks to be displayed on the project card.
 * Created:  2019-03-22
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-22
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
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

class ProjectActions extends Component {
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
    projectid = this.props.projectId;

    if (projectid) {
      // Fetch the tasks only for a single project
      fetch(`/api/tasks/project/${projectid}`)
        .then(res => res.json())
        .then(tasks => {
          this.setState({ tasks: tasks });
        });
    }
  }

  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    return (
      <div>
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
                    <Link to={`../action/${task.id}`}>
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
    );
  }
}

export default withStyles(styles)(ProjectActions);
