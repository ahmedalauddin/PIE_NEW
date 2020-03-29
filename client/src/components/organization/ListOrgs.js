// List for editing organizations, 2/22/19.
// Will be removed eventually.  Essentially a test harness for EditOrg.
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
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
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

class ListProjects extends Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    organizations: [],
    toOrganization: "false",
    toOrganizationId: ""
  };

  componentDidMount() {
    fetch("/api/organizations")
      .then(res => res.json())
      .then(organizations => this.setState({ organizations }));
  }

  // Here I just want to use something like the construct in Topbar to navigate
  // via client/routes.js.
  // Using technique described here, https://tylermcginnis.com/react-router-programmatically-navigate/.
  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
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
                        Full list of all organizations
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
                                  this.state.organizations,
                                  getSorting("asc", "title")
                                ).map(organization => {
                                  return (
                                    <TableRow
                                      hover
                                      onClick={event => {
                                        this.handleClick(
                                          event,
                                          organization.id
                                        );
                                      }}
                                      tabIndex={-1}
                                      key={organization.id}
                                    >
                                      <TableCell align="right">
                                        {organization.id}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Link
                                          to={`/organizationcard/${
                                            organization.id
                                          }`}
                                        >
                                          {organization.name}
                                        </Link>
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

export default withStyles(styles)(ListProjects);
