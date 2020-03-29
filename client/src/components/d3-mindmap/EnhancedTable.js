/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/EnhancedTable.js
 * Created:  2019-10-01
 * Desc:     List of mind maps for an organization.  Used to select which one to edit.
 * Author:   Brad Kaufman
 *
 * Modified: 2019-10-02
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import moment from "moment/moment";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import { getOrgId, getOrgName } from "../../redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/core/SvgIcon/SvgIcon";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import EnhancedTableHead from "../common/EnhancedTableHead";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import DeleteIcon from "@material-ui/icons/Delete";


// Pass in rows.
const rows = [
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Created" },
  { id: "updatedAt", numeric: false, disablePadding: true, label: "Updated" }
];


function formatDate(dateInput) {
  let dateOut = "";

  if (dateInput !== null) {
    dateOut = moment(dateInput).format("YYYY-MM-DD");
  }
  return dateOut;
}

function handleNull(refToParse) {
  try {
    if (refToParse != null) {
      return refToParse;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
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
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%",
  },
  wideColumn: {
    flexBasis: "35%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

class EnhancedTable extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
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
    data: [],
    readyToRedirect: false,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {

  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  deactivateMindmap(id) {
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a mind map

        // Need something here.

        let removePath = "/api/mindmaps-deactivate/" + id;
        fetch(removePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            this.setState({ msg: "KPI updated." });
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      }
    }, 2000);
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // Redirect to Mindmap.
  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/somewhere",
            state: {
              mindmapId: this.state.mindmapId
            }
          }}
        />
      );
    }
  };

  render() {
    const { classes } = this.props;
    const { mindmaps, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, mindmaps.length - page * rowsPerPage);
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div>
          {this.renderEditRedirect()}
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
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(data => {
                    const isSelected = this.isSelected(data.id);
                    return (
                      <TableRow
                        hover
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={mindmap.id}
                        selected={isSelected}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <IconButton
                            onClick={() => {
                              this.setEditRedirect(mindmap.id);
                            }}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                        </TableCell>

                        // for loop here...
                        <TableCell align="left">{data.title}</TableCell>
                        <TableCell align="left">{mindmap.description}</TableCell>
                        <TableCell align="left">{mindmap.createdAt}</TableCell>
                        <TableCell align="left">{mindmap.updatedAt}</TableCell>



                        <TableCell padding="none">
                          <IconButton
                            onClick={() => {

                              // pass in this function.
                              this.deactivate(data.id);
                            }}
                          >
                            <DeleteIcon color="primary" />
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
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
