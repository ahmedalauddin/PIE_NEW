import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName, getOrgDepartments, checkPermision, getUser } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import PageTitle from "../PageTitle";
import moment from "moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
const profileLogo = require("../../images/profile.png");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
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
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  },
  taskCommentDivScrollView: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
    height:"30rem",
    minWidth:540,
    overflow: "auto",
    marginTop: "2rem",
    padding: 2
  },
  profileLogo: {
    width: 40,
    height: 40,
    marginRight: 10
  }
});

const defalutPorjectValue=[ {id:0,title: "Select Project"}];
const progressList=['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%']
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

class ProjectAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
   this.fetchPersons = this.fetchPersons.bind(this);
   
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
  
  }

  state = {
    title: "",
    description: "",
    projectId: 0,
    assigneeId: null,
    status: 'New',
    project: {},
    persons: [],
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    delLoader:false,
    comments:[],
    comment:"",
    expanded:false,
    dueDate:"",
    dateAdded:null,
    projects:null,
    progress:"0%",
    assigneeIds:[]
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };


  toSentenceCase(string) {
    var sentence = string.split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  }

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  async handleSubmit(event,comment) {
    event.preventDefault();
    
    let OrganizationAction=this.props.location.state.OrganizationAction
    let actionItem=this.props.location.state.actionItem;
   
    const projectId = this.state.projectId || this.props.location.state.projectId;
    const actionid = this.props.location.state.actionid;
    let apiPath = "";
    let successMessage = "";
    let method = "";

    var title = this.state.title;
    var description = this.state.description;
   
    if(title == undefined || title == ''){
      
      this.setState({ openSnackbar: true,message: "Please Check Required Fields.",});
      return false;
    }

    if(!projectId){
      this.setState({ openSnackbar: true,message: "Please Check Required Fields.",});
      return false;
    }

    this.setState({
      delLoader: true
    })

    if(comment && comment.trim()){
      this.state.comments.unshift({
        personName:this.toSentenceCase(getUser().fullName),
        comment:comment.trim(),
        commentDate:new Date()
      })
    }
    if (actionid > 0) {
      // For updates
      apiPath = "/api/action-project/" + actionid;
      successMessage = "Action '" + this.state.title + "' updated."
      method = "PUT";
    } else if(projectId > 0){
      // For create
      apiPath = "/api/action-project/" + projectId;
      successMessage = "Action '" + this.state.title + "' created."
      method = "POST";
    } else {
      this.setState({ openSnackbar: true,message: 'Something went wrong.'});
    }
    console.log('json--- on ProjectActions -- ',this.state );

    fetch(apiPath, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
    .then(response => response.json())
    .then(async (response) => {
      if (response && response.success === true) {
          const state={ openSnackbar: true, message: response.message, delLoader: false }
          if(comment && comment.trim() ){
            state['comment']='';
          } 
          this.setState(state);

          if(OrganizationAction){
            OrganizationAction.projectActions=!OrganizationAction.projectActions?[]:OrganizationAction.projectActions;
            OrganizationAction.projectActions.push(actionItem);
            await fetch("/api/action-organization/" + OrganizationAction.id, {
              method: "PUT",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(OrganizationAction)
            })
          }

          if(!actionid){
            setTimeout(()=>this.moveToBack(),2000);
          }
      } else {
          var mssgfale = response.message ? response.message : 'Something went wrong';
          this.setState({ openSnackbar: true, message: mssgfale, delLoader: false });
          return false;
      }
      })
      .catch(err => {
        console.log('on ProjectActions  error', err);
      });
  };

  moveToBack() {
    this.setState({           
      readyToRedirect: true,
      redirectIdOrgOrProject: this.state.projectId,
      delLoader: false
    });
  }

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });
  };

  fetchPersons = (projectId) => {
    if (parseInt(projectId) > 0) { 
      fetch(`/api/project-action-persons/${projectId}`)
        .then(res => res.json())
        .then(response => {
        
         this.setState({
          persons: response
        });
        });
    }
  };

  fetchProjects = () => {
    let orgId = getOrgId();
    if (parseInt(orgId) > 0) { 
      console.log()
      fetch(`/api/orgnization-projects/${orgId}`)
        .then(res => res.json())
        .then(response => {
          const projects=defalutPorjectValue.concat(response);
          console.log('projects--',projects);

          this.setState({projects});
        });
    }
  };

  

  componentDidMount() {
    
    this.setOrganizationInfo();
   
    let actionid = this.props.location.state.actionid && this.props.location.state.actionid;
    let projectId = this.props.location.state.projectId;

    let OrganizationAction=this.props.location.state.OrganizationAction
    let actionItem=this.props.location.state.actionItem;

    this.fetchPersons(projectId);
    if (parseInt(actionid) > 0) {
      fetch(`/api/action-project-id/${actionid}`)
        .then(res => res.json())
        .then(action => {
          const assigneeIds = [];
          action.assigneeIds && action.assigneeIds.forEach(a=>assigneeIds.push(a.id));

          this.setState({
            id: actionid,
            title: action.title,
            description: action.description,
            assigneeId: action.assigneeId,
            status: action.status,
            priority: action.priority,
            projectName: action.project && action.project.title,
            projectId: projectId,
            buttonText: "Update",
            redirectTarget: "/project",
            comments:action.comments?action.comments:[],
            dueDate:action.dueDate,
            progress:action.progress,
            assigneeIds  
          });
        });
    } else if(OrganizationAction && actionItem){
      const actionItemData=actionItem.substring(actionItem.indexOf('.')+1);
      this.setState({
        isEditing: true,
        title:actionItemData,
        buttonText: "Create",
        assigneeId:OrganizationAction.assigneeId,
        dateAdded:OrganizationAction.dateAdded
      });
    }else {
      this.setState({
        isEditing: true,
        projectId: projectId,
        buttonText: "Create"
      });
    }

    if(!projectId){
      this.fetchProjects();
    }

  }

  getPersonName(id){
    const {persons} =this.state;
    const p=persons.find(pp=>pp.id==id);

    return (p && p.fullName) || "";
  }

  renderDetail() {
    const { classes } = this.props;
    const { tags, suggestions,projects,projectId,projectName,assigneeIds } = this.state;
    const OrganizationAction=this.props.location.state.OrganizationAction;
console.log("assigneeIds",assigneeIds);
    return (

      <Grid container justify="space-between" direction="row" >
        
          <Grid item xs={7} sm={7} style={{padding:"1rem"}}>
            <TextField
              required
              id="title-required"
              style={{ margin: 0 }}
              label="Action Item"
              fullWidth
              onChange={this.handleChange("title")}
              value={this.state.title}
              
            />
          </Grid>

          <Grid item xs={5} sm={5} style={{padding:"1rem"}}>
            <FormControl className={classes.formControl} style={{width:"60%"}}>
              <InputLabel shrink htmlFor="progress">Progress</InputLabel>
              <Select
                value={this.state.progress}
                onChange={(event) => this.setState({ progress: event.target.value })}
                inputProps={{
                  name: "progress",
                  id: "progress"
                }}
              >
                {progressList.map(p=> <MenuItem key={p} value={p}>{p}</MenuItem>)}
                
               
                

              </Select>
            </FormControl>
          </Grid>

          


          <Grid item xs={7} sm={7} style={{padding:"1rem"}}>
            <TextField
              id="description"
              label="Description"
              style={{ margin: 0 }}
              multiline
              rowsMax="6"
              value={this.state.description}
              onChange={this.handleChange("description")}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

          <Grid item xs={5} sm={5} style={{padding:"1rem"}}>
            <FormControl className={classes.formControl} style={{width:"60%"}} >
              <InputLabel shrink htmlFor="Status">Status</InputLabel>
              <Select
                value={this.state.status && this.state.status}
                onChange={(event) => this.setState({ status: event.target.value })}
                inputProps={{
                  name: "status",
                  id: "status"
                }}
              >
                <MenuItem key='New' value='New'> New </MenuItem>
                <MenuItem key='In Progress' value='In Progress'> In Progress </MenuItem>
                <MenuItem key='On Hold' value='On Hold'> On Hold </MenuItem>
                <MenuItem key='Cancelled' value='Cancelled'> Cancelled </MenuItem>
                <MenuItem key='Completed' value='Completed'> Completed </MenuItem>

              </Select>
            </FormControl>
          </Grid>


          <Grid container  direction="row" xs={7} sm={7} style={{padding:"1rem"}}>
            {!projectName && Array.isArray(projects) && <FormControl className={classes.formControl} style={{width:"100%"}} >
                <InputLabel shrink htmlFor="Projects" required>Projects</InputLabel>
                <Select
                  value={projectId}
                  onChange={(event)=>{this.setState({projectId: event.target.value});this.fetchPersons(event.target.value)}}
                  inputProps={{
                    name: "projectId",
                    id: "projectId"
                  }}
                >
                  {projects.map(project => {
                    return (
                      <MenuItem key={project.id} value={project.id}>
                        {project.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>}
              {projectName && 
                <TextField
                  id="title-required"
                  style={{ margin: 0 }}
                  label="Project"
                  fullWidth
                  contentEditable={false}
                  value={projectName}
                  
                />
              }
          </Grid>

          <Grid item xs={5} sm={5} style={{padding:"1rem"}}>
            <FormControl className={classes.formControl} style={{width:"60%"}}>
              <InputLabel shrink htmlFor="priority">Priority</InputLabel>
              <Select
                value={this.state.priority && this.state.priority}
                onChange={(event) => this.setState({ priority: event.target.value })}
                inputProps={{
                  name: "priority",
                  id: "priority"
                }}
              >
                <MenuItem key='High' value='High'>
                  High
                          </MenuItem>
                <MenuItem key='Medium' value='Medium'>
                  Medium
                          </MenuItem>
                <MenuItem key='Low' value='Low'>
                  Low
                              </MenuItem>

              </Select>
            </FormControl>
          </Grid>


         

          <Grid item xs={7} sm={7} style={{padding:"1rem"}}>
            <FormControl className={classes.formControl} style={{width:"100%"}} >
              <InputLabel shrink htmlFor="assigneeId">Assignee</InputLabel>
              <Select
                multiple
                value={assigneeIds}
                input={<Input id="assigneeId" />}
                onChange={(event)=>this.setState({assigneeIds: event.target.value})}
               

                renderValue={assigneeIds => (
                  <div className={classes.chips}>
                    {assigneeIds.map((id) =>
                     
                      <Chip key={id} 
                      label={this.getPersonName(id)} 
                      className={classes.chip} />
                    )}
                  </div>
                )}

                MenuProps={MenuProps}
              >
                {this.state.persons && this.state.persons.map(person => {
                  return (
                    <MenuItem key={person.id} value={person.id}>
                      {person.fullName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={5} sm={5} style={{padding:"1rem"}}>
              <TextField
               style={{width:"60%",margin:0,padding:0}}
                required
                  id="dueDate"
                  label="Due Date"
                  type="date"
                  value={this.state.dueDate}
                  onChange={(event)=>this.setState({dueDate: event.target.value})}
                  className={classes.textFieldWide}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
          </Grid>

          <Grid container  direction="row" xs={7} sm={7} style={{padding:"1rem"}} >
            {checkPermision('Projects Additional Actions', 'modify') &&
              <Typography component="p">
                {
                  this.state.delLoader ?
                    <CircularProgress /> :
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(event)=>this.handleSubmit(event)}
                      className={classes.secondary}
                    >
                      {this.state.buttonText}
                    </Button>
                }
              </Typography>
            }
                <Typography component="p" style={{marginLeft:"1rem"}}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={()=>this.moveToBack()}
                      className={classes.secondary}
                    >
                      {"Back"}
                    </Button>
                    </Typography>
           
          </Grid>

          {/* <Grid item xs={12} sm={12} >
            <TextField
              id="comment"
              label="Enter Comment"
              style={{ margin: 0 }}
              multiline
              rowsMax="6"
              value={this.state.comment}
              onChange={this.handleChange("comment")}
              className={classes.textFieldWide}
              fullWidth
              
            />
          </Grid> */}
 
          
      </Grid>

    )
  }
  renderComment(cc, index) {
    const { classes } = this.props;
    return (
      <div style={{padding:10, 
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 1,
        borderBottomColor: "black",
        borderBottomWidth: "1px",
        borderStyle:"solid"
        }}>
        <Grid container style={{ minWidth:520 }} direction="row" justify="space-between" alignItems="flex-end" className="dash">

          <Grid container sm={12} xs={12} direction="row" >
            <img src={profileLogo} alt="" className={classes.profileLogo} />

            <Grid item sm={8} xs={8}  >
            
              <Grid container sm={12} xs={12} direction="row" >
                <Typography variant="h7" color="primary" gutterBottom >
                  {cc.personName}
                </Typography>
                <Typography style={{marginLeft:20}}  color="primary" gutterBottom >
                  {moment(new Date(cc.commentDate)).format("YYYY-MM-DD hh:mm:ss")}
                </Typography>
              </Grid>

              <Grid container sm={12} xs={12} direction="row" >
                <Typography gutterBottom>
                  {cc.comment}
                </Typography>
              </Grid>
            </Grid>

          </Grid>
          
        </Grid>
        
      </div>
    )
  }

  renderEnterComment() {
    const { classes } = this.props;
    const { comment } = this.state
    return (
          <Grid container direction="row" justify="space-between" alignItems="center" className="dash">

          <Grid item sm={10} xs={10}  >
            <TextField
              id="comment"
              label="Enter Comment"
              multiline
              className={classes.textFieldWide}
              value={comment}
              onChange={(event) => this.setState({ comment: event.target.value })}
              style={{ width: "100%" }}
              margin="normal"
            />
          </Grid>
          <Typography component="p">
            {
              this.state.delLoader ?
                <CircularProgress /> :
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.secondary}
                  onClick={(event)=>this.handleSubmit(event,comment)}
                >
                  Post Comment
                  </Button>
            }
          </Typography>
        </Grid>
    )
  }
  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    const currentPath=this.props.location.state.navFrom || '/paneldashboard'
    var redirectTarget = this.props.location.state.navFrom || "/project/";
    const actionid = this.props.location.state.actionid;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `${redirectTarget}`,
        state: {
          message: `${this.state.message}`,
          projId: this.state.redirectIdOrgOrProject,
          projectId:this.state.redirectIdOrgOrProject,
          dateAdded:this.state.dateAdded
          
        }
      }} />;
    }



    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={"Action Detail"} />
            <Grid item sm={10} >
              <Paper className={classes.paper} >
                <form onSubmit={(event)=>this.handleSubmit(event)} noValidate>
                      {this.renderDetail()} 
                </form>
              </Paper>

              {actionid>0 &&
              <ExpansionPanel expanded={expanded} onChange={() => this.setState({ expanded: !expanded })} style={{marginTop:"1rem"}}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Action Comments</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={12}>
                        {this.renderEnterComment()}
                        <div className={classes.taskCommentDivScrollView}  >
                          {this.state.comments.map((cc, index) => this.renderComment(cc, index))}
                        </div>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
                }

            </Grid>
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

export default withStyles(styles)(ProjectAction);
