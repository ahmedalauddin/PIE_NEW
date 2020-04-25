/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindmapList.js
 * Created:  2019-10-01
 * Desc:     List of mind maps for an organization.  Used to select which one to edit.
 * Author:   Brad Kaufman
 *
 * Modified: 2019-12-26
 * Changes:  Format list to be centered on the screen.  Removed maxWidth parameter on `card` from `const styles` to allow
 *           the component to be centered on the screen.  Changed delete button to deactivateMindmap().
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import moment from "moment/moment";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import { getOrgId, getOrgName, checkPermision } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TablePagination from "@material-ui/core/TablePagination";
import EnhancedTableHead from "../common/EnhancedTableHead";
import { stableSort, getSorting } from "../common/TableFunctions";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import SectionHeader from "../typo/SectionHeader";
// import ccss from "../custom.css";
import Skeleton from 'react-loading-skeleton';
import DeleteMindmapDialog from '../dialogs/DeleteMindmapDialog';
import PageTitle from '../PageTitle';

const rows = [
  
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Created" },
  { id: "updatedAt", numeric: false, disablePadding: false, label: "Updated" },
  // { id: "delete", numeric: false, disablePadding: true, label: "" },
  { id: "edit", numeric: false, disablePadding: false, label: "Actions" }
];

function formatDate(dateInput) {
  let dateOut = "";

  if (dateInput !== null) {
    dateOut = moment(dateInput).format("YYYY-MM-DD");
  }
  return dateOut;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0
  },
  card: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  noTextDecoration: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "15%"
  },
  wideColumn: {
    flexBasis: "30%"
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    }
  }
});

class MindmapList extends Component {
  constructor(props) {
    super(props);
    this.addMindmap = this.addMindmap.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setEditRedirect = this.setEditRedirect.bind(this);
    this.renderEditRedirect = this.renderEditRedirect.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: getOrgId(),
    orgName: getOrgName(),
    selected: [],
    readyToEdit: false,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    mindmaps: [],
    readyToRedirect: false,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false,
    skeletonLoader:true,
    openSnackbar: false,
      message: "",
      openDialog : false,
      deletemindMapId:''
  };

  openDialog(mindMapId) {
    this.setState({openDialog: true, deletemindMapId:mindMapId})
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    return <Redirect to="/Login" />;
  };

  componentDidMount() {

    let message = "";
    if (this.props.location.state && this.props.location.state.message)  {
      message = this.props.location.state.message;
      this.setState({
        openSnackbar: true,
        message: message
      });
    }


    if (!(getOrgId() > 0)) {
      this.setState({
        hasError: true
      });
    }

    fetch("/api/mindmaps-list/" + getOrgId())
      .then(res => {
        this.setState({skeletonLoader:false})
        return res.json();
      })
      .then(mindmaps => {
        this.setState({
          mindmaps: mindmaps,
          skeletonLoader:false
        });
      });
  };


  showMessages = (message) => {
    // alert(message);
    this.setState( {
      openSnackbar: true,
      message: message
    });
  };

