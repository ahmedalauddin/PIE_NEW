import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName, getOrgDepartments,getUser, checkPermision } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from "@material-ui/core/IconButton/index";
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



class ProjectDocument extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.fetchPersons = this.fetchPersons.bind(this);
    // this.handlePersonChange = this.handlePersonChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);

  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    title: "",
    description: "",
    // fileName: '',
    projectId: 0,
    projId: 0,
    assigneeId: null,
    buttonText: 'Create',
    project: {},
    persons: [],
    fileName : '',
    fileNameOld : '',

    uploadBy: 0,
    dateAdded: '',

    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    delLoader: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // handlePersonChange = event => {
  //   this.setState({ uploadBy: event.target.value });
  // };



  // handleDelete(i) {
  //   const { tags } = this.state;
  //   this.setState({
  //     tags: tags.filter((tag, index) => index !== i),
  //   });
  // }



  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({ hasError: true });
    return <Redirect to="/Login" />;
  };

  async handleSubmit(event) {
    console.log('getUser().id==-',getUser().id);
    event.preventDefault();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    // console.log('handelsbmit-this.props.location',this.props.location);
    // console.log('handelsbmit-this.state.projectId',this.state.projectId);

    const projectId = this.props.location.state.projectId;
    const id = this.props.location.state.id;
    let apiPath = "";
    let successMessage = "";
    let method = "";

    var title = this.state.title;
    var description = this.state.description;
    var fileName = this.state.fileName;
    var uploadBy = getUser().id;

    if (title == undefined || title == '' || uploadBy == 0 || uploadBy == '') {

      this.setState({ openSnackbar: true, message: "Please Check Required Fields.", });
      return false;
    }

    this.setState({
      delLoader: true
    })
console.log('idididididd-',id);
    if (id > 0) {
      // For create
      apiPath = "/api/project-document/" + id;
      successMessage = "Document '" + this.state.title + "' created."
      method = "PUT";
    } else {
      this.setState({ openSnackbar: true, message: 'Something went wrong.' });
    }




    const formData = new FormData()

    formData.append('fileName', this.state.fileName)
    formData.append('title', title)
    formData.append('description', this.state.description)
console.log('thisstattetet--',JSON.stringify(this.state));
    const response = await fetch(apiPath, {
      method: method,
    
      body: formData
    })
      .then(response => response.json())
      .then((response) => {
        console.log('responseresponseresponseresponse0- on ProjectDocuments on ProjectDocuments---', response, projectId);
        // Redirect to the Project component.
        var redirectTarget = "/project/"
        var redirectIdOrgOrProject = projectId;



        if (response && response.success === true) {

          this.setState({ openSnackbar: true, message: response.message });

        } else {
          var mssgfale = response.message ? response.message : 'Something went wrong';
          this.setState({ openSnackbar: true, message: mssgfale, delLoader: false });
          return false;
        }

        setTimeout(() => {
          this.setState({
            redirectTarget: redirectTarget,
            readyToRedirect: true,
            // message: response.message,
            redirectIdOrgOrProject: redirectIdOrgOrProject,
            delLoader: false
          });
        }, 3000);
      })
      .catch(err => {
        console.log('on ProjectDocuments  error', err);
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

  fetchPersons = (projectId) => {
    console.log('fetchPersons--', projectId);
    if (parseInt(projectId) > 0) {
      console.log()
      fetch(`/api/project-persons-for-documents/${projectId}`)
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

    let projectId = 0;
    let id = 0;


    id = this.props.location.state.id && this.props.location.state.id;
    projectId = this.props.location.state.projectId;
    this.fetchPersons(projectId);
    if (parseInt(id) > 0) {
    fetch(`/api/project-document-single/${id}`)
      .then(res => res.json())
      .then(response => {
        this.setState({
          id: id,
          title: response.title,
          description: response.description,
          uploadBy: response.uploadBy,
          fileNameOld: response.fileName,
          // projectName: response.project && response.project.title,
          projectId: projectId,
          buttonText: "Update",
          redirectTarget: "/project"
        });
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

  // selectFile = (e) => {
  //   console.log(e.target.files)
  //   const file = e.target.files[0]
  //   this.setState({
  //     fileName: file
  //   })
  // }

  selectFile = (e) => {
    console.log(e.target.files)
    const file = e.target.files[0]
    this.setState({
      fileName: file
    })
  }

  render() {
    const { classes } = this.props;
    const { tags, suggestions } = this.state;



    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      console.log('readyToRedirectreadyToRedirect--', this.state);
      return <Redirect to={{
        pathname: `${this.state.redirectTarget}`,
        state: {
          message: `${this.state.message}`,
          projId: this.state.redirectIdOrgOrProject,
          projectId: this.state.redirectIdOrgOrProject,

        }
      }} />;
    }

    // console.log('getUser()', getUser().id);
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
                    Update Document Detail<br />
                  </Typography>
                  {/* <Typography variant="h7">
                    Project: {this.state.project.title}
                  </Typography> */}

                  <Grid container spacing={24}>
                    <Grid item sm={10}>
                      <TextField
                        required
                        id="title-required"
                        label="Title/Description"
                        fullWidth
                        onChange={this.handleChange("title")}
                        value={this.state.title}
                        className={classes.textFieldWide}
                        margin="normal"
                      />
                    </Grid>
                    {/* <Grid item sm={10}>
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
                    </Grid> */}
                    <Grid item sm={10}>
                    {this.state.fileNameOld === '' ? 'No file' :
                        <>
                        <Typography>File Name</Typography> 
                        {this.state.fileNameOld.split('/')[1]}
                        <IconButton
                        // onClick={() => {
                        //   this.deactivate(ProjectAction.id);
                        // }}
                      >
                        
                         <a target='_blank' href={`/docs/${this.state.fileNameOld}`} >
                               <GetAppIcon color="primary" />
                        </a> 
                        </IconButton>
                        </>
                        } 
                        
                        </Grid>
                        <Grid item sm={10}>
                        <Typography>Select and update a new file will replace any old file associated with this entry.
                        </Typography>
                      <input type="file" name="fileName2" onChange={(e) => this.selectFile(e)} />
                      {/* <TextField
                        required
                        id="fileName-required"
                        label="File"
                        fullWidth
                        onChange={this.handleChange("fileName")}
                        value={this.state.fileName}
                        className={classes.textFieldWide}
                        margin="normal"
                      /> */}
                    </Grid>

{/* 
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="Assignee">Assignee&nbsp;*</InputLabel>
                        <Select
                          value={this.state.uploadBy && this.state.uploadBy}
                          onChange={this.handlePersonChange}
                          inputProps={{
                            name: "uploadBy",
                            id: "uploadBy"
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
                    </Grid> */}


                 
                    <Grid item sm={10}>
                    {checkPermision('Projects Documents','modify') && 
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

export default withStyles(styles)(ProjectDocument);
