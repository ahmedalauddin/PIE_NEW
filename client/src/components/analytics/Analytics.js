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
import RestoreIcon from "@material-ui/icons/Restore";
import IconButton from "@material-ui/core/IconButton/index";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { getOrgName, getOrgId, checkPermision } from "../../redux";
import CheckIcon from "@material-ui/icons/Check";
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

import DatePicker from "react-datepicker";

import "../../stylesheets/react-datepicker.css";
import { Paper } from "@material-ui/core";



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



class Analytics extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    order: "asc",
    orderBy: "projectName",
    selectedCards:[],
    selected: [],
    ProjectActions: [],
    ProjectActionPersons: [],
    actionid: null,
    readyToEdit: false,
    fromOrganization: null,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    delLoader: 0,
    openStatus:0,
    newStatus:0,
    closedStatus:0

  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(selectedCardsParams){
    const orgId= getOrgId();
    const orgName= getOrgName();

    if(orgId>0){
      const { selectedCards } = selectedCardsParams?{selectedCards:selectedCardsParams} : this.state;

      const data={
        statusList:selectedCards,
        orgId
      }
      fetch(`/api/action-org`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(actionProjects => this.setState({ ProjectActions: actionProjects,orgName,orgId }));

      fetch(`/api/actions-count-org/${orgId}`)
      .then(res => res.json())
      .then(statusCount => {
        console.log("statusCount",statusCount);
        let openStatus=0;
        let newStatus=0;
        let closedStatus=0;
        statusCount.forEach(s=>{
          if(s.status=='Open'){
            openStatus=s.total;
          }else if(s.status=='New'){
            newStatus=s.total;
          }else if(s.status=='Closed'){
            closedStatus=s.total;
          }
        })

        this.setState({openStatus,newStatus,closedStatus})
      });
    }
  }

  



  toggleStatus(status){
    let { selectedCards } =this.state;

    if(selectedCards.indexOf(status)>-1){
      selectedCards=selectedCards.filter(s=>s!=status);
    }else{
      selectedCards.push(status);
    }
    this.setState({selectedCards})
    this.fetchData(selectedCards);
  }
  
  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
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

  renderFilter(){
    const { classes } = this.props;
    const { selectedCards , openStatus, newStatus, closedStatus} =this.state;
    return (
      <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
        <Grid item xs={12} md={10} className="dashboard-filter-menu" style={{margin:0,padding:0}} >
          <Card className={classes.card} style={{ overflow: "visible" }} style={{margin:0,padding:0}} >
            <CardContent className="list-project-panellist">
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                style={{margin:0,padding:0}}
              >
                <Grid item xs={3} sm={3} onClick={() => this.toggleStatus('Open')} >
                  <Paper className={classes.paper} >
                    <Grid container direction="row" justify="space-between">
                      <Typography className={classes.heading} style={{ alignSelf: "center" }}>Open({openStatus})</Typography>
                      <IconButton style={{ background: selectedCards.indexOf('Open') == -1 ? "#f0f0f0" : '#9fa2e3' }}>
                        <CheckIcon color="primary" style={{ color: selectedCards.indexOf('Open') == -1 ? "grey" : '#303f9f' }} />
                      </IconButton>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={3} sm={3} onClick={() => this.toggleStatus('New')}>
                  <Paper className={classes.paper}>
                    <Grid container direction="row" justify="space-between">
                      <Typography className={classes.heading} style={{ alignSelf: "center" }}>New({newStatus})</Typography>
                      <IconButton style={{ background: selectedCards.indexOf('New') == -1 ? "#f0f0f0" : '#9fa2e3' }}>
                        <CheckIcon color="primary" style={{ color: selectedCards.indexOf('New') == -1 ? "grey" : '#303f9f' }} />
                      </IconButton>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={3} sm={3} onClick={() => this.toggleStatus('Closed')}>
                  <Paper className={classes.paper}>
                    <Grid container direction="row" justify="space-between">
                      <Typography className={classes.heading} style={{ alignSelf: "center" }}>Closed({closedStatus})</Typography>
                      <IconButton style={{ background: selectedCards.indexOf('Closed') == -1 ? "#f0f0f0" : '#9fa2e3' }}>
                        <CheckIcon color="primary" style={{ color: selectedCards.indexOf('Closed') == -1 ? "grey" : '#303f9f' }} />
                      </IconButton>
                    </Grid>
                  </Paper>
                </Grid>


              </Grid>

            </CardContent>
          </Card>

        </Grid>
      </Grid>
    )
  }

  renderTable() {
    const { classes } = this.props;
    const { ProjectActions, ProjectActionPersons, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, ProjectActions.length - page * rowsPerPage);

    return (
      <>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={ProjectActions.length}
            />
            <TableBody>
              {stableSort(ProjectActions, getSorting(order, orderBy))
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
                      <TableCell align="left" >{ProjectAction.projectName}</TableCell>
                      <TableCell align="left" >{ProjectAction.title}</TableCell>
                      <TableCell align="left" >{ProjectAction.description}</TableCell>

                      <TableCell align="left" >{ProjectAction.personName} </TableCell>


                      <TableCell align="left"  >{ProjectAction.status} </TableCell>
                    
                      <TableCell align="left" style={{width: "6rem"}} >{moment(ProjectAction.createdAt).format("YYYY-MM-DD")}</TableCell>
                     
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
          count={ProjectActions.length}
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
      </>
    );
  }



  render() {
    const { classes } = this.props;
    const { orgName,orgId } =this.state;
    if(!orgId){
      return null;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/analytics"} />
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={orgName+" Action Tracker"} />

            {this.renderFilter()}

            <div style={{ height: 20 }}></div>

            <Grid xs={12} md={10} alignItems="center" justify="center">
              <Card className={classes.card}>
                <CardContent className="list-project-panellist">
                  {this.renderTable()}
                </CardContent></Card></Grid>

          </Grid>
        </div>


      </React.Fragment>
    );
  }
}



const rows = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "projectName", numeric: false, disablePadding: false, label: "Project" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "assignedto", numeric: false, disablePadding: false, label: "Assignee" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "created", numeric: false, disablePadding: false, label: "Date Added" }
 
];


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;
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


export default withStyles(styles)(Analytics);
