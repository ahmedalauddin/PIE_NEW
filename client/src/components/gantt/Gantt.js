import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { getOrgId,getUser, checkPermision } from "../../redux";
import Button from "@material-ui/core/Button";
import { styles } from "../styles/ProjectStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton/index";
import DeleteIcon from "@material-ui/icons/Delete";

const profileLogo = require("../../images/profile.png");

gantt.plugins({ 
  critical_path: true 
}); 
function monthScaleTemplate(date){
  let dateToStr = gantt.date.date_to_str("%M");
  let endDate = gantt.date.add(date, 3, "month");
  return "QTR " + dateToStr(date) + " - " + dateToStr(endDate);
};

class Gantt extends React.Component {
  constructor(props) {
    super(props);
    this.setZoom = this.setZoom.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.initGanttDataProcessor = this.initGanttDataProcessor.bind(this);
    this.handleSave = this.handleSave.bind(this);
    // this.getPersonsAssigned = this.getPersonsAssigned.bind(this);
    this.renderGantt = this.renderGantt.bind(this);
    this.state = {
      project: {},
      projectId: undefined,
      scale: 'Quarters',
      assignedMenuItems: [],
      persons: [],
      tasks: null,
      isNewGantt: undefined,
      delLoader:false,
      openDialog:false,
      gantTasks:null,
      selectedGantTask:null,
      taskProgressList:['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%'],
      taskPriorityList:[
        {key: undefined, label: "Select Priority"},
        {key: "1", label: "High"},
        {key: "2", label: "Normal"},
        {key: "3", label: "Low"}
      ],
      taskNewComment:"",
      taskcomments:[],
      highlightCriticalPath:false
    };

    
  }

  toSentenceCase(string) {
    var sentence = string.split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  }

  calculateProgress(){

    if(this.props.updateProjectProgress){
      

      let gantTasks = gantt.serialize('json');
      let total=0;
      let counter=0;
      gantTasks.data.forEach(t=>{
        total+=t.progress; 
        counter++;      
      });
      const progress=(total/counter)*100;
      this.props.updateProjectProgress(progress.toFixed(2));
    }
  }
  deleteSelectedTask=async (event)=>{
    event.preventDefault();
    gantt.deleteTask(this.state.selectedGantTask.id);
    this.setState({selectedGantTask:null,openDialog:false,taskNewComment:"",taskcomments:[]});
    this.calculateProgress();
  }

  saveSelectedTask=async (event)=>{
    const {selectedGantTask} = this.state;
    this.setState({
      delLoader: true
    })

    let gantTasks = gantt.serialize('json');
    let data=[];
    gantTasks.data.forEach(t=>{
      if(t.id==selectedGantTask.id){
        data.push(selectedGantTask);
      }else{
        data.push(t);
      }
    });

    
    if(this.state.taskNewComment && this.state.taskNewComment.trim()){
      const comment={
        personName:this.toSentenceCase(getUser().fullName),
        description:this.state.taskNewComment.trim(),
        taskId: this.state.selectedGantTask.id,
        projectId: this.props.projectId
      }

      const response=await fetch("/api/milestones-comments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(comment)
      })
      console.log("milestones-comments",response);
    }
    

