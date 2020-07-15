/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/ProjectDetail.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-29
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { styles } from "../styles/MaterialSense";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Redirect } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { getOrgId, getOrgName, setProject, store,checkPermision } from "../../redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import ViewIcon from "@material-ui/icons/Comment";
import IconButton from "@material-ui/core/IconButton/index";


class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKpiSelectChange = this.handleKpiSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.fetchProject = this.fetchProject.bind(this);
    this.fetchProjectStatuses = this.fetchProjectStatuses.bind(this);
    this.onChange = editorState => this.setState({ editorState });
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    organizations: [],
    departments: [],
    projid: 0,
    title: "",
    businessGoal: "",
    org: "",
    orgId: "",
    orgName: "",
    description: "",
    summary: "",
    mainKpiId: null,
    readyToRedirect: false,
    redirectTarget: '',
    hasError: "",
    kpis: [],
    startAt: "",
    endAt: "",
    progress: 0,
    message: "",
    buttonText: "Create",
    isEditing: false,
    redirect: false,
    redirectIdProject: '',
    isNew: false,
    expanded: false,
    labelWidth: 0,
    statusList: [],
    loader: false,
    delLoader: false,
    projectLastComment:"",
    readyToProjectComment:false,
    deptId:0
  };

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();

    fetch(`/api/departments/org/${orgId}`)
    .then(res => res.json())
    .then(departments => {
      this.setState({
        orgName: orgName,
        orgId: orgId,
        departments: departments
      });
    });
    
  };

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleKpiSelectChange = event => {
    this.setState({mainKpiId: event.target.value});
  };

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}));
  };

  handleSelectChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  anotherFunction = () => {
    this.props.showMessages(this.state.message);
  };

  async handleSubmit(event) {
    // console.log('this.state',this.state);
    var mom_startAt = moment.utc(this.state.startAt, "YYYY-MM-DD");
    var mom_endDat = moment.utc(this.state.endAt, "YYYY-MM-DD");
    
    var isvalid_mom_startAt = mom_startAt.isValid();
    var isvalid_mom_endDat = mom_endDat.isValid();
    var isacurate_start_and_end_date = mom_endDat.isAfter(mom_startAt);

    if (this.state.title === "") {
      this.props.messages("Project title is required.");
    } else if (this.state.endAt === "" || this.state.startAt === "" || this.state.endAt === "Invalid date" || this.state.startAt === "Invalid date") {
      this.props.messages("Start & End date is required.");
    } else if (isvalid_mom_startAt === false || isvalid_mom_endDat === false || isacurate_start_and_end_date === false) {
      this.props.messages("Start & End date is not accurate.");
    } else {
      event.preventDefault();
      let projectId = parseInt(this.state.id);
      let apiPath = "";
      let successMessage = "";
      let method = "";
      this.setState({loader: true});
      if (projectId > 0) {
        // For updates - use PUT
        apiPath = "/api/projects/" + projectId;
        successMessage = "Project updated.";
        method = "PUT";
      } else {
        // For create
        apiPath = "/api/createnewproject/";
        successMessage = "Project created.";
        method = "POST";
      }

      await fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then((res) => {
          // console.log("Going to log message: " + successMessage, res);
          this.props.messages(successMessage);
          this.setState({loader: false});
          

          if (res.projectId && res.projectId > 0) {
            window.location.assign('/project/'+res.projectId )
            // //this.props.renderNewProject(res.projectId);
            // setTimeout(() => {
            //   this.setState({
            //     redirectTarget:  '/project/',
            //     readyToRedirect: true,
            //     // message: response.message,
            //     redirectIdProject: res.projectId,
            //     delLoader: false
            //   });
            //   //this.fetchProject(res.projectId);
            //},3000);
          }
        })
        .catch(err => {
          this.props.messages("Something went wrong.");
          this.setState({message: "Error occurred.", loader: false});
        });
    }
  }

  // Fetch project and update the Redux store.
  fetchProject(projectid) {
    fetch(`/api/projects/${projectid}`)
      .then(res => res.json())
      .then(project => {
        this.setState({
          id: projectid,
          businessGoal: project.businessGoal,
          title: project.title,
          description: project.description,
          org: project.organization.name,
          orgId: project.orgId,
          deptId: project.deptId,
          summary: project.summary,
          mainKpiId: project.mainKpiId,
          kpis: project.kpis,
          progress: project.progress,
          statusId: project.statusId,
          startAt: moment(project.startAt).format("YYYY-MM-DD"),
          endAt: moment(project.endAt).format("YYYY-MM-DD"),
          buttonText: "Update"
        });
        this.fetchProjectLastComment(projectid);
        return project;
      })
      .then(project => {
        store.dispatch(setProject(JSON.stringify(project)));
      });
  }

  fetchProjectLastComment(projectid) {
    fetch(`/api/projects-comment-recent/${projectid}`)
    .then(res => res.json())
    .then(projectComments => {
      if(projectComments && projectComments.length>0){
        this.setState({projectLastComment:projectComments[0].description}) ;
      }
    });
  }

  fetchProjectStatuses() {
    fetch("/api/projectstatuses")
      .then(results => results.json())
      .then(statuses => this.setState({statusList: statuses}));
  }

  componentDidMount() {
    // console.log('Proj details component Compo mount');
    this.setOrganizationInfo();
    let projectid = parseInt(this.props.projectId);

    if (projectid > 0) {
      this.fetchProject(projectid);
    } else {
      this.setState({
        isEditing: true,
        buttonText: "Create"
      });
    }
    this.fetchProjectStatuses();

    
  }

  componentDidCatch() {
    return <Redirect to="/Login"/>;
  }

  renderProjectCommentRedirect = () => {
    if (this.state.readyToProjectComment) {
      return (
        <Redirect
          to={{
            pathname: "/ProjectComment",
            state: {
              projectId: this.state.id,
              projectTitle: this.state.title,
              projectDescription: this.state.description,
            }
          }}
        />
      );
    }
  };

  render() {
    // console.log('Check')
    // debugger
    const {classes} = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    // this.props.messages("Entering project detail component");

    if (this.state.readyToRedirect) {
      // console.log('sadsad -- redirect');
      // alert('sdf');
      this.setState({readyToRedirect:false});
      return <Redirect to={{
        pathname: `${this.state.redirectTarget}`,
        state: {
          // message: `${this.state.message}`,
          projId: this.state.redirectIdProject,
          projectId:this.state.redirectIdProject,
        }
      }} />;
    }

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <Typography color="secondary" gutterBottom>
          {this.state.message}
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              id="title-required"
              label="Project Title"
              onChange={this.handleChange("title")}
              value={this.state.title}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="description"
              label="Description"
              multiline
              rowsMax="6"
              value={this.state.description}
              onChange={this.handleChange("description")}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              id="summary"
              label="Summary"
              multiline
              rowsMax="8"
              value={this.state.summary}
              onChange={this.handleChange("summary")}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              id="businessGoal"
              label="Business Goal"
              multiline
              rowsMax="4"
              value={this.state.businessGoal}
              onChange={this.handleChange("businessGoal")}
              fullWidth
              className={classes.textFieldWide}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl className={classes.formControl} style={{width:"100%"}}>
              <InputLabel htmlFor="dept-simple" required>
                Department
              </InputLabel>
              <Select
                value={this.state.deptId}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: "deptId",
                  id: "deptId"
                }}
              >
                {this.state.departments && this.state.departments.map(dept => {
                  return (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <br />
            <br />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl} style={{width:"50%"}}>
              <InputLabel shrink htmlFor="status-simple">
                Status
              </InputLabel>
              <Select
                value={this.state.statusId}
                onChange={this.handleSelectChange}
                inputProps={{
                  name: "statusId",
                  id: "statusId"
                }}
              >
                {this.state.statusList.map(status => {
                  return (
                    <MenuItem key={status.id} value={status.id}>
                      {status.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl} style={{width:"50%"}}>
              <InputLabel shrink htmlFor="kpi-simple">Main KPI</InputLabel>
              <Select
                value={this.state.mainKpiId}
                onChange={this.handleKpiSelectChange}
                inputProps={{
                  name: "mainKpiId",
                  id: "mainKpiId"
                }}
              >
                {this.state.kpis.map(kpi => {
                  return (
                    kpi.active !== 1 ? '' : <MenuItem key={kpi.id} value={kpi.id}>
                      {kpi.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
            required
              id="startAt"
              label="Start Date"
              type="date"
              value={this.state.startAt}
              onChange={this.handleChange("startAt")}
              className={classes.textFieldWide}
              style={{width:"50%"}}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="standard-required"
              label="Progress"
              value={this.props.progress}
              className={classes.textFieldWide}
              style={{width:"50%"}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    %
                  </InputAdornment>
                ),
                readOnly: Boolean(true),
                disabled: Boolean(true)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
            required
              id="endAt"
              label="End Date"
              type="date"
              value={this.state.endAt}
              onChange={this.handleChange("endAt")}
              className={classes.textFieldWide}
              style={{width:"50%"}}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              id="standard-required"
              label="Comments"
              value={this.state.projectLastComment}
              className={classes.textFieldWide}
              style={{width:"50%"}}
              inputProps={{
                readOnly: Boolean(true),
                disabled: Boolean(true),
              }}
            />
            <IconButton  onClick={()=>this.setState({readyToProjectComment:true})} style={{position:"absolute"}}>
                  <ViewIcon color="primary" />
              </IconButton>
          </Grid>
          


         {checkPermision('Projects','modify') && <Grid item xs={12} sm={12}>
            {this.state.loader ?
              <CircularProgress/>
              :
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                className={classes.secondary}
              >
                {this.state.buttonText}
              </Button>
            }
            <br/>
          </Grid>
          }
        </Grid>
        {this.renderProjectCommentRedirect()}
      </form>
    );
  }
}

export default withStyles(styles)(ProjectDetail);
