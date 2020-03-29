/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectKpis.js
 * Created:  2019-01-05
 * Author:   Brad Kaufman
 * Descr:    List of KPIs for the project selected.
 * -----s
 * Modified: 2019-03-22
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
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
  { id: "title", numeric: false, disablePadding: true, label: "KPI" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type"
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

class ProjectKpis extends Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    kpis: [],
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    // ListKpis is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    let projectid = 0;
    projectid = this.props.projid;

    if (projectid) {
      // Fetch the KPIs only for a single project
      fetch(`/api/kpis/project/${projectid}`)
        .then(res => res.json())
        .then(kpis => this.setState({ kpis }));
    } else {
      // Get all KPIs
      fetch("/api/kpis")
        .then(res => res.json())
        .then(kpis => this.setState({ kpis }));
    }
  }

  // Here I just want to use something like the construct in Topbar to navigate
  // via client/routes.js.
  // Using technique described here, https://tylermcginnis.com/react-router-programmatically-navigate/.
  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    /* react-router has injected the value of the attribute ID into the params */
    //const projectId = this.props.match.params.id;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Typography variant="body1" gutterBottom>
            <Paper className={classes.root}>
              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <MyTableHead />
                  <TableBody>
                    {stableSort(
                      this.state.kpis,
                      getSorting("asc", "title")
                    ).map(kpi => {
                      return (
                        <TableRow
                          hover
                          onClick={event => {
                            this.handleClick(event, kpi.id);
                          }}
                          tabIndex={-1}
                          key={kpi.id}
                        >
                          <TableCell width="25%" align="left">
                            <Link to={`/kpicard/${kpi.id}`}>{kpi.title}</Link>
                          </TableCell>
                          <TableCell width="35%" align="left">
                            {kpi.description}
                          </TableCell>
                          <TableCell width="15%" align="left">
                            {kpi.type}
                          </TableCell>
                          <TableCell align="left">
                            {kpi.organization.name}
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectKpis);
