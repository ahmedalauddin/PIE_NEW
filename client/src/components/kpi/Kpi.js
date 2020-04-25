/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/kpi/Kpi.js
 * Descr:    Project component.  Allows create and update.
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-01
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { getOrgId, getOrgName, getOrgDepartments, checkPermision } from "../../redux";
import { Redirect } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";

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
  }
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Kpi extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    title: "",
    type: "",
    level: "",
    org: "",
    orgId: 0,
    orgName: "",
    projectId: 0,
    projectName: "",
    departments: [],
    useProjectId: false,
    useOrganizationId: false,
    redirectTarget: "",
    deptId: 0,
    description: "",
    formula: "",
    startAt: "",
    endAt: "",
    msg: "",
    kpitype: "",
    readyToRedirect: false,
    buttonText: "Create",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    hasError: false,
    labelWidth: 0,
    focus: false,
    message: "",
    nextItem: "",
    tags: [{id: "", text: ""}],
    suggestions: [
      { id: "Cluster analysis", text: "Cluster analysis" },
      { id: "Linear regression", text: "Linear regression" },
      { id: "Monte Carlo simulations", text: "Monte Carlo simulations" },
      { id: "Time-series analysis", text: "Time-series analysis" },
      { id: "Natural language processing", text: "Natural language processing" },
      { id: "Predictive analytics", text: "Predictive analytics" },
      { id: "Logistic regression", text: "Logistic regression" },
      { id: "Machine learning", text: "Machine learning" }
    ],
    openSnackbar: false,
      snackbarMessage: "",
      message: "",
    delLoader:false,
    fromOrganization:false,
    showSaveButton:true
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
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

  async handleSubmit(event) {
    event.preventDefault();
    
    const kpiId = this.props.location.state.kpiId;
    let apiPath = "";
    let successMessage = "";
    let method = "";

   console.log(this.state)

   if(this.state.level===''){
    this.setState({ openSnackbar: true,message: "Please Check Required Fields.",});
    return false;
   }

   try{

    this.state.level=Number(this.state.level);
   }catch(e){}
   console.log(!this.state.title)
   console.log(!this.state.level)
   console.log(!this.state.deptId)
    if(!this.state.title || !(this.state.level>-1) || !this.state.deptId){
      
      this.setState({ openSnackbar: true,message: "Please Check Required Fields.",});
      return false;
    }

    this.setState({
      delLoader: true
    })


    if (kpiId > 0) {
      // For updates
      apiPath = "/api/kpis/" + kpiId;
      successMessage = "KPI '" + this.state.title + "' updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/kpis/";
      successMessage = "KPI '" + this.state.title + "' created."
      method = "POST";
    }

    const response = await fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(response => response.json())
        .then((response) => {
          
         
          
          this.setState({ openSnackbar: true,message: response.message && response.message});
          
          if(response && response.success === true){
      
            this.setState({ openSnackbar: true,message: response.message});
            
          }else{
            var mssgfale = response.message ? response.message : 'Something went wrong';
            this.setState({ openSnackbar: true,message: mssgfale,delLoader: false});
            return false;
          }

          this.redirectBack(3000);
          
        })
        .catch(err => {
          console.log(err);
        });
        console.log("Response: ", response)
  };

  redirectBack(timeout){
    const projectId = this.props.location.state.projectId;
    const organizationId = this.props.location.state.organizationId

    let redirectTarget = "/project/";
    let redirectIdOrgOrProject = projectId;

  
    if(this.state.fromOrganization){
      redirectTarget =  "/organization/"
      redirectIdOrgOrProject = organizationId;
    }

    setTimeout(() => {
      this.setState({
        redirectTarget:  redirectTarget,
        readyToRedirect: true,
        redirectIdOrgOrProject: redirectIdOrgOrProject,
        delLoader: false
      });
    },timeout);
  }

  setPreviousState(){
    const projectId = this.props.location.state.projectId;
    const organizationId = this.props.location.state.organizationId
    
    let fromOrganization= false;
    if(projectId == undefined && organizationId !== undefined){
      fromOrganization=true;
    }else if(projectId !== undefined && organizationId !== undefined){
      fromOrganization=true;
    }

    this.setState({
      fromOrganization      
    });
  }

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();

    fetch(`api/departments/org/${orgId}`)
    .then(res => res.json())
    .then(departments => {
      this.setState({
        orgName: orgName,
        orgId: orgId,
        departments: departments
      });
    });
    
  };

  componentDidMount() {
    this.setPreviousState();
    this.setOrganizationInfo();
    
    // Project ID and KPI id (if there is the former, are passed in by location.state).
    const kpiId = this.props.location.state.kpiId;
    let projectId = 0;
    let organizationId = 0;
    let useProjectId = false;
    let useOrganizationId = false;
    let redirectTarget = "";

    if (this.props.location.state.projectId) {
      projectId = this.props.location.state.projectId;
      useProjectId = true;
      useOrganizationId = false;
      redirectTarget = "/project/" + projectId;
    } else if (this.props.location.state.organizationId) {
      projectId = 0;
      organizationId = this.props.location.state.organizationId;
      useProjectId = false;
      useOrganizationId = true;
      redirectTarget = "/organization/" + organizationId;
    }

    if (parseInt(kpiId) > 0) {
      fetch(`/api/kpis/${kpiId}`)
        .then(res => res.json())
        .then(kpi => {

          const showSaveButton=(this.state.fromOrganization || kpi.projectId)?true:false;

          this.setState({
            id: kpiId,
            title: kpi.title,
            description: kpi.description,
            level: kpi.level,
            formula: kpi.formulaDescription,
            orgId: kpi.orgId,
            projectName: kpi.project && kpi.project.title,
            deptId: kpi.deptId,
            type: kpi.type,
            kpitype: kpi.type,
            tags: kpi.tags.map(item => ({
              id: item.tag,
              text: item.tag,
            })),
            projectId: kpi.projectId,
            organizationId: organizationId,
            buttonText: "Update",
            useProjectId: useProjectId,
            useOrganizationId: useOrganizationId,
            redirectTarget: redirectTarget,
            showSaveButton
          });
          let x = 1;
        });
    } else {
      this.setState({
        isEditing: true,
        projectId: projectId,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.
    if(projectId > 0){ //Need this codition in case of when creating KPI for organisation and ProjectId is not in exist - Issue #48
    fetch("/api/projects/" + projectId)
      .then(results => results.json())
      .then(project => this.setState({ project }));
    }
  }

  render() {
    const { classes } = this.props;
    const { tags, suggestions } = this.state;
// console.log('this.props.location.state==on kpijs',this.props.location.state);
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `${this.state.redirectTarget}`,
        state: {
          message: `${this.state.message}`,
          projId: this.state.redirectIdOrgOrProject,
          projectId:this.state.redirectIdOrgOrProject,
          organizationId: this.state.redirectIdOrgOrProject
        }
      }} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    KPI Detail<br/>
                  </Typography>
                  
                  <Typography variant="h7">
                    Organization: {getOrgName()}
                  </Typography>
                  <Grid container spacing={24}>
                    <Grid item sm={10}>
                      <TextField
                        required
                        id="title-required"
                        label="Title"
                        fullWidth
                        onChange={this.handleChange("title")}
                        value={this.state.title}
                        className={classes.textFieldWide}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item sm={10}>
                      <TextField
                        id="description"
                        label="Description"
                        multiline
                        rowsMax="6"
                        value={this.state.description}
                        onChange={this.handleChange("description")}
                        className={classes.textFieldWide}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item sm={10}>
                      <TextField
                        id="formula"
                        label="Formula Description"
                        multiline
                        rowsMax="6"
                        value={this.state.formula}
                        onChange={this.handleChange("formula")}
                        className={classes.textField}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item sm={10}>
                      <FormControl className={classes.formControl} style={{width:405}}>
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
                    <Grid item sm={10}>
                      <TextField
                        id="level"
                        required
                        label="Taget Value"
                        onChange={this.handleChange("level")}
                        value={this.state.level}
                        className={classes.textField}
                        margin="normal"
                        style={{width:405}}
                      />
                    </Grid>
                    
                    <Grid item sm={10} container direction="row">
                      {this.state.showSaveButton &&  checkPermision('Projects KPIs','modify')  &&
                          <Typography component="p">
                          {
                            this.state.delLoader ?
                            <CircularProgress /> :
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className={classes.secondary}
                              >
                                {this.state.buttonText}
                              </Button>
                            }
                          </Typography>
                      }
                      { !this.state.delLoader &&
                          <Button
                            style={{marginLeft:10}}
                            variant="contained"
                            color="primary"
                            onClick={()=>this.redirectBack(0)}
                            className={classes.secondary}
                          >
                            Cancel
                          </Button>
                      }
                    </Grid>
                  </Grid>
                </form>
              </Paper>
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

export default withStyles(styles)(Kpi);