    gantTasks.data=data;
    //gantt.clearAll();
    gantt.parse(gantTasks);
    gantt.render(); 
    this.calculateProgress();
    this.handleSave(event);
  }

  handleSave(event) {
    event.preventDefault();
    // See if there is output here
    let ganttJson = gantt.serialize('json');
    const projectId = this.props.projectId;
  
    this.setState({
      delLoader: true
    })

    let postData = {
      orgId: getOrgId(),
      projectId: projectId,
      jsonData: JSON.stringify(ganttJson)
    };

    let apiPath = "/api/gantt/" + projectId;
    let successMessage = "";
    let method = "";

    if (this.state.isNewGantt) {
      // For create
      successMessage = "Gantt chart created."
      method = "POST";
    } else {
      // For updates - use PUT
      successMessage = "Gantt chart updated."
      method = "PUT";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(postData)
      })
        .then( () => {
          console.log("Going to log message: " + successMessage);
          this.props.messages(successMessage);
          this.setState({ isNewGantt: false,delLoader: false,openDialog:false });
        })
        .catch(err => {
          this.setState({ message: "Error occurred.",delLoader: false,openDialog:false });
        });
    }, 2000);
  }

  handleZoomChange = event => {
    const zoomSetting = event.target.value;
    this.setState({ scale: event.target.value });
    this.setZoom(zoomSetting);
    gantt.render();
  }



  setZoom = value => {


    switch (value) {
      case "Hours":
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
          { unit:"hour", step:1, date:"%H" }
        ];
        break;
      case "Days":
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = "week";
        gantt.config.date_scale = "WK#%W";
        gantt.config.subscales = [
          { unit: "day", step: 1, date: "%d %M" }
        ];
        gantt.config.scale_height = 60;
        break;
      case "Months":
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [
          { unit:"week", step:1, date:"WK#%W" }
        ];
        break;
      case "Quarters":
        gantt.config.min_column_width = 20;
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%M";
        gantt.config.subscales = [
          {unit: "month", step: 3, format: monthScaleTemplate},
          // {unit: "day", step: 1, date: "%d %M"}
        ];
        gantt.config.scale_height = 60;

        break;
      default:
        break;
    }
    // gantt.init("gantt");
  }

  zoomIn = () => {
    gantt.ext.zoom.zoomIn();
  };

  zoomOut = () => {
    gantt.ext.zoom.zoomOut();
  };

  renderGantt(projectId, assignedMenuItems) {
    // reordering tasks within the whole gantt
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    let gantTasks = {
      data: [],
      links: []
    };

    // Columns displayed on the Gantt chart view on the left.  Make sure the "add" button column is listed.
    gantt.config.columns = [
      {name: "text", label: "Task name", tree: true, width:'300'},
      // {name: "start_date", label: "Start time", align: "center"},
      // {name: "duration", label: "Duration", align: "center"},
      /* {
        name: "priority", label: "Priority", width: 80, align: "center",
        template: function (item) {
          if (item.priority == 1)
            return "High";
          if (item.priority == 2)
            return "Normal";
          if (item.priority == 3)
            return "Low";
          return "";
        }
      }, */
      {
        name: "assigned", label: "Resource name", width: 150, align: "left",
        template: function (item) {
          if (item.assigned === undefined) {
            //alert("assigned = '" + item.assigned + "'");
            return "Undefined";
          }
          return item.assigned;
        }
      }, 
      {name:"add", label:"", width: 30 }
    ];

    gantt.config.lightbox.sections = [
      { name:"description", height:38, map_to:"text", type:"textarea", focus:true},
      {
        name: "priority", height: 22, map_to: "priority", type: "select",
        options: [
          {key: undefined, label: ""},
          {key: 1, label: "High"},
          {key: 2, label: "Normal"},
          {key: 3, label: "Low"}
        ]
      },
      { name:"assigned", height:22, map_to:"assigned", type:"select",
        options: [ ]},
      { name:"time", height:72, type:"duration", map_to:"auto"}
    ];
    gantt.config.lightbox.sections[2].options = assignedMenuItems;

    gantt.locale.labels.section_priority = "Priority";
    gantt.locale.labels.section_assigned = "Assigned";

    this.initGanttDataProcessor();
    // this.dataProcessor.destructor();
    // this.dataProcessor = null;

    if (parseInt(projectId) > 0) {
      fetch(`/api/gantt/${projectId}`)
        .then(res => res.json())
        .then(tasks => {
          if (tasks.length > 0 ){
            // Note that we're not setting state here, at least yet.
            gantTasks = tasks[0].jsonData;
            this.setState({
              isNewGantt: false
            });
          } else {
            // new chart
            this.setState({
              isNewGantt: true
            });
          }
        })
        .then(milestones => {
          // gantTasks.data = this.state.tasks;
          /*
          gantt.attachEvent("onGanttRender", function(){
            gantt.message("Gantt chart is completely rendered on the page...")
          }); */
          gantt.init(this.ganttContainer);

          gantt.templates.rightside_text = function(start, end, task){
              if(task.type == gantt.config.types.milestone){
                  return task.text;
              }
              return "";
          };
          gantt.selectTask=(task)=>{
            console.log("selectTask --->",task);
          }
         
         /* gantTasks.data.forEach(t=>{
            if(!t.parent){
              t.type='project';
            }  
          });*/
          gantt.showLightbox=this.showDialogBox;
          gantt.clearAll();
          gantt.parse(gantTasks);
          gantt.render(); 
          this.calculateProgress();
          this.setState({gantTasks,selectedGantTask:null});
      
        });
    }
  }

  showDialogBox=(tid)=>{
    const projectId = this.props.projectId;
    let selectedGantTask=JSON.parse(JSON.stringify(gantt.getTask(tid)));

    selectedGantTask.progressTxt=this.getTaskProgressInText(selectedGantTask.progress);
    selectedGantTask.start_date=new Date(selectedGantTask.start_date);
    selectedGantTask.end_date=new Date(selectedGantTask.end_date);
    //selectedGantTask.type=selectedGantTask.parent>0?'task':'project';
    
    this.setState({selectedGantTask,openDialog:true,taskNewComment:"",taskcomments:[]});

    fetch(`/api/milestones-comments/${projectId}/${tid}`)
    .then(res => res.json())
    .then(taskcomments => {
      this.setState({taskcomments})
    })
    
  }

  getTaskProgressInText(progress){
      let progressToken=(progress+"").split(".");
      
      if(progressToken[0] && progressToken[0]==1){
        return "100%";
      }else if(progressToken[1]){
        return progressToken[1].substring(0,1)+"0%";
      }
     
      return "0%";
  }
  getTaskTextInProgress(progressTxt){
    return Number(progressTxt.substring(0,progressTxt.length-1))/100;
  }

  componentDidMount() {
    const projectId = this.props.projectId;
    let assignedMenuItems = [];
    let menuItem = "";
    // let i = 1;
    if (parseInt(projectId) > 0) {
      // Use fetch to get the list of persons assigned to a project as select items for our Gantt chart.
      fetch(`/api/persons-assigned-and-owned/${projectId}`)
        .then(res => res.json())
        .then(persons => {
          this.setState({persons})
          console.log("persons" , persons);
        })
        .then(gantt => {
          this.renderGantt(projectId, assignedMenuItems);
        })
      ;
    }
  }

  initGanttDataProcessor() {
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((entityType, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(entityType, action, item, id);
        }
        return resolve();
      });
    });
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }



  handleClose(){
    this.setState({openDialog:false})
  }

  changeSelectedTaskChange(key,val){
    const {selectedGantTask } =this.state;
    selectedGantTask[key]=val;
    selectedGantTask.progress=this.getTaskTextInProgress(selectedGantTask.progressTxt);
    this.setState({selectedGantTask});
  }

  changeSelectedTaskAssginee(val){
    const {selectedGantTask,persons } =this.state;
    selectedGantTask['assigned']=val;
    persons.forEach(p=>{
      if(p.fullName == val){
        selectedGantTask['assignedId']=p.id;
      }
    })
    this.setState({selectedGantTask});
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
                  {moment(cc.createdAt).format("YYYY-MM-DD hh:mm:ss")}
                </Typography>
              </Grid>

              <Grid container sm={12} xs={12} direction="row" >
                <Typography gutterBottom>
                  {cc.description}
                </Typography>
              </Grid>
            </Grid>

          </Grid>
          
        </Grid>
        
      </div>
    )
  }

  renderDialog(){
    const { classes } = this.props;
    return(
      <div >
        <Dialog   open={this.state.openDialog} onClose={()=>this.handleClose()} aria-labelledby="form-dialog-title">
          <Grid container style={{padding:20,justifyContent:"space-between",width:"100%"}}>
            <Typography variant="h5" color="primary" gutterBottom >
                Task Detail
            </Typography>
            {checkPermision('Projects Milestones','delete') &&
            <IconButton onClick={(event)=>this.deleteSelectedTask(event)}>
              <DeleteIcon color="primary" />
            </IconButton>
            }
          </Grid>
          <DialogContent style={{minWidth:550,minHeight:400}}>
              <Grid container>

                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="title-required"
                    label="Description"
                    onChange={(e) =>this.changeSelectedTaskChange('text',e.target.value)}
                    value={this.state.selectedGantTask.text}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid container className={classes.containerMargin} >
                  <Grid item xs={12} sm={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink htmlFor="status-simple">
                        Priority
                      </InputLabel>
                      <Select
                        value={this.state.selectedGantTask.priority}
                        onChange={(e) =>this.changeSelectedTaskChange('priority',e.target.value)}
                      >
                        {this.state.taskPriorityList.map((p,index) => {
                          return (
                            <MenuItem key={p.index} value={p.key}>
                              {p.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink htmlFor="status-simple">
                        Assigned
                      </InputLabel>
                      <Select
                        value={this.state.selectedGantTask.assigned}
                        onChange={(e) =>this.changeSelectedTaskAssginee(e.target.value)}
                      >
                        {this.state.persons.map((p,index) => {
                          return (
                            <MenuItem key={p.index} value={p.fullName}>
                              {p.fullName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink htmlFor="status-simple">
                        Type
                      </InputLabel>
                      <Select
                        value={this.state.selectedGantTask.type}
                        onChange={(e) =>this.changeSelectedTaskChange('type',e.target.value)}
                      >
                       
                            <MenuItem  value={"project"}>
                                Project
                            </MenuItem>
                            <MenuItem  value={"task"}>
                              Task
                            </MenuItem>
                            <MenuItem value={"milestone"}>
                              Milestone
                            </MenuItem>
                         
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={24} className={classes.containerMargin}>

                  <Grid item xs={12} sm={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink htmlFor="status-simple">
                        Progress
                      </InputLabel>
                      <Select
                        value={this.state.selectedGantTask.progressTxt}
                        onChange={(e) =>this.changeSelectedTaskChange('progressTxt',e.target.value)}
                      >
                        {this.state.taskProgressList.map((status,index) =>  <MenuItem key={index} value={status}> {status} </MenuItem> )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4} style={{paddingLeft:0}}>
                      <FormControl className={classes.formControl}>
                          <TextField
                            id="startDate"
                            label="Start Date"
                            type="date"
                            defaultValue={moment(new Date(this.state.selectedGantTask.start_date)).format("YYYY-MM-DD")}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) =>this.changeSelectedTaskChange('start_date',new Date(e.target.value))}
                          />
                        
                        </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                      <FormControl className={classes.formControl}>
                          <TextField
                            id="endDate"
                            label="End Date"
                            type="date"
                            defaultValue={moment(new Date(this.state.selectedGantTask.end_date)).format("YYYY-MM-DD")}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) =>{this.state.selectedGantTask.end_date=new Date(e.target.value);this.setState({selectedGantTask:this.state.selectedGantTask})}}
                          />
                        
                        </FormControl>
                  </Grid>
                </Grid>

                <Grid container className={classes.containerMargin}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="comment"
                      label="Enter Comment"
                      fullWidth
                      onChange={(e) =>this.setState({taskNewComment:e.target.value.substring(0,100)})}
                      value={this.state.taskNewComment}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.containerMargin}>
                    <Typography variant="h6" color="primary" gutterBottom >
                      Comment History
                    </Typography>
                  <div className={classes.taskCommentDivScrollView}  >
                    {this.state.taskcomments.map((cc, index) => this.renderComment(cc, index))}
                  </div>
                </Grid>



              </Grid>
             

            
          </DialogContent>

          <DialogActions>
            {!this.state.delLoader && <Button   variant="contained" onClick={()=>this.handleClose()} color="primary"    className={classes.secondary}>
              Cancel
            </Button>
            }
            {checkPermision('Projects Milestones','modify') && <div>
              {
                this.state.delLoader ?
                <CircularProgress /> :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event)=>this.saveSelectedTask(event)}
                  className={classes.secondary}
                >
              Save
              </Button>
              }
            </div>} 
          </DialogActions>

        </Dialog>
      </div>
    )
  }
  render() {
    this.setZoom("Quarters");
    const { classes } = this.props;
    const { highlightCriticalPath } = this.state;
    
    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="space-between">
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink id="select-scale-label">Scale</InputLabel>
              <Select
                labelId={"select-scale-label"}
                value={this.state.scale}
                onChange={this.handleZoomChange}
                inputProps={{
                  name: "scale",
                  id: "scale"
                }}
              >
                <MenuItem value={"Days"}>Weeks</MenuItem>
                <MenuItem value={"Months"}>Months</MenuItem>
                <MenuItem value={"Quarters"}>Quarters</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>{
                    gantt.config.highlight_critical_path=!highlightCriticalPath;
                    gantt.render(); 
                    this.setState({highlightCriticalPath:!highlightCriticalPath});
                  }}
                  className={classes.secondary}
                >
              {highlightCriticalPath?'Hide Critical Path':'Show Critical Path'}
              </Button>
              </Grid>
          </Grid>
          <Grid container spacing={24}>
          <Grid item xs={12}>
            <div
              ref={ (input) => { this.ganttContainer = input } }
              style={ { width: 1400, height: 500 } }
            >
            </div>
            {checkPermision('Projects Milestones','modify') && <div>
              {
                this.state.delLoader ?
                <CircularProgress /> :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSave}
                  className={classes.secondary}
                >
              Save
              </Button>
              }
            </div>
            }
          </Grid>
        </Grid>
        {this.state.selectedGantTask && this.renderDialog()}
      </div>
    );
  }
}

export default withStyles(styles)(Gantt);
