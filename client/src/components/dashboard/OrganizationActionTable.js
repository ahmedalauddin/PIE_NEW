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
import CheckIcon from "@material-ui/icons/Check";
import IconButton from "@material-ui/core/IconButton/index";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { getOrgName, getOrgId, checkPermision } from "../../redux";
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

import DatePicker from "react-datepicker";

import "../../stylesheets/react-datepicker.css";
 
const rows = [
  { id: "assignedto", numeric: false, disablePadding: false, label: "Members",align:"left",width:"20%" },
  { id: "description", numeric: false, disablePadding: false, label: "Focus Area",align:"left",width:"40%" },
  { id: "dateadded", numeric: false, disablePadding: false, label: "Date Added", align:"left",width:"20%"},
   { id: "actions", numeric: false, disablePadding: false, label: "Actions" ,align:"left",width:"20%"}
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


const selectDefaultValue={ id:-1,fullName: "Select Member"};

class OrganizationActionTable extends React.Component {
  constructor(props) {
    super(props);
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
    filterDate: new Date(),
    assigneeId: -1,
    persons: [],
    status: [],
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    selectedMember:false,
    orgId:0,
    highlightDates:[],
    readyToCreateProjectAction: false,
    OrganizationAction:null,
    actionItem:null
  };

  getDateFromString(dateString){
   try{ const tokens=dateString.split("-");
    const y=Number(tokens[0]);
    const m=Number(tokens[1])-1;
    const d=Number(tokens[2].substring(0,2));
    return new Date(y,m,d);
    }catch(e){
      console.log(e);
      return new Date();
    }
  }
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.dateAdded){
      this.setState({filterDate:null})
      setTimeout(()=>{
        this.fetchData(this.getDateFromString(this.props.location.state.dateAdded));
      },100)
    }else{
      this.fetchData();
    }
  }
  changeFilterDate(e){
    //console.log("changedDate...............",e.target.value );
   //this.fetchData(e.target.value);

   this.fetchData(e);
  }

  fetchData(filterDate){
    if(!filterDate){
      filterDate=new Date();
    }

    const persons=[];
    persons.push(selectDefaultValue);

    let orgId = parseInt(getOrgId());

    this.setState({persons,filterDate,orgId});

    
    let uri=`/api/action-organization/${orgId}/${moment(filterDate).format("YYYY-MM-DD")}`;
   
    fetch(uri)
    .then(res => res.json())
    .then(OrganizationActions => {
      this.setState({
        OrganizationActions: OrganizationActions,
        fromOrganization: false,
        filterDate,
        assigneeId:-1
      });

      this.fetchPersons(orgId,OrganizationActions);

    });

    
    console.log("this.dateInput--->",this.dateInput);
    
  }

  fetchPersons(orgId,OrganizationActions){
    fetch(`/api/organization-action-persons/${orgId}`)
    .then(res => res.json())
    .then(response => {
     const _persons=[];
     _persons.push(selectDefaultValue);
     
     if(OrganizationActions){
      OrganizationActions.forEach((OrganizationAction)=>{
          if(OrganizationAction.person && OrganizationAction.person.id){
            for(let i=0;i<response.length;i++){
              if (response[i].id===OrganizationAction.person.id) { 
                response.splice(i, 1);
                break;
              } 
            }
            
          }
      })
     }
     this.setState({persons:_persons.concat(response)});
     this.meetingsDays();
    });
  }

  fetchLastData(assigneeId,actionId){
    fetch(`/api/copy-action-organization/${this.state.orgId}/${assigneeId}/${actionId}`)
    .then(res => res.json())
    .then(response => {
      console.log("response",response);
      this.fetchData(this.state.filterDate);
    });
  }
  setEditRedirect = actionid => {
    this.setState({
      readyToEdit: true,
      actionid: actionid,
    });
    
  };

  meetingsDays(){
    fetch(`/api/action-organization-meeting-days/${this.state.orgId}`)
    .then(res => res.json())
    .then(response => {
     
      const highlightDates=[];
      response.forEach((data)=>{
        highlightDates.push(this.getDateFromString(data.dateAdded));
      })
      this.setState({highlightDates});
    });
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/OrganizationAction",
            state: {
              orgId: this.state.orgId,
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
            
          this.setState({ message: "deleted.", delLoader: 0, openSnackbar: true });
          this.fetchData(this.state.filterDate);
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
    let title = "";
    let description = "";
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
      assigneeId,
      dateAdded:moment(this.state.filterDate).format("YYYY-MM-DD")
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
                  <Card className={classes.card} style={{overflow:"visible"}}>
                  <CardContent className="list-project-panellist">
                  <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                      >
                      <Grid xs={6} md={6} container direction="row" alignItems="center" justify="flex-start">
                      {checkPermision('Regrouping','write') &&
                          <>
                          <Select
                              style={{width:200}}
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
                        
                        <Button style={{marginLeft:10}} variant="contained" color="primary" className={classes.secondary} onClick={()=>this.addAction(0)} >
                          Add
                        </Button>
                        </>}

                      </Grid>

                      {this.state.filterDate && <FormControl className={classes.formControl}>
                        {/* <TextField
                          id="date"
                          label=""
                          type="date"
                          defaultValue={this.state.filterDate}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) =>this.changeFilterDate(e)}

                          inputRef={(el)=>this.dateInput=el}
                        /> */}
                        <DatePicker
                          className={classes.dataPickerInput}
                          selected={this.state.filterDate}
                          onChange={(e) =>this.changeFilterDate(e)}
                          highlightDates={this.state.highlightDates}
                        />
                        <FormHelperText>Filter by date</FormHelperText>
                      </FormControl>
                      }
                  </Grid>
                        
                </CardContent>
                </Card>
                
          </Grid>
        </Grid>
    )
  }

  rendorAction(i, key, OrganizationAction) {
    const { classes } = this.props;
    const projectActions=OrganizationAction.projectActions || [];
    if(projectActions.indexOf(i.trim())==-1){
      return (
        <Typography key={key} className={classes.secondaryHeadingLink} style={{ marginBottom: "1rem" }} 
            onClick={() => this.setState({ readyToCreateProjectAction: true, OrganizationAction,actionItem:i.trim()})}>
          {i.trim()}
        </Typography>
      )
    }else {
      return (
        <Typography key={key}  style={{ marginBottom: "1rem" }}  >
          {i.trim()}
          <IconButton  >
            <CheckIcon color="primary" />
          </IconButton>
        </Typography>
      )
    }
  }
  renderMemberList(divXs,divMd){
    const { classes } = this.props;
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    return (
      <Grid xs={divXs} md={divMd} alignItems="center" justify="center">

        <Card className={classes.card}>
          <CardContent className="list-project-panellist">

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

                            <TableCell style={{width:"20%"}}  align="left"  className={classes.noTextDecoration} >
                              <Typography className={classes.heading}>{OrganizationAction.person && OrganizationAction.person.fullName}</Typography>
                            </TableCell>

                            <TableCell style={{width:"40%"}} align="left" className={classes.noTextDecoration}>
                              <Typography style={{width:"90%"}} className={classes.heading}>
                                {OrganizationAction.description 
                                    && OrganizationAction.description.split("\n").map((i,key) =>this.rendorAction(i,key,OrganizationAction))}
                                </Typography>
                            </TableCell>


                            <TableCell  style={{width:"20%"}} align="left" className={classes.noTextDecoration}>
                              <Typography className={classes.heading}>{OrganizationAction.dateAdded}</Typography>
                            </TableCell>


                            <TableCell  style={{width:"20%"}} align="left" component="th" scope="row" padding="none">
                            {checkPermision('Regrouping','delete') &&<>{
                                this.state.delLoader != 0 && this.state.delLoader == OrganizationAction.id ?
                                  <CircularProgress />
                                  :
                                  <IconButton onClick={() =>  this.deactivate(OrganizationAction.id) } >
                                    <DeleteIcon color="primary" />
                                  </IconButton>
                              }
                              </>}

                              {checkPermision('Regrouping','modify') &&<>
                              <IconButton onClick={() => this.setEditRedirect(OrganizationAction.id)} >
                                <EditIcon color="primary" />
                              </IconButton>

                              {!OrganizationAction.description &&
                                <IconButton onClick={() => this.fetchLastData(OrganizationAction.person.id,OrganizationAction.id)} >
                                  <RestoreIcon color="primary" />
                                </IconButton>
                              }
                              </>}
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
    const { OrganizationActions, order, orderBy, selected, rowsPerPage, page,readyToCreateProjectAction,OrganizationAction,actionItem } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, OrganizationActions.length - page * rowsPerPage);
    
    const { selectedMember } = this.state;

    if(readyToCreateProjectAction){
      return (
        <Redirect
          to={{
            pathname: "/ProjectAction",
            state: {
              OrganizationAction,
              actionItem,
              navFrom:'/organizationactions'
            }
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/organizationactions"}/>
        <div className={classes.root}>
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
        <PageTitle pageTitle={"Regrouping"} />

        {this.renderFilter()}

        <div style={{height:20}}></div>

        {this.renderMemberList(12,10)}

        
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
         {this.renderEditRedirect()}
    </React.Fragment>
    );
  }
}

OrganizationActionTable.propTypes = {
  classes: PropTypes.object.isRequired
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

export default withStyles(styles)(OrganizationActionTable);
