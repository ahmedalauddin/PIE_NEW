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
import { getOrgName, getOrgId,isCustomerAdmin } from "../../redux";
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
import Checkbox from "@material-ui/core/Checkbox";
import DatePicker from "react-datepicker";

import "../../stylesheets/react-datepicker.css";
 
const rows = [
  { id: "acl", numeric: false, disablePadding: false, label: "Permission",align:"left",width:300 },
  { id: "read", numeric: false, disablePadding: false, label: "Read",align:"left",width:100 },
  { id: "write", numeric: false, disablePadding: false, label: "Write",align:"left",width:100 },
  { id: "modify", numeric: false, disablePadding: false, label: "Modify", align:"left",width:100},
   { id: "delete", numeric: false, disablePadding: false, label: "Delete" ,align:"left",width:100}
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

class RoleManagment extends React.Component {
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
    role: "Select role",
    roles:[ 'Select role'],
    acls : [
            'Dashboard',
            'Dashboard Expand Projects',
            'Projects', 
            'Projects KPIs',
            'Projects People',
            'Projects Milestones',
            'Projects Additional Actions',
            'Projects Documents',            
            'Mind Map',
            'Mind Map KPI',
            'Mind Map Prioritized KPI',
            'Regrouping',
            'Search',
            'Analytics',
            'Organization',
            'Organization Department',
            'Organization KPI',
            'Organization People'
            ],
    roleAcls:{}
      
  };

  // roleAcl[acl]["read"]=true;
  // roleAcl[acl]["write"]=true;
  // roleAcl[acl]["modify"]=true;
  // roleAcl[acl]["delete"]=true;

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  componentDidMount(){
    this.fetchData();
  }


  fetchData(){
    let orgId = parseInt(getOrgId());
   
    fetch(`/api/auth/role/${orgId}`)
    .then(res => res.json())
    .then(response => {
      if(response && response.length>0 && response[0].jsonData){
        this.setState({roleAcls:response[0].jsonData})
      }
    });

    fetch("/api/auth/roletypes/" + orgId)
    .then(results => results.json())
    .then(response => {
      const roles=['Select role'];
      if(response){
        response.forEach((r)=>roles.push(r.description))
      }
      this.setState({ roles})
    });

  }

 


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  saveAcl() {
    const { roleAcls } =this.state;

    let apiPath = "/api/auth/role";
    let successMessage = "updated";
    let method =  "POST";
    let orgId = parseInt(getOrgId());
    
    this.setState({
      delLoader: true
    })
 
    const data={
      orgId,
      roleAcls:JSON.stringify(roleAcls)
    }

    fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then((response) => {
            console.log('response',response);
            this.setState({ openSnackbar: true,message: successMessage});

          setTimeout(() => {
            this.setState({
              delLoader: false
            });
          },3000);
        })
        .catch(err => {
          console.log('on saveAcl  error',err);
        });
       
  };

  changeRole(role){
    this.setState({role})
  }
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
                      <Grid xs={3} md={3} container direction="row" alignItems="center" justify="flex-start">
                          <Select
                              style={{width:400}}
                              value={this.state.role}
                              onChange={(event)=>this.changeRole(event.target.value)}
                            
                            >
                              {this.state.roles.map((r,index) => {
                                return (
                                  <MenuItem key={index} value={r}>
                                    {r}
                                  </MenuItem>
                                );
                          })}
                        </Select>
                        
                      </Grid>
                      <Button style={{marginLeft:10}} variant="contained" color="primary" className={classes.secondary} onClick={()=>this.saveAcl()} >
                          Save
                      </Button>
                    
                  </Grid>
                        
                </CardContent>
                </Card>
                
          </Grid>
        </Grid>
    )
  }

  isChecked(permission,acl){
    const { roleAcls,role } = this.state;
    if(!roleAcls[role]){
      roleAcls[role]={}
    }
    const roleAcl=roleAcls[role];

    let _permission=true;
    
    if(roleAcl[acl]){
      _permission=roleAcl[acl][permission] == true;
    }
    return _permission;
  }

  togglePermission(permission,acl){
    const { roleAcls,role } = this.state;
    if(!roleAcls[role]){
      roleAcls[role]={}
    }
    const roleAcl=roleAcls[role];

    if(!roleAcl[acl]){
      roleAcl[acl]={};
      roleAcl[acl]["read"]=true;
      roleAcl[acl]["write"]=true;
      roleAcl[acl]["modify"]=true;
      roleAcl[acl]["delete"]=true;
      roleAcl[acl][permission]=false;
    }else{
      roleAcl[acl][permission]=!roleAcl[acl][permission]
    }
    this.setState({roleAcls});
  }

  rendeAcls(divXs,divMd){
    const { classes } = this.props;
    const { acls, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, acls.length - page * rowsPerPage);
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
                    rowCount={acls.length}
                  />
                  {this.state.role !== 'Select role' && <TableBody>
                    {stableSort(acls, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(acl => {
                        const isSelected = this.isSelected(acl);
                        return (
                          <TableRow
                            hover
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={acl}
                            selected={isSelected}
                            className="testingclass"
                          >

                            <TableCell style={{width:300}}  align="left"  className={classes.noTextDecoration} >
                              <Typography className={classes.heading}>{acl}</Typography>
                            </TableCell>

                            <TableCell style={{width:100}} align="left" className={classes.noTextDecoration}>
                                  <Checkbox
                                    key={"read" + acl}
                                    checked={this.isChecked("read",acl)}
                                    tabIndex={-1}
                                    onChange={()=>this.togglePermission("read",acl)}
                                  />
                            </TableCell>

                            
                            <TableCell style={{width:100}} align="left" className={classes.noTextDecoration}>
                                  <Checkbox
                                    key={"write" + acl}
                                    checked={this.isChecked("write",acl)}
                                    tabIndex={-1}
                                    onChange={()=>this.togglePermission("write",acl)}
                                  />
                            </TableCell>

                            
                            <TableCell style={{width:100}} align="left" className={classes.noTextDecoration}>
                                <Checkbox
                                    key={"modify" + acl}
                                    checked={this.isChecked("modify",acl)}
                                    tabIndex={-1}
                                    onChange={()=>this.togglePermission("modify",acl)}
                                  />
                            </TableCell>

                            
                            <TableCell style={{width:100}} align="left" className={classes.noTextDecoration}>
                                  <Checkbox
                                    key={"delete" + acl}
                                    checked={this.isChecked("delete",acl)}
                                    tabIndex={-1}
                                    onChange={()=>this.togglePermission("delete",acl)}
                                  />
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
                  }
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={acls.length}
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
        <Topbar currentPath={"/rolemgt"}/>
        <div className={classes.root}>
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
        <PageTitle pageTitle={"Role Managment"} />

        {this.renderFilter()}

        <div style={{height:20}}></div>

        { this.rendeAcls(12,10)}

        
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

RoleManagment.propTypes = {
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

    if(!isCustomerAdmin()){
      return null
    }

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
                
                     <Typography className={this.newstyles.heading}>
                     {row.label}
                    </Typography>
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

export default withStyles(styles)(RoleManagment);
