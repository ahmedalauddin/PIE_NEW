/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/person/Person.js
 * Descr:    Person component.  Allows create and update.
 * Created:  2019-05-23
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-15
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { getOrgName,isAdministrator, getOrgId, checkPermision } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import { red } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from '@material-ui/core/CircularProgress';

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
  avatar: {
    backgroundColor: red[500]
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
  dropDown:{
    width: "100%",
    marginLeft: 8,
    marginTop:15
  }
});

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    orgId: null,
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "Select role",
    departments: [],
    deptId: 0,
    buttonText: "Create",
    readyToRedirect: false,
    validationError: false,
    openSnackbar: false,
    message: "",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    statusList: [],
    hasError: false,
    labelWidth: 0,
    focus: false,
    nextItem: "",
    referrer: "",
    delLoader:false,
    roles:[ 'Select role'],
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
  
  handleSubmit(event) {
    event.preventDefault();
    const personId = this.props.location.state.personId;
    const orgId = this.props.location.state.organizationId;
    let apiPath = "";
    let successMessage = "";
    let method = "";
    
    let name = this.state.lastName;
    
    if(name == undefined || name == ''){
      this.setState({ message: "Please Check Required Fields.",});
      return false;
    }

    this.setState({
      delLoader: true
    })
    const data=JSON.parse(JSON.stringify(this.state));

    if (personId > 0) {
      // For updates
      apiPath = "/api/persons/" + personId;
      successMessage = "User " + this.state.lastName + " updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/persons";
      successMessage = "User " + this.state.lastName + " created."
      method = "POST";

      if(isAdministrator()){
        data.isCustomerAdmin=1;
      }
    }
    
    if(data.role=='Select role'){
      data.role=null;
    }
    
    if(data.deptId===0){
      data.deptId=null;
    }

    
    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      })
      .then(data => {
       
        data.json().then(res => {
             
          this.setState({
            message: res.message,
                    readyToRedirect: true,
                    delLoader: true
                  });
                })
                
              })
              .catch(err => {
        console.log("Signup error: " + err);
        this.setState({
          message: "Error: " + err,
          readyToRedirect: true,
          delLoader: true
        });
      });

    }, 2000);
  };
  
  componentDidMount() {
   
    let personId = this.props.location.state.personId;
    let orgId = this.props.location.state.organizationId;
    let referrer = this.props.location.state.referrer;
    
    if(!orgId){
      orgId=getOrgId();
    }
    
    if (parseInt(personId) > 0) {
      fetch(`/api/persons/${personId}`)
      .then(res => res.json())
        .then(person => {
          this.setState({
            id: personId,
            orgId: orgId,
            fullName: person.fullName,
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            role: person.role,
            deptId: person.deptId,
            buttonText: "Update",
            referrer: referrer
          });
        });
    } else {
      this.setState({
        isEditing: true,
        orgId: orgId,
        buttonText: "Create",
        referrer: referrer
      });
    }
    
    fetch("/api/departments/org/" + orgId)
    .then(results => results.json())
      .then(departments => this.setState({ departments:[{id:0,name:"Select department"}].concat(departments) }));
      
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

  render() {
    const { classes } = this.props;
    const orgId = this.props.location.state.organizationId;
    const currentPath = this.props.location.pathname;
    const organizationName= this.props.location.state.organizationName || getOrgName();
    const isAdminUser=isAdministrator();
    

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      
      return <Redirect to={{
        pathname: isAdministrator() ?`/orgdashboard`:`/organization`,
        state: {
          message: `${this.state.message}`,
          organizationId: orgId
        }
      }} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >{isAdminUser?'Customer Admin':'User'}<br/>
                  </Typography>
                  <Typography variant="h7">
                    Organization: {organizationName}
                  </Typography>
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="firstName"
                        label="First Name"
                        fullWidth
                        onChange={this.handleChange("firstName")}
                        value={this.state.firstName}
                        className={classes.textField}
                        margin="normal"
                      />
                      <TextField
                        required
                        id="lastName"
                        label="Last Name"
                        fullWidth
                        onChange={this.handleChange("lastName")}
                        value={this.state.lastName}
                        className={classes.textField}
                        margin="normal"
                      />

                     {!isAdminUser && <FormControl className={classes.formControl} className={classes.dropDown}>
                        <InputLabel shrink htmlFor="department-simple">
                          Role
                        </InputLabel>
                        <Select
                          value={this.state.role}
                          onChange={(event)=>this.setState({role: event.target.value })}
                        >
                          {this.state.roles.map((r,index) => {
                            return (
                              <MenuItem key={index} value={r}>
                                {r}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl> }

                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="email"
                        label="Email Address"
                        fullWidth
                        onChange={this.handleChange("email")}
                        value={this.state.email}
                        className={classes.textField}
                        margin="normal"
                      />
                      {!isAdminUser && <FormControl className={classes.formControl} className={classes.dropDown} >
                        <InputLabel shrink htmlFor="department-simple">
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
                          {this.state.departments.map(department => {
                            return (
                              <MenuItem key={department.id} value={department.id}>
                                {department.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>}

                    </Grid>
                  
                    
                    <Grid item xs={12} sm={12}>
                    {checkPermision('Organization People','modify') &&<>{
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
                    }</>}
                    </Grid>
                    <br />
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
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Person);

