import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName, getOrgDepartments } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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



class OrganizationAction extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchPersonsOfOrg = this.fetchPersonsOfOrg.bind(this);
   this.handlePersonChange = this.handlePersonChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    title: "",
    description: "",
    orgId: 0,
    status: 'Open',
    persons: [],
    assigneeId: null,
    project: {},
    // title: "",
    // type: "",
    // level: "",
    // org: "",
    // orgId: 0,
    // orgName: "",
    // orgId: 0,
    // projectName: "",
    // departments: [],
    // useorgId: false,
    // useOrganizationId: false,
    // redirectTarget: "",
    // deptId: 0,
    // description: "",
    // formula: "",
    // startAt: "",
    // endAt: "",
    // msg: "",
    // kpitype: "",
    // readyToRedirect: false,
    // buttonText: "Create",
    // isEditing: false,
    // redirect: false,
    // isNew: false,
    // expanded: false,
    // hasError: false,
    // labelWidth: 0,
    // focus: false,
    // message: "",
    // nextItem: "",
    // tags: [{id: "", text: ""}],
    // suggestions: [
    //   { id: "Cluster analysis", text: "Cluster analysis" },
    //   { id: "Linear regression", text: "Linear regression" },
    //   { id: "Monte Carlo simulations", text: "Monte Carlo simulations" },
    //   { id: "Time-series analysis", text: "Time-series analysis" },
    //   { id: "Natural language processing", text: "Natural language processing" },
    //   { id: "Predictive analytics", text: "Predictive analytics" },
    //   { id: "Logistic regression", text: "Logistic regression" },
    //   { id: "Machine learning", text: "Machine learning" }
    // ],
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    delLoader:false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleStatusChange = event => {
    this.setState({status: event.target.value});
  };



  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

 

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };
  handlePersonChange = event => {
    this.setState({assigneeId: event.target.value});
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  async handleSubmit(event) {
    event.preventDefault();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    // console.log('handelsbmit-this.props.location',this.props.location);
    // console.log('handelsbmit-this.state.orgId',this.state.orgId);
    
    const orgId = this.props.location.state.orgId;
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

    this.setState({
      delLoader: true
    })


    if (actionid > 0) {
      // For updates
      apiPath = "/api/action-organization/" + actionid;
      successMessage = "Action '" + this.state.title + "' updated."
      method = "PUT";
    } else if(orgId > 0){
      // For create
      apiPath = "/api/action-organization/" + orgId;
      successMessage = "Action '" + this.state.title + "' created."
      method = "POST";
    } else {
      this.setState({ openSnackbar: true,message: 'Something went wrong.'});
    }
    console.log('json--- on OrganizationActions -- ',this.state );

    const response = await fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(response => response.json())
        .then((response) => {
          console.log('responseresponseresponseresponse0- on OrganizationActions on OrganizationActions---',response);
          // Redirect to the Project component.
          var redirectTarget = "/paneldashboard/"
          var redirectIdOrgOrProject = this.state.orgId;
         
        
          
          if(response && response.success === true){
      
            this.setState({ openSnackbar: true,message: response.message});
            
          }else{
            var mssgfale = response.message ? response.message : 'Something went wrong';
            this.setState({ openSnackbar: true,message: mssgfale,delLoader: false});
            return false;
          }

          setTimeout(() => {
          this.setState({
            redirectTarget:  redirectTarget,
            readyToRedirect: true,
            // message: response.message,
            redirectIdOrgOrProject: redirectIdOrgOrProject,
            delLoader: false
          });
        },3000);
        })
        .catch(err => {
          console.log('on OrganizationActions  error',err);
        });
        console.log("Response: ", response)
  };

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

  fetchPersonsOfOrg = (orgId) => {
    console.log('fetchPersons--',orgId);
    if (parseInt(orgId) > 0) { 
      console.log()
      fetch(`/api/organization-action-persons/${orgId}`)
        .then(res => res.json())
        .then(response => {
        
         this.setState({
          persons: response
        });
        });
    }
  };

  componentDidMount() {
    this.setOrganizationInfo();
    // Project ID and KPI id (if there is the former, are passed in by location.state).
 
    let orgId = 0;
    let actionid = 0;
   
    
      actionid = this.props.location.state.actionid && this.props.location.state.actionid;
      orgId = this.props.location.state.orgId;
      this.fetchPersonsOfOrg(orgId);
    if (parseInt(actionid) > 0) {
      fetch(`/api/action-organization-id/${actionid}`)
        .then(res => res.json())
        .then(action => {
          this.setState({
            id: actionid,
            title: action.title,
            description: action.description,
            assigneeId: action.assigneeId,
            status: action.status,
            projectName: action.project && action.project.title,
            orgId: orgId,
            buttonText: "Update",
            redirectTarget: "/paneldashboard"
          });
        });
    } else {
      this.setState({
        isEditing: true,
        orgId: orgId,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.
    // if(orgId > 0){ //Need this codition in case of when creating KPI for organisation and orgId is not in exist - Issue #48
    // fetch("/api/projects/" + orgId)
    //   .then(results => results.json())
    //   .then(project => this.setState({ project }));
    // }
  }

  render() {
    const { classes } = this.props;
    const { tags, suggestions } = this.state;



    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `${this.state.redirectTarget}`,
        state: {
          message: `${this.state.message}`,
          projId: this.state.redirectIdOrgOrProject,
          orgId:this.state.redirectIdOrgOrProject,
          
        }
      }} />;
    }

    console.log('this.props.location.state==on OrganizationActions',this.props.location.state);
console.log('this.state==on OrganizationActions',this.state);
// console.log('project==on OrganizationActions',this.state.project);
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
                    Action Detail<br/>
                  </Typography>
                  {/* <Typography variant="h7">
                    Organization: {getOrgName()}
                  </Typography> */}
                  
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

                    <Grid item xs={12} sm={12}>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="Assignee">Assignee</InputLabel>
                        <Select
                          value={this.state.assigneeId && this.state.assigneeId}
                          onChange={this.handlePersonChange}
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
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="Status">Status</InputLabel>
                        <Select
                          value={this.state.status && this.state.status}
                          onChange={this.handleStatusChange}
                          inputProps={{
                            name: "status",
                            id: "status"
                          }}
                        >
                          <MenuItem key='Open' value='Open'>
                                Open
                              </MenuItem>

                              <MenuItem key='Closed' value='Closed'>
                              Closed
                              </MenuItem>
                            
                        </Select>
                      </FormControl>
                    </Grid>
                   
                    <Grid item sm={10}>
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
                      <br />
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

export default withStyles(styles)(OrganizationAction);
