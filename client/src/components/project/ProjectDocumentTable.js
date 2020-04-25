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
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from "@material-ui/core/IconButton/index";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import moment from "moment";
import filesize from "filesize";
import { checkPermision } from "../../redux";

const rows = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "title", numeric: false, disablePadding: false, label: "Title/Description" },
  {
    id: "filename",
    numeric: false,
    disablePadding: false,
    label: "File Name"
  },
  
  { id: "fileSize", numeric: false, disablePadding: false, label: "File Size" },
  { id: "uploadedby", numeric: false, disablePadding: false, label: "Uploaded by" },
  { id: "created", numeric: false, disablePadding: false, label: "Date Added" },
   { id: "actions", numeric: false, disablePadding: false, label: "Actions" }
  // { id: "type", numeric: false, disablePadding: false, label: "Type" },
  // // { id: "tags", numeric: false, disablePadding: false, label: "Tags" },
  // // { id: "delete", numeric: false, disablePadding: false, label: "Actions" }
];

// const rowsWithProject = [
//   // { id: "edit", numeric: false, disablePadding: false, label: "" },
//   { id: "title", numeric: false, disablePadding: false, label: "Title" },
//   {
//     id: "description",
//     numeric: false,
//     disablePadding: false,
//     label: "Description"
//   },
//   { id: "project", numeric: false, disablePadding: false, label: "Project" },
//   { id: "type", numeric: false, disablePadding: false, label: "Type" },
//   { id: "tags", numeric: false, disablePadding: false, label: "Tags" },
//   { id: "delete", numeric: false, disablePadding: false, label: "Actions" }
// ];


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount, showProject } = this.props;
    const rowArray = rows;

    return (
      <TableHead>
        <TableRow>
          {rowArray.map(
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

class ProjectActionTable extends React.Component {
  constructor(props) {
    super(props);
    // this.deactivateKpi = this.deactivateProjectAction.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    selected: [],
    ProjectDocuments: [],
    // ProjectActionPersons: [],
    id: null,
    readyToEdit: false,
    fromOrganization: null,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    delLoader: 0,
    readyToDownload: false,
    downloadfilename: ''

  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  componentDidMount() {
    let projectId = parseInt(this.props.projectId);
    
      // Fetch the KPIs only for a single project
      fetch(`/api/project-document/${projectId}`)
        .then(res => res.json())
        .then(respose => this.setState({
          ProjectDocuments: respose,
          // fromOrganization: false
        }));

        
  }



  setEditRedirect = id => {
    this.setState({
      readyToEdit: true,
      id: id
    });
  };

  renderEditRedirect = () => {
    //console.log('ProjectDocumentTable-=-',this.props.projectId, this.state.readyToEdit);
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/ProjectDocumentUpdate",
            state: {
              projectId: this.props.projectId,
              id: this.state.id
            }
          }}
        />
      );
    }
  };

  async deactivate(id) {
    if (id > 0) {
      // Deactivate a Action
      this.setState({
        delLoader: id
      })
      let removePath = "/api/project-document-deactivate/" + id;
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          const data2 = this.state.ProjectDocuments.filter(i => i.id !== id)
         this.setState({
          ProjectDocuments:data2
          })
            
          this.setState({ msg: "Document deleted.", delLoader: 0, openSnackbar: true });
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
    const { ProjectDocuments, ProjectActionPersons, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, ProjectDocuments.length - page * rowsPerPage);
      
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
              rowCount={ProjectDocuments.length}
            />
            <TableBody>
              {stableSort(ProjectDocuments, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(ProjectAction => {
                  const isSelected = this.isSelected(ProjectAction.id);
                 
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={ProjectAction.id}
                      selected={isSelected}
                    >
                      
                      <TableCell align="left" 
                      onClick={() => {
                            this.setEditRedirect(ProjectAction.id);
                          }}
                          >{ProjectAction.title}</TableCell>
                      <TableCell align="left" 
                      onClick={() => {
                            this.setEditRedirect(ProjectAction.id);
                          }}
                          >
                            {ProjectAction.fileName === '' ? '' : ProjectAction.fileName.split('/')[1]}
                            </TableCell>

                     
                     

                            {ProjectAction.fileName === '' ? '' :
                            <TableCell align="left" 
                              onClick={() => {
                            this.setEditRedirect(ProjectAction.id);
                          }}
    >{ProjectAction.fileSize && ProjectAction.fileSize == '' ? '' : filesize(ProjectAction.fileSize, {exponent: 2})}
                            </TableCell>
                            }

<TableCell align="left" 
                      onClick={() => {
                            this.setEditRedirect(ProjectAction.id);
                          }}
                          >{ProjectAction.person.disabled && ProjectAction.person.disabled == true ? '' : ProjectAction.person.fullName}
                            </TableCell>

                      {<TableCell align="left" 
                      onClick={() => {
                            this.setEditRedirect(ProjectAction.id);
                          }}
                          >{moment(ProjectAction.createdAt).format("YYYY-MM-DD")}</TableCell>}
                     

                       <TableCell component="th" scope="row" padding="none">
                      

                       {ProjectAction.fileName === '' ? '' :
                        <IconButton >
                         <a target='_blank' href={`/docs/${ProjectAction.fileName}`} >
                              <GetAppIcon color="primary" />
                        </a> 
                        </IconButton>
                        } 
                     
                        {
                          this.state.delLoader != 0 && this.state.delLoader == ProjectAction.id ?
                            <CircularProgress />
                            :
                            <>
                          {checkPermision('Projects Documents','delete') && 
                            <IconButton
                              onClick={() => {
                                this.deactivate(ProjectAction.id);
                              }}
                            >
                              <DeleteIcon color="primary" />
                            </IconButton>
                            }


                            <IconButton
                              onClick={() => {
                                this.setEditRedirect(ProjectAction.id);
                              }}
                            >
                              <EditIcon color="primary" />
                            </IconButton>

                            </>
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
          count={ProjectDocuments.length}
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

ProjectActionTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectActionTable);
