/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/kpi/KpiTable.js
 * Descr:    Provide a list of KPIs in a table.
 * Created:  2019-02-25
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
import { Link, Redirect } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import ExportIcon from "@material-ui/icons/Launch";
import IconButton from "@material-ui/core/IconButton/index";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import { checkPermision } from "../../redux";

const rows = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "title", numeric: false, disablePadding: false, label: "Title",align:"left",width:200 },
  { id: "description", numeric: false, disablePadding: false, label: "Description" ,align:"left",width:300 },
  { id: "tagetValue", numeric: false, disablePadding: false, label: "Taget Value" ,align:"left",width:150 },
  { id: "imported", numeric: false, disablePadding: false, label: "Imported" ,align:"left",width:150 },
  { id: "delete", numeric: false, disablePadding: false, label: "Actions" ,align:"left",width:200 }
];

const rowsWithProject = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" ,align:"left",width:200 },
  { id: "description", numeric: false, disablePadding: false, label: "Description" ,align:"left",width:300 },
  { id: "project", numeric: false, disablePadding: false, label: "Project" ,align:"left",width:300 },
  { id: "tagetValue", numeric: false, disablePadding: false, label: "Taget Value" ,align:"left",width:150 },
  { id: "delete", numeric: false, disablePadding: false, label: "Actions" ,align:"left",width:200 }
];


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount, showProject } = this.props;
    const rowArray = showProject ? rowsWithProject : rows;

    return (
      <TableHead>
        <TableRow>
          {rowArray.map(
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
  rowCount: PropTypes.number.isRequired,
  showProject: PropTypes.number.isRequired
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
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

class KpiTable extends React.Component {
  constructor(props) {
    super(props);
    this.deactivateKpi = this.deactivateKpi.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    selected: [],
    data: [],
    kpiId: null,
    readyToEdit: false,
    fromOrganization: null,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    delLoader: 0
  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  componentDidMount() {
    // KpiTable is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    let projectId = parseInt(this.props.projectId);
    let organizationId = parseInt(this.props.organizationId);
    if (projectId > 0) {
      // Fetch the KPIs only for a single project
      fetch(`/api/kpis-project/${projectId}`)
        .then(res => res.json())
        .then(kpis => this.setState({
          data: kpis,
          fromOrganization: false
        }));
    } else if (organizationId > 0) {
      // Fetch the KPIs only for an organization
      fetch(`/api/kpis-organization/${organizationId}`)
        .then(res => res.json())
        .then(kpis => this.setState({
          data: kpis,
          fromOrganization: true
        }));
    }
  }

  setEditRedirect = kpiId => {
    this.setState({
      readyToEdit: true,
      kpiId: kpiId
    });
  };

  renderEditRedirect = () => {
    // console.log('KPITABLE-=-',this.props.projectId);
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/kpi",
            state: {
              projectId: this.props.projectId,
              organizationId: this.props.organizationId,
              kpiId: this.state.kpiId
            }
          }}
        />
      );
    }
  };

  async deactivateKpi(pkid,id,projectTitles) {
    if (id > 0) {
      // Deactivate a KPI
      this.setState({
        delLoader: id
      })
      
    let projectId = parseInt(this.props.projectId);
    let organizationId = parseInt(this.props.organizationId);
    var removePath = '';
    if (projectId > 0) { 
       removePath = "/api/kpis-deactivate-from-project/" + pkid;
    } else if (organizationId > 0) {
      if(this.state.fromOrganization && projectTitles){
        const msg="KPI cannot be deleted as it is associated with project(s).";
        return  this.setState({ msg, delLoader: 0, openSnackbar: true });
      }
       removePath = "/api/kpis-deactivate/" + id;
    }

      
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          let projectId = parseInt(this.props.projectId);
          let organizationId = parseInt(this.props.organizationId);
          if (projectId > 0) {
            // Fetch the KPIs only for a single project
            fetch(`/api/kpis-project/${projectId}`)
              .then(res => res.json())
              .then(kpis => this.setState({
                data: kpis,
                fromOrganization: false
              }));
          } else if (organizationId > 0) {
            // Fetch the KPIs only for an organization
            fetch(`/api/kpis-organization/${organizationId}`)
              .then(res => res.json())
              .then(kpis => this.setState({
                data: kpis,
                fromOrganization: true
              }));
          }
          this.setState({ msg: "KPI deleted.", delLoader: 0, openSnackbar: true });
          
          if(this.props.refeshePage){
            this.props.refeshePage();
          }
        })
        .catch(err => {
          this.setState({ msg: "Error occurred.", delLoader: 0, openSnackbar: true });
        });
    }
  }
  
  async exportKpi(id) {
    if (id > 0) {
      // Deactivate a KPI
      this.setState({
        delLoader: id
      })
      
      await fetch("/api/export-kpi-to-org/"+id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          let projectId = parseInt(this.props.projectId);
          if (projectId > 0) {
            fetch(`/api/kpis-project/${projectId}`)
              .then(res => res.json())
              .then(kpis => this.setState({
                data: kpis,
                fromOrganization: false
              }));
          } 
          this.setState({ msg: "KPI exported to organization.", delLoader: 0, openSnackbar: true });
          
        })
        .catch(err => {
          this.setState({ msg: "Error occurred.", delLoader: 0, openSnackbar: true });
        });
    }
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

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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
              showProject={this.state.fromOrganization}
              rowCount={data.length}
            />
            <TableBody>
              {data && data.length >0 && stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(kpi => {
                  const isSelected = this.isSelected(kpi.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={kpi.id}
                      selected={isSelected}
                    >
                      
                      <TableCell style={{width:200}}  align="left"  className={classes.noTextDecoration} >{kpi.title}</TableCell>
                      <TableCell style={{width:200}}  align="left" className={classes.noTextDecoration}>{kpi.description}</TableCell>
                      
                      {this.state.fromOrganization && 
                        <TableCell style={{width:200}}  align="left" className={classes.noTextDecoration}>
                          {kpi.projectTitles &&                            
                          <ul style={{padding:15}}>
                          {
                          kpi.projectTitles.split("\n").map((i,key) => 
                                       <li key={key} >{i.trim()}</li> 
                                  )
                          }
                          </ul>   
                          }</TableCell>
                      }
                      <TableCell style={{width:150}}  align="left" className={classes.noTextDecoration}>{kpi.level}</TableCell>
                      
                      { !this.state.fromOrganization &&
                        <TableCell style={{width:150}}  align="left" className={classes.noTextDecoration}>{kpi.projectId>0?'No':'Yes'}</TableCell>
                      
                      }

                      <TableCell style={{width:200}} align="left" component="th" scope="row" padding="none">
                      
                     
                        {checkPermision('Projects KPIs','delete') && this.state.delLoader != 0 && this.state.delLoader == kpi.id?
                            <CircularProgress />
                            :
                            <IconButton
                              onClick={() => {
                                this.deactivateKpi(kpi.pkid,kpi.id,kpi.projectTitles);
                              }}
                            >
                              <DeleteIcon color="primary" />
                            </IconButton>
                        }

                       
                            <IconButton onClick={() =>  this.setEditRedirect(kpi.id) } >
                              <EditIcon color="primary" />
                            </IconButton>
                          

                        { checkPermision('Projects KPIs','modify') 
                          && !this.state.fromOrganization 
                          && kpi.projectId>0 &&
                        
                          <IconButton onClick={() =>  this.exportKpi(kpi.id) } >
                            <ExportIcon color="primary" />
                        </IconButton>
                      }

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
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
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

KpiTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KpiTable);
