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



class ProjectComment extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  state = {
    projectComments:[],
    newComment:""
  };

  async handleSubmit(event) {
    event.preventDefault();
 
  }
  componentDidMount() {
    const defaultVal="Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies";
    const {projectComments} =this.state;
    projectComments.push({description:defaultVal,createdAt:new Date()});
    this.setState({newComment:"",projectComments})
  }

  addComment(){
    const {projectComments} =this.state;
    projectComments.push({description:this.state.newComment,createdAt:new Date()});
    this.setState({newComment:"",projectComments})
  }

  render() {
    const { classes } = this.props;

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

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/ProjectComments"} />
        <div className={classes.root} >
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
          <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography variant="h7" color="secondary" gutterBottom >
                    Comments
                  </Typography>
                  
                  <div style={{height:20}}></div> 

                  {this.state.projectComments.map((cc,index)=><Grid key={index} container spacing={24}>
                    <Grid item sm={9}  xs={11}  >
                        <Typography variant="h7" color="secondary" gutterBottom >
                          {cc.description}
                      </Typography>
                    </Grid>
                  </Grid>
                  )}
                  <Grid container spacing={24}>
                    
                    <Grid item sm={9}  xs={11}  >
                      <TextField
                        id="comment"
                        label="Enter Comment"
                        multiline
                        className={classes.textFieldWide}
                        value={this.state.newComment}
                        onChange={(event)=>this.setState({newComment:event.target.value})}
                        style={{width:"100%"}}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item sm={1} xs={1} >
                      <Typography component="p">
                      {
                        this.state.delLoader ?
                        <CircularProgress /> :
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.secondary}
                            onClick={()=>this.addComment()}
                          >
                            Save
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
        
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectComment);
