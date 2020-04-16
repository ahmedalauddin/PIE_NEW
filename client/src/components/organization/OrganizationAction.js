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
import PageTitle from "../PageTitle";
import moment from "moment";
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
    marginRight: theme.spacing.unit,
    height: 200 
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  state = {
    title: "",
    description: "",
    orgId: 0,
    status: 'Open',
    persons: [],
    assigneeId: null,
    project: {},
    dateAdded:"",
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    delLoader:false,
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
          var redirectTarget = "/organizationactions/"
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

   

  componentDidMount() {
    let orgName = getOrgName();
    let orgId = getOrgId();
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });
 
    let actionid = this.props.location.state.actionid && this.props.location.state.actionid;
   
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
            buttonText: "Save",
            redirectTarget: "/organizationactions",
            dateAdded:action.dateAdded
          });
        });
    } else {
      this.setState({
        isEditing: true,
        orgId: orgId,
        buttonText: "Create"
      });
    }
    
  }

  descriptionKeyPress=(event)=>{
    if(event.key === 'Enter'){
      setTimeout(()=>{
        const tokens=this.state.description.split("\n");
        const newTokens=[];
        let i=0
        for(i=0;i<tokens.length;i++){
            if(!tokens[i].startsWith((i+1)+". ")){
              newTokens.push((i+1)+". "+tokens[i]);
            }else{
              newTokens.push(tokens[i]);
            }
        }
        let description=newTokens.join("\n");
        this.setState({description});
      },100)
    }
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
          dateAdded:this.state.dateAdded
          
        }
      }} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/organizationactions"} />
        <div className={classes.root}>
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={"Regrouping"} />
          <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    TODO List 
                    
                    
                  </Typography>
                 
                  
                  <Grid container spacing={24}>
                    
                    <Grid item sm={10}  xs={12}>
                      <TextField
                        id="description"
                        label="Description"
                        multiline
                        style={{height:400}}
                        
                        value={this.state.description}
                        onChange={(event)=>this.setState({ description: event.target.value })}
                        onKeyPress={this.descriptionKeyPress}
                        className={classes.textFieldWide}
                        fullWidth
                        margin="normal"
                      />
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
