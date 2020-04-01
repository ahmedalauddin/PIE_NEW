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
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
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
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab/index";
import moment from "moment";
import { styles } from "../styles/DashboardStyles";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import TextField from '@material-ui/core/TextField';
import PageTitle from "../PageTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import FormHelperText from "@material-ui/core/FormHelperText";
import OrganizationMemberAction from "../organization/OrganizationMemberAction";

const rows = [
  { id: "assignedto", numeric: false, disablePadding: false, label: "Members" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "dateadded", numeric: false, disablePadding: false, label: "Date Added" },
   { id: "actions", numeric: false, disablePadding: false, label: "Actions" }
];

const statuses = [
  "Open",
  "Closed"
];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
};


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

// const styles = theme => ({
//   root: {
//     width: "100%",
//     marginTop: theme.spacing.unit * 3,
//     paddingRight: theme.spacing.unit
//   },
//   table: {
//     minWidth: 1020
//   },
//   tableWrapper: {
//     overflowX: "auto"
//   },
//   highlight:
//     theme.palette.type === "light"
//       ? {
//         color: theme.palette.secondary.main,
//         backgroundColor: lighten(theme.palette.secondary.light, 0.85)
//       }
//       : {
//         color: theme.palette.text.primary,
//         backgroundColor: theme.palette.secondary.dark
//       },
//   spacer: {
//     flex: "1 1 100%"
//   },
//   actions: {
//     color: theme.palette.text.secondary
//   },
//   title: {
//     flex: "0 0 auto"
//   }
// });
const selectDefaultValue={ id:-1,fullName: "Select Member"};

