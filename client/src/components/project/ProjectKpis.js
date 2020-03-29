/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/ProjectKpis.js
 * Descr:    List of KPIs to be displayed on the project card.
 * Created:  2019-01-22
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-4-29
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
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
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const rows = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  { id: "title", numeric: false, disablePadding: true, label: "KPI" },
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: "Description"
  },
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: "Type"
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

class ProjectKpis extends Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    kpis: [],
    projectTitle: "",
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    // ListKpis is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    let projectid = 0;
    projectid = this.props.projectId;

    if (projectid) {
      // Fetch the KPIs only for a single project
      fetch(`/api/kpis-project/${projectid}`)
        .then(res => res.json())
        .then(kpis => this.setState({ kpis: kpis }));
    }
  }

  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <MyTableHead />
            <TableBody>
              {stableSort(this.state.kpis, getSorting("asc", "title")).map(kpi => {
                return (
                  <TableRow
                    hover
                    onClick={event => {
                        this.handleClick(event, kpi.id);
                    }}
                    tabIndex={-1}
                    key={kpi.id}
                  >
                    <TableCell className={classes.paddingDense} width="10%" align="left">
                      {kpi.id}
                    </TableCell>
                    <TableCell className={classes.paddingDense} width="30%" align="left">
                      <Link to={`../kpicard/${kpi.id}`}>
                        {kpi.title}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.paddingDense} width="40%" align="left">
                      {kpi.description}
                    </TableCell>
                    <TableCell className={classes.paddingDense} width="20%" align="left">
                      {kpi.type}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div>
          <Fab component={Link} color="primary" aria-label="Add" to={`/kpicard`} className={classes.fab}>
            <AddIcon />
          </Fab>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectKpis);
