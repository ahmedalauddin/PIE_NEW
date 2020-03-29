import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
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
import IconButton from "@material-ui/core/IconButton/index";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { getOrgName, getOrgId } from "../../redux";
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab/index";
import moment from "moment";

const rows = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },
  { id: "uploadedby", numeric: false, disablePadding: false, label: "Uploaded by" },
  { id: "created", numeric: false, disablePadding: false, label: "Date Added" },
   { id: "actions", numeric: false, disablePadding: false, label: "Actions" }
  // { id: "type", numeric: false, disablePadding: false, label: "Type" },
  // // { id: "tags", numeric: false, disablePadding: false, label: "Tags" },
  // // { id: "delete", numeric: false, disablePadding: false, label: "Actions" }
];




class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

newstyles = theme => ({
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
  heading: {
    fontSize: theme.typography.pxToRem(115),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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
                     <Typography className={this.newstyles.heading}>
                     {row.label}
                    </Typography>
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

class OrganizationDocumentTable extends React.Component {
  constructor(props) {
    super(props);
    // this.deactivateKpi = this.deactivateOrganizationAction.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    selected: [],
    OrganizationDocuments: [],
    actionid: null,
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
    
    let orgId = parseInt(getOrgId());
    
      // Fetch the KPIs only for a single project
      fetch(`/api/organization-document/${orgId}`)
        .then(res => res.json())
        .then(OrganizationDocuments => this.setState({
          OrganizationDocuments: OrganizationDocuments,
          fromOrganization: false
        }));

  }

  setEditRedirect = actionid => {
    this.setState({
      readyToEdit: true,
      actionid: actionid
    });
  };

  renderEditRedirect = () => {
    // console.log('OrganizationDocumentTable-=-',this.props.orgId);
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/OrganizationDocumentUpdate",
            state: {
              orgId: this.props.orgId,
              id: this.state.actionid
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
      let removePath = "/api/organization-document-deactivate/" + id;
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          const data2 = this.state.OrganizationDocuments.filter(i => i.id !== id)
         this.setState({
          OrganizationDocuments:data2
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
    const { OrganizationDocuments, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, OrganizationDocuments.length - page * rowsPerPage);

    return (
      <React.Fragment>
          
        <div className={classes.paddingbottom20+' '+classes.root}>
        <div className="list-cls list-cls-tbody-displaycontents">
        <Grid container justify="center">
            <Grid spacing={12} container lg={10} alignItems="center" justify="center">
              <Grid item xs={12} md={10}>
                <Card className={classes.card}>
                  <CardContent className="list-project-panellist">
                
                    <Typography className="h2heading">
                        Documents for {getOrgName()}
                    </Typography>
        <div className="padding25px">
        {this.renderEditRedirect()}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              showProject={this.state.fromOrganization}
              rowCount={OrganizationDocuments.length}
            />
            <TableBody>
              {stableSort(OrganizationDocuments, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(OrganizationAction => {
                  const isSelected = this.isSelected(OrganizationAction.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={OrganizationAction.id}
                      selected={isSelected}
                      className="testingclass"
                    >
                      
                      <TableCell align="left" onClick={() => {
                            this.setEditRedirect(OrganizationAction.id);
                          }}
                          className={classes.noTextDecoration}
                          >
                             <Typography className={classes.heading}>
                             {OrganizationAction.title}
                                    </Typography>
                            </TableCell>
                      <TableCell align="left" onClick={() => {
                            this.setEditRedirect(OrganizationAction.id);
                          }} className={classes.noTextDecoration}
                          >
                             <Typography className={classes.heading}>{OrganizationAction.description}</Typography></TableCell>

                        <TableCell align="left" onClick={() => {
                            this.setEditRedirect(OrganizationAction.id);
                          }} className={classes.noTextDecoration}
                          >
                             <Typography className={classes.heading}>{OrganizationAction.person && OrganizationAction.person.fullName}</Typography></TableCell>
                     
                      {<TableCell align="left" onClick={() => {
                            this.setEditRedirect(OrganizationAction.id);
                          }} className={classes.noTextDecoration}
                          >
                             <Typography className={classes.heading}>{moment(OrganizationAction.createdAt).format("YYYY-MM-DD")}</Typography></TableCell>}
                     

                       <TableCell component="th" scope="row" padding="none">
                      
                     
                        {
                          this.state.delLoader != 0 && this.state.delLoader == OrganizationAction.id ?
                            <CircularProgress />
                            :
                            <IconButton
                              onClick={() => {
                                this.deactivate(OrganizationAction.id);
                              }}
                            >
                              <DeleteIcon color="primary" />
                            </IconButton>
                        }

{OrganizationAction.fileName === '' ? 'asdasd' :
                        <IconButton
                        // onClick={() => {
                        //   this.deactivate(ProjectAction.id);
                        // }}
                      >
                         <a target='_blank' href={`/docs/${OrganizationAction.fileName}`} >
                              <GetAppIcon color="primary" />
                        </a> 
                        </IconButton>
                        } 

                        <IconButton
                          onClick={() => {
                            this.setEditRedirect(OrganizationAction.id);
                          }}
                        >
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
          count={OrganizationDocuments.length}
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
 <Fab component={Link} color="primary" aria-label="Add" to={{ pathname: "/OrganizationDocument", state: { orgId: this.props.orgId } }} className={classes.fab}>
            <AddIcon />
          </Fab>
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
      </CardContent></Card></Grid></Grid></Grid></div></div>
    </React.Fragment>
    );
  }
}

OrganizationDocumentTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrganizationDocumentTable);