class OrganizationActionTable extends React.Component {
  constructor(props) {
    super(props);
    // this.deactivateKpi = this.deactivateOrganizationAction.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    selected: [],
    OrganizationActions: [],
    actionid: null,
    readyToEdit: false,
    fromOrganization: null,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    delLoader: 0,
    filterDate: moment(new Date()).format("YYYY-MM-DD"),
    assigneeId: -1,
    persons: [],
    status: [],
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    selectedMember:false
  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  componentDidMount() {
    
    
    
      // Fetch the KPIs only for a single project
    this.fetchData(this.state.filterDate);

  }
  changeFilterDate(e){
    console.log("changedDate...............",e.target.value );
    this.fetchData(e.target.value);
  }

  fetchData(filterDate){
    let orgId = parseInt(getOrgId());
    let uri=`/api/action-organization/${orgId}`;
    if(filterDate){
      uri+=`/${filterDate}`;
    }
    fetch(uri)
    .then(res => res.json())
    .then(OrganizationActions => this.setState({
      OrganizationActions: OrganizationActions,
      fromOrganization: false,
      filterDate,
      assigneeId:-1
    }));

    const persons=[];
    persons.push(selectDefaultValue);
    this.setState({persons});

    if (parseInt(orgId) > 0) { 
     
      fetch(`/api/organization-action-persons/${orgId}`)
        .then(res => res.json())
        .then(response => {
         const _persons=[];
         _persons.push(selectDefaultValue);
         this.setState({persons:_persons.concat(response)});
        });
    }
  }
  setEditRedirect = actionid => {
    
    this.setState({
      readyToEdit: true,
      actionid: actionid,
      selectedMember: (this.state.actionid==actionid)?!this.state.selectedMember:true
    });
  };

  renderEditRedirect = () => {
    console.log('OrganizationActionTable-=-',this.props.orgId);
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/OrganizationAction",
            state: {
              orgId: this.props.orgId,
              actionid: this.state.actionid
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
      let removePath = "/api/action-organization-deactivate/" + id;
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          const data2 = this.state.OrganizationActions.filter(i => i.id !== id)
         this.setState({
          OrganizationActions:data2
          })
            
          this.setState({ msg: "Action deleted.", delLoader: 0, openSnackbar: true });
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


  addAction(actionid) {
    let apiPath = "";
    let successMessage = "";
    let method = "";
    let orgId = parseInt(getOrgId());
    let title = "NA";
    let description = "NA";
    let status="Open";
    let assigneeId=this.state.assigneeId;
    
    this.setState({
      delLoader: true
    })

    if (actionid > 0) {
      assigneeId=null;
      apiPath = "/api/action-organization/" + actionid;
      successMessage = "updated"
      method = "PUT";
    } else if(orgId > 0){
      apiPath = "/api/action-organization/" + orgId;
      successMessage = "Added"
      method = "POST";
    } else {
      this.setState({ openSnackbar: true,message: 'Something went wrong.'});
    }
    const data={
      title,
      description,
      status,
      assigneeId
    }

    fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then((response) => {
          console.log('response',response);
          if(response && response.success === true){
            this.setState({ openSnackbar: true,message: successMessage});
          }else{
            var mssgfale = response.message ? response.message : 'Something went wrong';
            this.setState({ openSnackbar: true,message: mssgfale,delLoader: false});
            return false;
          }

          this.fetchData(this.state.filterDate);

          setTimeout(() => {
            this.setState({
              delLoader: false
            });
          },3000);
        })
        .catch(err => {
          console.log('on OrganizationActions  error',err);
        });
       
  };

  renderFilter(){
    const { classes } = this.props;
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    return (
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">    
          <Grid item xs={12} md={10} className="dashboard-filter-menu">
                  <Card className={classes.card}>
                  <CardContent className="list-project-panellist">
                  <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                      >
                      <Grid xs={3} md={3} container direction="row" alignItems="center" justify="space-between">
                          <Select
                              value={this.state.assigneeId && this.state.assigneeId}
                              onChange={(event)=>this.setState({assigneeId: event.target.value})}
                              inputProps={{
                                name: "assigneeId",
                                id: "assigneeId"
                              }}
                            >
                              {this.state.persons && this.state.persons.map(person => {
                                return (
                                  person.disabled === 1 ? '' : <MenuItem key={person.id} value={person.id}>
                                    {person.fullName}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                        <Button variant="contained" color="primary" className={classes.secondary} onClick={()=>this.addAction(0)} >
                          Add
                        </Button>
                      </Grid>

                      <Grid xs={7} md={6} container direction="row" alignItems="center" justify="space-between">
                      
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectChips">Status</InputLabel>
                        <Select
                          multiple
                          value={this.state.status}
                          onChange={(event)=>this.setState({ status: event.target.value })}
                          input={<Input id="selectChips" />}
                          renderValue={selected => (
                            <div className={classes.chips}>
                              {selected.map(value =>
                                <Chip key={value} label={value} className={classes.chip} />
                              )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {statuses.map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Filter by status</FormHelperText>
                      </FormControl>

                      <FormControl className={classes.formControl}>
                        <TextField
                          id="date"
                          label="Date Added"
                          type="date"
                          defaultValue={this.state.filterDate}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) =>this.changeFilterDate(e)}
                        />
                        <FormHelperText>Filter by date</FormHelperText>
                        </FormControl>

                        <Button variant="contained" color="primary" className={classes.secondary} >
                          Update Results
                        </Button>
                      </Grid>
                  </Grid>
                        
                </CardContent>
                </Card>
                
          </Grid>
        </Grid>
    )
  }

  renderMemberList(divXs,divMd){
    const { classes } = this.props;
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    return (
      <Grid xs={divXs} md={divMd} alignItems="center" justify="center">

        <Card className={classes.card}>
          <CardContent className="list-project-panellist">


            <div className="padding25px">

              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={this.handleRequestSort}
                    showProject={this.state.fromOrganization}
                    rowCount={OrganizationActions.length}
                  />
                  <TableBody>
                    {stableSort(OrganizationActions, getSorting(order, orderBy))
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

                            <TableCell align="left" onClick={() => this.setEditRedirect(OrganizationAction.id)} className={classes.noTextDecoration} >
                              <Typography className={classes.heading}>{OrganizationAction.person && OrganizationAction.person.fullName}</Typography>
                            </TableCell>

                            <TableCell align="left" onClick={() => this.setEditRedirect(OrganizationAction.id)} className={classes.noTextDecoration}>
                              <Typography className={classes.heading}>{OrganizationAction.status}</Typography>
                            </TableCell>


                            <TableCell align="left" onClick={() => this.setEditRedirect(OrganizationAction.id)} className={classes.noTextDecoration}>
                              <Typography className={classes.heading}>{moment(OrganizationAction.createdAt).format("YYYY-MM-DD")}</Typography>
                            </TableCell>


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

                              <IconButton onClick={() => this.setEditRedirect(OrganizationAction.id)} >
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
                count={OrganizationActions.length}
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
          </CardContent></Card></Grid>
    )
  }


  renderMemberTaskDetail(divXs,divMd){
    const { classes } = this.props;
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    return (
      <Grid xs={divXs} md={divMd} alignItems="center" justify="center">

        <Card className={classes.card}>
          <CardContent className="list-project-panellist">
            <div className="padding25px">
              <OrganizationMemberAction />
            </div>
          </CardContent></Card></Grid>
    )
  }



  render() {
    const { classes } = this.props;
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    
    const { selectedMember } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/organizationactions"}/>
        <div className={classes.root}>
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
        <PageTitle pageTitle={"Regrouping"} />

        {this.renderFilter()}

         <div style={{height:20}}></div>

        {!selectedMember && this.renderMemberList(12,10)}

        {selectedMember && 
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">    
          <Grid item xs={12} md={10} className="dashboard-filter-menu">
          <Card className={classes.card}>
          <CardContent className="list-project-panellist">
          <Grid
              container
              direction="row"
              justify="space-between"
            >
            {this.renderMemberList(8,6)}
            {this.renderMemberTaskDetail(4,4)}
          </Grid>
          </CardContent>
          </Card>
          </Grid>
          </Grid>
        }
      </Grid>
      </div>

      <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
    </React.Fragment>
    );
  }
}

OrganizationActionTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrganizationActionTable);
