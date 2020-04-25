/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/department/DepartmentTable.js
 * Descr:    Provide a list of departments in a table.
 * Created:  2019-03-25
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-31
 * Editor:   Brad Kaufman
 */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles/index";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody/index";
import TableCell from "@material-ui/core/TableCell/index";
import TableHead from "@material-ui/core/TableHead/index";
import TablePagination from "@material-ui/core/TablePagination/index";
import TableRow from "@material-ui/core/TableRow/index";
import TableSortLabel from "@material-ui/core/TableSortLabel/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import DeleteIcon from "@material-ui/icons/Delete";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import {Link, Redirect} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton/index";
import { checkPermision } from "../../redux";

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
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "delete", numeric: false, disablePadding: false, label: "Actions" },
  // { id: "edit", numeric: false, disablePadding: false, label: "Actions" },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
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
            this,
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
  rowCount: PropTypes.number.isRequired,
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: "0 0 auto",
  },
});

class DepartmentTable extends React.Component {
  constructor(props) {
    super(props);
    this.deactivateDepartment = this.deactivateDepartment.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    selected: [],
    data:[],
    departmentId: null,
    organizationId: null,
    readyToEdit: false,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    let organizationId = parseInt(this.props.organizationId);

    if (organizationId > 0) {
      // Fetch the KPIs only for a single organization
      fetch(`/api/departments/org/${organizationId}`)
        .then(res => res.json())
        .then(departments => this.setState({data: departments}));
    }
  }

  setEditRedirect = (departmentId) => {
    this.setState({
      readyToEdit: true,
      departmentId: departmentId
    });
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={{
        pathname: "/department",
        state: {
          organizationId: this.props.organizationId,
          departmentId: this.state.departmentId
        }
      }} />;
    }
  }

  deactivateDepartment(id) {
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a KPI
        let removePath = "/api/departments-deactivate/" + id;
        fetch(removePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            let organizationId = parseInt(this.props.organizationId);

            if (organizationId > 0) {
              // Fetch the KPIs only for a single organization
              fetch(`/api/departments/org/${organizationId}`)
                .then(res => res.json())
                .then(departments => this.setState({data: departments}));
            }
            this.setState({ msg: "Department deactivated." });
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      }
    }, 2000);
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
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
        selected.slice(selectedIndex + 1),
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

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div>
        {this.renderEditRedirect()}
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
                .map(department => {
                  const isSelected = this.isSelected(department.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={department.id}
                      selected={isSelected}
                    >
                      
                      <TableCell align="left" onClick={() => {this.setEditRedirect(department.id);}}>
                        {department.name}
                      </TableCell>
                      <TableCell align="left" onClick={() => {this.setEditRedirect(department.id);}}>
                        {department.description}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        
                      {checkPermision('Organization Department','delete') && 
                        <IconButton onClick={() => {this.deactivateDepartment(department.id);}}>
                          <DeleteIcon color="primary" />
                        </IconButton>
                        }
                      {checkPermision('Organization Department','modify') && 
                        <IconButton onClick={() => {this.setEditRedirect(department.id);}}>
                          <EditIcon color="primary" />
                        </IconButton>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
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
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

DepartmentTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DepartmentTable);
