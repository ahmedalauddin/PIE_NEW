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
import { styles } from "./Styles";
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

import DatePicker from "react-datepicker";

import "../../stylesheets/react-datepicker.css";
import { Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { CircularProgressbar,buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
 
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


const defalutValueProjectFilter={ id:0,projectName: "All Project"};

const defalutValueDeptFilter={ id:0,deptName: "All Department"};

const monthes=[
  {id:0,name: "All"},
  {id:1, name:"January"},
  {id:2, name:"February"},
  {id:3, name:"March"},
  {id:4, name:"April"},
  {id:5, name:"May"},
  {id:6, name:"June"},
  {id:7, name:"July"},
  {id:8, name:"August"},
  {id:9, name:"September"},
  {id:10, name:"October"},
  {id:11, name:"November"},
  {id:12, name:"December"}   
];

function CustomeCircular(props) {
  return (
    <div style={{height:40,width:40}}>
    <CircularProgressbar styles={buildStyles({
      rotation: 0.25,
      strokeLinecap: 'butt',
      textSize: '28px',
      pathTransitionDuration: 0.5,
      pathColor: props.color || `#303f9f`,
      textColor: props.color || 'black',
      trailColor: '#d6d6d6',
      backgroundColor: props.color ||'#303f9f'
    })} 
    value={props.value} 
    
    text={props.label != undefined? `${props.label}` : `${Math.round(props.value)}%`} />
    </div>
  );
}

class Analytics extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    order: "asc",
    orderBy: "createdAt",
    selectedCards:[],
    selected: [],
    ProjectActions: [],
    actionid: null,
    readyToEdit: false,
    fromOrganization: null,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    delLoader: 0,
    openStatus:0,
    newStatus:0,
    closedStatus:0,
    orgName:"",
    orgId:0,
    projects:[defalutValueProjectFilter],
    depts:[defalutValueDeptFilter],
    projectId:0,
    deptId:0,
    msg:"",
    readyToEdit: false,
    actionid: 0,
    actionProjectId:0,
    selectedMonth:0,
    searchTxt:""

  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(){
    const orgId= getOrgId();
    const orgName= getOrgName();

    if(orgId>0){
     
      const data={
        orgId
      }
      fetch(`/api/action-org`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(actionProjects => {
        const projects =[defalutValueProjectFilter];
        const depts =[defalutValueDeptFilter];
        const _p={};
        const _d={};
        actionProjects.forEach(ap=>{
          _p[ap.projectId]=ap.projectName;
          if(ap.deptId){
            _d[ap.deptId]=ap.deptName;
          }
        })
        Object.keys(_p).forEach(k=>projects.push({ id:k,projectName: _p[k]}))
        Object.keys(_d).forEach(k=>depts.push({ id:k,deptName: _d[k]}))
        this.setState({ ProjectActions: actionProjects,orgName,orgId,projects,depts })
      });

    }
  }

  

  



  toggleStatus(status){
    let { selectedCards } =this.state;

    if(status =='Total'){
      selectedCards.splice(0,selectedCards.length);
    } else if(selectedCards.indexOf(status)>-1){
      selectedCards=selectedCards.filter(s=>s!=status);
    }else{
      selectedCards.push(status);
    }
    this.setState({selectedCards})
    //this.fetchData(selectedCards);
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

  renderFilter() {
    const { classes } = this.props;
    const {  depts, deptId, projects, projectId,selectedMonth } = this.state;
    return (
      
          <Card className={classes.card} style={{ overflow: "visible" }} style={{ margin: 0, padding: 0 }} >
            <CardContent className="list-project-panellist">
              <Grid
                container
                direction="row-reverse"
                justify="space-between"
                alignItems="center"
                style={{ margin: 0, padding: 0 }}
              >

                {/* <Grid item>
                  <FormControl className={classes.formControl}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.secondary}
                    >
                      Update Results
                    </Button>
                  </FormControl>
                </Grid> */}

                <Grid item>
                  <FormControl className={classes.formControl}>
                      <Select
                              style={{width:"20rem"}}
                              value={projectId}
                              onChange={(event)=>this.setState({projectId: event.target.value,page: 0})}
                              inputProps={{
                                name: "projectName",
                                id: "id"
                              }}
                            >
                              {projects.map(p => {
                                return (
                                  <MenuItem key={p.id} value={p.id}>
                                    {p.projectName}
                                  </MenuItem>
                                );
                              })}
                        </Select>

                    <FormHelperText>Filter by project</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item>
                  <FormControl className={classes.formControl}>
                      <Select
                              style={{width:"20rem"}}
                              value={deptId}
                              onChange={(event)=>this.setState({deptId: event.target.value,page: 0})}
                              inputProps={{
                                name: "deptName",
                                id: "id"
                              }}
                            >
                              {depts.map(d => {
                                return (
                                  <MenuItem key={d.id} value={d.id}>
                                    {d.deptName}
                                  </MenuItem>
                                );
                              })}
                        </Select>

                    <FormHelperText>Filter by department</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item>
                  <FormControl className={classes.formControl}>
                      <Select
                              style={{width:"20rem"}}
                              value={selectedMonth}
                              onChange={(event)=>this.setState({selectedMonth: event.target.value,page: 0,})}
                              inputProps={{
                                name: "name",
                                id: "id"
                              }}
                            >
                              {monthes.map(p => {
                                return (
                                  <MenuItem key={p.id} value={p.id}>
                                    {p.name}
                                  </MenuItem>
                                );
                              })}
                        </Select>

                    <FormHelperText>Filter by Month</FormHelperText>
                  </FormControl>
                </Grid>


              </Grid>
            </CardContent>
          </Card>

        
    )
  }

  getProjectActions(){
    const { ProjectActions,projectId,selectedCards,selectedMonth,searchTxt,deptId } = this.state;
    
    let temp=ProjectActions;
    if(projectId >0){
      temp=temp.filter(p=>p.projectId==projectId);
    }

    if(deptId > 0){
      temp=temp.filter(p=>p.deptId==deptId);
    }

    if(selectedMonth>0){
      temp=temp.filter(p=>Number(moment(p.createdAt).format("MM"))==selectedMonth);
    }

    if(searchTxt && searchTxt.trim()){
      temp=temp.filter(p=>JSON.stringify(p).toLowerCase().indexOf(searchTxt.trim().toLowerCase())>-1);
    }
    
    if(selectedCards.length>0 && selectedCards.indexOf('All')==-1){
      temp=temp.filter(p=>selectedCards.indexOf(p.status)>-1);
    }

    

    return temp;


  }

  getProjectActionsForStatus(){
    const { ProjectActions,projectId,selectedMonth,searchTxt,deptId  } = this.state;
    
    let temp=ProjectActions;
    if(projectId >0){
      temp=temp.filter(p=>p.projectId==projectId);
    }

    if(deptId > 0){
      temp=temp.filter(p=>p.deptId==deptId);
    }

    if(selectedMonth>0){
      temp=temp.filter(p=>Number(moment(p.createdAt).format("MM"))==selectedMonth);
    }

    if(searchTxt && searchTxt.trim()){
      temp=temp.filter(p=>JSON.stringify(p).toLowerCase().indexOf(searchTxt.trim().toLowerCase())>-1);
    }

    return temp;
  }

  setEditRedirect = (actionid,projectId) => {
    this.setState({
      readyToEdit: true,
      actionid: actionid,
      actionProjectId : projectId
    });
  };


  async deactivate(id) {
    if (id > 0) {
      // Deactivate a Action
      this.setState({
        delLoader: id
      })
      let removePath = "/api/action-project-deactivate/" + id;
      await fetch(removePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          const data2 = this.state.ProjectActions.filter(i => i.id !== id)
         this.setState({
            ProjectActions:data2
          })
            
          this.setState({ msg: "Action deleted.", delLoader: 0, openSnackbar: true });
        })
        .catch(err => {
          this.setState({ msg: "Error occurred.", delLoader: 0, openSnackbar: true });
        });
    }
  }

  renderStatusCount(){
    const { classes } = this.props;
    const ProjectActions=this.getProjectActionsForStatus();

    const { selectedCards,searchTxt } =this.state;

    let openStatus=0;
    let newStatus=0;
    let closedStatus=0;
    ProjectActions.forEach(s=>{
      if(s.status=='In Progress'){
        openStatus++;
      }else if(s.status=='New'){
        newStatus++;
      }else if(s.status=='Completed'){
        closedStatus++;
      }
    })

    return (

      <Grid
        xs={12} md={12}
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ margin: 0, padding: 0}}
      >
        
        <Grid item xs={2} sm={2} onClick={() => this.toggleStatus('Total')}  style={{paddingLeft:"0.5rem"}}>
          <Paper className={classes.paper} style={{backgroundColor:"#47C1BF",margin: 0,padding: "0.3rem"}}>
            <Grid container direction="row" justify="space-between">
              <Typography className={classes.heading} style={{ alignSelf: "center" }}>Total</Typography>
             

              <CustomeCircular  
                color={selectedCards.length>0 ? "white" : '#303f9f'}
                value={100}
                label={openStatus+newStatus+closedStatus}
                variant="static"
                />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={2} sm={2} onClick={() => this.toggleStatus('In Progress')} style={{paddingLeft:"0.5rem"}}>
          <Paper className={classes.paper} style={{backgroundColor:"#007ACE",margin: 0,padding: "0.3rem"}}>
            <Grid container direction="row" justify="space-between">
              <Typography className={classes.heading} style={{ alignSelf: "center" }}>In<span style={{color:"#007ACE"}} >a</span>Progress</Typography>
              
              
              <CustomeCircular  
                color={selectedCards.indexOf('In Progress') == -1 ? "white" : '#303f9f'}
                value={100}
                label={openStatus}
                variant="static"
                />

            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={2} sm={2} onClick={() => this.toggleStatus('New')} style={{paddingLeft:"0.5rem"}}>
          <Paper className={classes.paper} style={{backgroundColor:"#5C6AC4",margin: 0,padding: "0.3rem"}}>
            <Grid container direction="row" justify="space-between">
              <Typography className={classes.heading} style={{ alignSelf: "center" }}>New</Typography>
              

              <CustomeCircular  
                color={selectedCards.indexOf('New') == -1 ? "white" : '#303f9f'}
                value={100}
                label={newStatus}
                variant="static"
                />

            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={2} sm={2} onClick={() => this.toggleStatus('Completed')} style={{paddingLeft:"0.5rem"}}>
          <Paper className={classes.paper} style={{backgroundColor:"#50B83C",margin: 0,padding: "0.3rem"}}>
            <Grid container direction="row" justify="space-between">
              <Typography className={classes.heading} style={{ alignSelf: "center" }}>Completed</Typography>

              <CustomeCircular  
                color={selectedCards.indexOf('Completed') == -1 ? "white" : '#303f9f'}
                value={100}
                label={closedStatus}
                variant="static"
                />


            </Grid>
          </Paper>
        </Grid>

        <Grid xs={1} md={1}>
        </Grid>
        <Grid xs={3} md={3}>

        <TextField
              id="Search"
              label="Search"
              fullWidth
              onChange={(event)=>this.setState({searchTxt:event.target.value})}
              value={searchTxt}
              margin="normal"
            />
        </Grid>
      </Grid>

    )
  }

  
  renderTable() {
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    
    const ProjectActions=this.getProjectActions();

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, ProjectActions.length - page * rowsPerPage);

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
                      {/* <TableCell align="left" >{ProjectAction.projectName}</TableCell> */}
                      <TableCell align="left" className={classes.columntitle} >{ProjectAction.title}</TableCell>
                      <TableCell align="left" className={classes.columnendstatus}  >
                        
                        {ProjectAction.status} 
                        
                      </TableCell>
                      <TableCell align="left" className={classes.columnendpriority} >{ProjectAction.priority}</TableCell>

                      <TableCell align="left" className={classes.columnendPersonName} >
                              <ul style={{paddingLeft:15,margin:0}}>
                                      {
                                          ProjectAction.personName && ProjectAction.personName.split(",").map((p,key) => <li key={key} >{p.trim()}</li> )
                                      }
                                    </ul>
                        
                       
                        
                        </TableCell>


                    
                      <TableCell align="left" className={classes.columnendNormal} >{moment(ProjectAction.createdAt).format("YYYY-MM-DD")}</TableCell>

                      <TableCell align="left" className={classes.columnendNormal} >{ProjectAction.dueDate}</TableCell>

                      <TableCell align="left"  className={classes.columnendNormal}>
                      <CustomeCircular  
                        value={Number(ProjectAction.progress.substring(0,ProjectAction.progress.indexOf("%")))}
                        />

                      </TableCell>

                      <TableCell component="th" scope="row" padding="none" className={classes.columnendNormal}>

                      {checkPermision('Projects Additional Actions','delete') &&  <span>
                        {
                          this.state.delLoader != 0 && this.state.delLoader == ProjectAction.id ?
                            <CircularProgress />
                            :
                            <IconButton className={classes.columnendNormal}
                              onClick={() => {
                                this.deactivate(ProjectAction.id);
                              }}
                            >
                              <DeleteIcon color="primary" />
                            </IconButton>
                        }
                        </span>}

                        <IconButton 
                          onClick={() => {
                            this.setEditRedirect(ProjectAction.id,ProjectAction.projectId);
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
    const { orgName,orgId,readyToEdit,actionProjectId,actionid } =this.state;

    if (readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/ProjectAction",
            state: {
              projectId: actionProjectId,
              actionid: actionid,
              navFrom:'/analytics'
            }
          }}
        />
      );
    }
    
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/analytics"} />
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={orgName +" Action Tracker"} />
            <Grid xs={12} md={12} alignItems="center" justify="center" style={{marginLeft: 40,marginRight:40}}>
            {this.renderFilter()}
            </Grid>
            <div style={{ height: 20 }}></div>

            <Grid xs={12} md={12} alignItems="center" justify="center" style={{marginLeft: 40,marginRight:40}}>
              <Card className={classes.card}>
                <CardContent className="list-project-panellist">
                  
                  {this.renderStatusCount()}
                  {this.renderTable()}

                  {checkPermision('Projects Additional Actions', 'write') &&
                        <Fab  color="primary" aria-label="Add" onClick={()=> this.setState({readyToEdit:true})} className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      }
                </CardContent></Card></Grid>

          </Grid>
        </div>

        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.msg}</span>}
        />


      </React.Fragment>
    );
  }
}



const rows = [
  // { id: "edit", numeric: false, disablePadding: false, label: "" },
  // { id: "projectName", numeric: false, disablePadding: false, label: "Project" },
  { id: "title", numeric: false, disablePadding: false, label: "Action Item" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "priority", numeric: false, disablePadding: false, label: "Priority" },
  { id: "personName", numeric: false, disablePadding: false, label: "Assignee" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Created On" },
  { id: "dueDate", numeric: false, disablePadding: false, label: "Due Date" },
  { id: "progress", numeric: false, disablePadding: false, label: "Progress" },
  { id: "actions", numeric: false, disablePadding: false, label: "Action" }
 
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
                padding={"none"}
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