  // Functions for the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  deactivateMindmap = (id) => {
    // const thisOne = this;
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a mind map
        let removePath = "/api/mindmaps/" + id;
        fetch(removePath, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => response.json())
          .then((response) => {
           
            const data = this.state.mindmaps.filter(i => i.id !== id)
          
            this.setState({mindmaps:data})
        
            this.setState({
              openSnackbar: true,
              openDialog:false,
              message: response.message ? response.message : 'MindMap Deleted'
            });
          })
          .catch(err => {
            
            this.setState({ msg: "Error occurred.",skeletonLoader:false,openSnackbar: true, message: "Error occurred.", openDialog:false  });
          });
      }
    }, 2000);
  }


  handelCloseDialog = () => {
    this.setState({openDialog:false  });
  }


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

  addMindmap = () => {
    return <Redirect to="/mindmap" />;
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  setEditRedirect = (mindmapId) => {
    this.setState({
      readyToEdit: true,
      mindmapId: mindmapId
    });
  };

  // Redirect to Mindmap.
  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/mindmap/${this.state.mindmapId}`} />;
    }
  };


  render() {
    const { classes } = this.props;
    const { mindmaps, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, mindmaps.length - page * rowsPerPage);
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <Redirect to="/Login" />;
    }

// console.log('mindmaps-',mindmaps);
    var arr = mindmaps.length;
    var rowsOptions = [];
    for (var i = 1; i <= arr; i++) {
      var n = i * 5;
      if (n < arr)
        rowsOptions.push(n);
    }
    rowsOptions.push(arr);

    return (
      <React.Fragment>
        <DeleteMindmapDialog open={this.state.openDialog} deletemindMapId={this.state.deletemindMapId} closeFunction={this.handelCloseDialog} delFunction={this.deactivateMindmap} heading="Are you sure you want to delete this Mindmap?" />
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          {this.renderEditRedirect()}
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard"> 
            <PageTitle pageTitle={"Mind maps for "+getOrgName()} />
            <Grid spacing={12} container alignItems="center" justify="center">
              <Grid item xs={12} md={10}>
                <SectionHeader title="" subtitle="" />
                <Card className={classes.card}>
                  <CardContent>
                  
                    <div className={classes.tableWrapper}>
                      <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                          numSelected={selected.length}
                          rows={rows}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={this.handleRequestSort}
                          rowCount={mindmaps.length}
                        />
                        <TableBody>
                            {!this.state.skeletonLoader && stableSort(mindmaps, getSorting(order, orderBy))
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map(mindmap => {
                              const isSelected = this.isSelected(mindmap.id);
                              return (
                                <TableRow
                                  hover
                                  aria-checked={isSelected}
                                  tabIndex={-1}
                                  key={mindmap.id}
                                  selected={isSelected}
                                  className="testingclass"
                                  
                                >
                                  
                                  <TableCell align="left"
                                  to={{pathname: "/mindmap/", state: {mindmapId: mindmap.id} }}
                                  component={Link}
                                  className={classes.noTextDecoration}
                                  >
                                     <Typography className={classes.heading}>
                                      {mindmap.mapName}
                                    </Typography>
                                   </TableCell>
                                  <TableCell align="left"
                                  to={{pathname: "/mindmap/", state: {mindmapId: mindmap.id} }}
                                  component={Link}
                                  className={classes.noTextDecoration}>
                                    <Typography className={classes.heading}>{mindmap.mapDescription}</Typography></TableCell>
                                  <TableCell align="left"
                                  to={{pathname: "/mindmap/", state: {mindmapId: mindmap.id} }}
                                  component={Link}
                                  className={classes.noTextDecoration}><Typography className={classes.heading}>{formatDate(mindmap.createdAt)}</Typography></TableCell>
                                  <TableCell align="left"
                                  to={{pathname: "/mindmap/", state: {mindmapId: mindmap.id} }}
                                  component={Link}
                                  className={classes.noTextDecoration}><Typography className={classes.heading}>{formatDate(mindmap.updatedAt)}</Typography></TableCell>
                                  <TableCell padding="none">
                                  {checkPermision('Mind Map','delete') && 
                                    <IconButton
                                      onClick={() => {
                                        this.openDialog(mindmap.id);
                                      }}
                                    >
                                      <DeleteIcon color="primary" />
                                    </IconButton>}
                                  
                                    {/* <IconButton
                                      onClick={() => {
                                        this.setEditRedirect(mindmap.id);
                                      }}
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton> */}
                                    <IconButton variant="contained" color="primary" className={classes.button} component={Link} size="small"
                                      aria-label="Add" to={{pathname: "/mindmap/", state: {mindmapId: mindmap.id} }} >
                                      <EditIcon color="primary" />
                                      </IconButton>
                                  </TableCell>

                                </TableRow>
                              );
                            })}
                          {/* {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                              <TableCell colSpan={6} />
                            </TableRow>
                          )} */}
                        </TableBody>
                      </Table>
                      {this.state.skeletonLoader &&
                        <div className="skeleton-mindmap">                          
                              <Skeleton count={20}/>                           
                        </div>
                      }
                    </div>
                    {!this.state.skeletonLoader &&
                    <TablePagination
                        rowsPerPageOptions={rowsOptions}
                        component="div"
                        count={mindmaps.length}
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
                    }
                    <br />
                    <br />

                    {checkPermision('Mind Map','write') && 
                    <Fab component={Link} color="primary" aria-label="Add" to={`/mindmap`} className={classes.fab}>
                      <AddIcon />
                    </Fab>
                    }
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Snackbar
              open={this.state.openSnackbar}
              onClose={this.handleClose}
              TransitionComponent={this.state.Transition}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={<span id="message-id">{this.state.message}</span>}
            />
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MindmapList);
