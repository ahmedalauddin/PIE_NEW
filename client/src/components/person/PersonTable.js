/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/person/PersonTable.js
 * Created:  2019-05-27
 * Descr:    Table of people with edit buttons.
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
// import Chip from '@material-ui/core/Chip';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { desc, stableSort, getSorting } from "../common/TableFunctions";
import DeleteIcon from "@material-ui/icons/Delete";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from '@material-ui/core/CircularProgress';
import ccss from "../custom.css";
import Snackbar from "@material-ui/core/Snackbar";
import { checkPermision } from "../../redux";

// TODO - convert rows into tasks data.
const rows = [
 
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "department", numeric: false, disablePadding: false, label: "Department" },
  { id: "role", numeric: false, disablePadding: false, label: "Role" },
  { id: "projects", numeric: false, disablePadding: false, label: "Projects" },
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "delete", numeric: false, disablePadding: false, label: "Actions" },
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

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class PersonTable extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    order: 'asc',
    orderBy: 'title',
    readyToEdit: false,
    personId: null,
    organizationId: null,
    selected: [],
    data: [],
    persons: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    // ActionTable is expected to take a param of project ID, and fetch the actions
    // associated only with that project.
    let organizationId = parseInt(this.props.organizationId);
    var onlyForOrg = 'true';
    // console.log('organizationId--',organizationId,'--type--',typeof organizationId);
    if(organizationId === 1){
      onlyForOrg = 'false';
    }

    if (organizationId) {
      fetch(`/api/persons-org/${organizationId}/${onlyForOrg}`)
        .then(res => res.json())
        .then(persons => this.setState({ persons: persons }));
    }
  }

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
      this.setState(state => ({ selected: state.persons.map(n => n.id) }));
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

  setEditRedirect = (personId, orgId) => {
    this.setState({
      readyToEdit: true,
      personId: personId,
      organizationId: orgId
    });
  }

  async deactivatePeople(id) {
    console.log('Deactivate This person from ORG');
    if (id > 0) {
      // Deactivate a KPI
      this.setState({
        delLoader: id
      })
      let removePath = "/api/persons/disable_from_org/" + id + "/" + this.props.organizationId;
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disabled: true,
          disabledAt: new Date()
        })
      })
        .then(data => {
          let organizationId = parseInt(this.props.organizationId);
          var onlyForOrg = 'false';
          if(organizationId === '1'){
            onlyForOrg = 'true';
          }
      
          if (organizationId) {
            fetch(`/api/persons-org/${organizationId}/${onlyForOrg}`)
              .then(res => res.json())
              .then(persons => this.setState({ persons: persons }));
          }
          this.setState({ msg: "Person deleted.", delLoader: 0, openSnackbar: true });
        })
        .catch(err => {
          this.setState({ msg: "Error occurred.", delLoader: 0, openSnackbar: true });
        });
    }
  }

  async disablePeople(id) {
    console.log('Disable This person');
    if (id > 0) {
      // Deactivate a KPI
      this.setState({
        delLoader: id
      })
      let removePaths = "/api/persons/disable/" + id;
      await fetch(removePaths, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disabled: true,
          disabledAt: new Date()
        })
      })
        .then(data => {
          let organizationId = parseInt(this.props.organizationId);

          var onlyForOrg = 'false';
          if(organizationId === '1'){
            onlyForOrg = 'true';
          }

          if (organizationId) {
            fetch(`/api/persons-org/${organizationId}/${onlyForOrg}`)
              .then(res => res.json())
              .then(persons => this.setState({ persons: persons }));
          }
          this.setState({ msg: "Person deleted.", delLoader: 0, openSnackbar: true });
        })
        .catch(err => {
          this.setState({ msg: "Error occurred.", delLoader: 0, openSnackbar: true });
        });
    }
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={{
        pathname: '/person',
        state: {
          personId: this.state.personId,
          organizationId: this.state.organizationId,
          referrer: '/organization'
        }
      }} />;
    }
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { persons, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, persons.length - page * rowsPerPage);
    let organizationId = parseInt(this.props.organizationId);
    return (
      <div className="people-list-org">
        {this.renderEditRedirect()}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={persons.length}
            />
            <TableBody>
              {persons && persons.length && stableSort(persons, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(person => {
                  const isSelected = this.isSelected(person.id);
                  if(person.projects !== null){
                    var projectsStr = person.projects.split(",")
                  }else{
                    var projectsStr = []
                  }
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={person.id}
                      selected={isSelected}
                    >
                     
                      
                      <TableCell align="left" >
                        {person.fullName}
                      </TableCell>
                      <TableCell align="left" >{person.email}</TableCell>
                      <TableCell align="left" >{person.department}</TableCell>
                  <TableCell align="left" >{person.isCustomerAdmin && 'Admin'+(person.role ? ', ':'')}{person.role}</TableCell>
                      <TableCell align="left" >
                        <ul style={{padding:15}}>
                        {                          
                          projectsStr && projectsStr.map((pers,key) => {
                            if (pers) return  <li key={key} >{pers}</li> 
                          })
                        }
                        </ul>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" >
                      {checkPermision('Organization People','delete') &&<>
                        {
                          this.state.delLoader != 0 && this.state.delLoader == person.id ?
                            <CircularProgress />
                            :
                            <IconButton
                              onClick={() => {
                                if(projectsStr.length > 0){
                                  alert('Can not perform deletion as user is associated with some project(s).');
                                }else{
                                  if(person.orgId === organizationId){
                                    this.disablePeople(person.id);
                                  }else{
                                    this.deactivatePeople(person.id);
                                  }
                                }
                              }}
                            >
                              <DeleteIcon color="primary" />
                            </IconButton>
                        }
                      </>}
                        <IconButton onClick={() => { this.setEditRedirect(person.id, person.orgId); }}>
                          <EditIcon color="primary" />
                        </IconButton>
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
          count={persons.length}
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
         <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.msg}</span>}
        />
      </div>
    );
  }
}

PersonTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PersonTable);
