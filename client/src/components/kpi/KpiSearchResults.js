/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/kpi/kpisearchresults.js
 * Created:  2019-04-08
 * Author:   Brad Kaufman
 * Desc:     Returns list of KPIs.
 *
 * Modified: 2019-01-11
 * Changes:  Remove unused vars.
 * Editor:   Brad Kaufman
 */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { Link, Redirect } from "react-router-dom";
import { getProjectName, getProject, getOrgName, getOrgId } from "../../redux";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: "edit", numeric: false, disablePadding: false, label: "",align:"left",width:100 },
  { id: "title", numeric: false, disablePadding: false, label: "Title",align:"left",width:200 },
  { id: "description", numeric: false, disablePadding: false, label: "Description" ,align:"left",width:200},
  { id: "type", numeric: false, disablePadding: false, label: "Type" ,align:"left",width:100},
  { id: "project", numeric: false, disablePadding: false, label: "Project Name" ,align:"left",width:200},
  { id: "organization", numeric: false, disablePadding: false, label: "Client",align:"left",width:200 },
  { id: "tags", numeric: false, disablePadding: false, label: "Tags",align:"left",width:200 }
];

class EnhancedTableHead extends React.Component {
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
                align={row.align}
                style={{width:row.width}}
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class KpiSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.performSearch = this.performSearch.bind(this);
    this.editComponent = this.editComponent.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleAssign = this.handleAssign.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    projectId: null,
    selected: [],
    data: [], // this will be for the kpis
    submitted: null,
    lastSearchString: "",
    readyToRedirect: false,
    page: 0,
    rowsPerPage: 5
  };

  performSearch(searchString=null) {
    // Search KPIs
    const projectId = getProject().id;
    const orgId = getOrgId();
    const searchOrgOnly = this.props.searchOrgOnly;
    if (searchString !== ""  && searchString !== this.state.lastSearchString) {
      fetch("/api/kpis-search", {
        method: "GET",
        headers: new Headers({
          searchString: searchString,
          projectId: projectId,
          orgId: orgId,
          searchOrgOnly: true     // Always set this to true for now, revisit searching across other organizations later, 2-28-2020.
        })
      })
        .then(res => res.json())
        .then(kpis =>
          this.setState({
            data: kpis,
            submitted: true,
            projectId: projectId,
            lastSearchString: searchString
          })
        );
    }
  }

  componentWillReceiveProps(props) {
    this.performSearch(props.searchString);
  }

  componentDidMount() {
    this.performSearch();
  }

  editComponent(id) {
    return `<Redirect to={{
      pathname: '/kpi',
      state: {
        projectId: ${this.props.projectId},
        kpiId: ${id}
      }
    }} />`;
  }

  handleAssign(event) {
    event.preventDefault();
console.log('this.state--',this.state);

    const projectId = getProject().id;
    const orgnId = getOrgId();

    fetch("/api/kpis-assign/" + projectId + "/" + orgnId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(responsejs => {
        // console.log('responsejs--',responsejs);
        // Redirect to the Project component.
        this.setState({
          readyToRedirect: true,
          projId: projectId,
          message: responsejs.message
        });
      })
      .catch(err => {});
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleToggle = value => () => {
    // Use "selected" on the KPI search result array to manage the checkbox toggle,
    // stored in state as data[].
    const { data } = this.state;
    const idArray = data.map(k => {
      return k.id;
    });
    const currentIndex = idArray.indexOf(parseInt(value));
    data[currentIndex].selected = !data[currentIndex].selected;

    this.setState({
      data: data
    });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const projectId = getProject().id;
    const projectName = getProjectName();
    const orgName = getOrgName();

    if (this.state.readyToRedirect) {
      // return <Redirect to={`/project/`} />;

      return (
        <Redirect
          to={{
            pathname: "/project/",
            state: {
              message: `${this.state.message}`,
              projId: `${this.state.projId}`
            }
          }}
        />
      );
    }

    return (
      <div>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell  style={{width:100}} align="left" className={classes.noTextDecoration} component="th" scope="row" padding="checkbox">
                        <Checkbox
                          key={n.id}
                          checked={!!+n.selected}
                          tabIndex={-1}
                          onChange={this.handleToggle(n.id)}
                        />
                      </TableCell>
                     
                      <TableCell style={{width:200}} align="left" className={classes.noTextDecoration} align="left">                       
                          {n.title}                      
                      </TableCell>
                      <TableCell style={{width:200}} align="left" className={classes.noTextDecoration}>{n.description}</TableCell>
                      <TableCell style={{width:100}} align="left" className={classes.noTextDecoration}>{(n.type && n.type!='null')?n.type:""}</TableCell>
                      
                      <TableCell style={{width:200}} align="left" className={classes.noTextDecoration}>{n.projectTitles &&

                        <ul style={{padding:15}}>
                          {
                            n.projectTitles.split("\n").map((i, key) =>
                              <li key={key} >{i.trim()}</li>
                            )
                          }
                        </ul>
                      }</TableCell>
                      
                      <TableCell align="left" style={{width:200}} align="left" className={classes.noTextDecoration} >{n.orgName}</TableCell>
                      <TableCell align="left" style={{width:200}} align="left" className={classes.noTextDecoration}>{n.tags}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
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

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleAssign}
          className={classes.secondary}
        >
          Assign to Project
        </Button>
        <br />
        <br />
        <Typography component="h5" color="default" gutterBottom>
          Project: {projectName}
          <br />
          Organization: {orgName}
        </Typography>
      </div>
    );
  }
}

KpiSearchResults.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KpiSearchResults);
