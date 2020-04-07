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
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton/index";
import { getUser } from "../../redux";

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
  divScrollView: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
    height: 400,
    overflow: "auto"
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
  },
  profileLogo: {
    width: 40,
    height: 40,
    margin: 10
  }
});



class ProjectComment extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    projectComments: [],
    newComment: "",
    projId: 0,
    projectDescription: "",
    projectTitle: "",
    openSnackbar: false,
    message: "",
    delLoader: false,
  };

  componentDidMount() {

    const { projectId, projectTitle, projectDescription } = this.props.location.state;


    fetch(`/api/projects-comment/${projectId}`)
      .then(res => res.json())
      .then(projectComments => {
        this.setState({
          projId: projectId,
          projectDescription,
          projectTitle,
          projectComments
        })
        setTimeout(() => this.scrollToBottom(), 100);
      });

  }

  toSentenceCase(string) {
    var sentence = string.split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  }
  addComment() {
    const { projectComments } = this.state;
    const user = getUser();
    const newComment = {
      personName: this.toSentenceCase(user.fullName),
      personId: user.id,
      description: this.state.newComment,
      createdAt: new Date(),
      projId: this.state.projId
    };
    console.log("newComment", newComment);


    this.setState({
      delLoader: true
    })
    let apiPath = "/api/projects-comment";

    fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    })
      .then((response) => {
        console.log('comment saved', response);

        if (response && response.statusText === "Created") {
            response.json().then((newComment)=>{
            this.setState({ openSnackbar: true, message: "Comment saved" });
            projectComments.push(newComment);
            setTimeout(() => {
              this.setState({
                delLoader: false,
                newComment: "",
                projectComments
              });
              setTimeout(() => this.scrollToBottom(), 100);
            }, 1000);
          })
          
        } else {
          var mssgfale = response.message ? response.message : 'Something went wrong';
          this.setState({ openSnackbar: true, message: mssgfale, delLoader: false });
          return false;
        }

       

      })
      .catch(err => {
        console.log('on OrganizationActions  error', err);
      });

  }

  deactivateProjectComment(cId,index){
    const { projectComments } = this.state;
    fetch(`/api/projects-comment/${cId}`,{ method: "DELETE"})
      .then(res => {
        console.log('on deactivateProjectComment ', res);
        projectComments.splice(index,1);
        this.setState({projectComments, openSnackbar: true, message: "Comment deleted"})
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }
  scrollToBottom = () => {
    if (this.divScrollView) {
      console.log(this.divScrollView);
      this.divScrollView.scrollTop = this.divScrollView.scrollHeight;
    }
  }

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  renderEnterComment() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
          <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={10}>
              <Paper className={classes.paper}>

                <Grid container direction="row" justify="space-between" alignItems="center" className="dash">

                  <Grid item sm={10} xs={10}  >
                    <TextField
                      id="comment"
                      label="Enter Comment"
                      multiline
                      className={classes.textFieldWide}
                      value={this.state.newComment}
                      onChange={(event) => this.setState({ newComment: event.target.value })}
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
                          onClick={() => this.addComment()}
                        >
                          Post Comment
                          </Button>
                    }
                  </Typography>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  renderComment(cc, index) {
    const { classes } = this.props;
    return (
      <Paper key={index} className={classes.paper} style={{ marginTop: 10 }}>
        <Grid container direction="row" justify="space-between" alignItems="flex-end" className="dash">

          <Grid container sm={11} xs={11} direction="row" >
            <img src={profileLogo} alt="" className={classes.profileLogo} />

            <Grid item sm={2} xs={2}  >
              <Typography variant="h5" color="primary" gutterBottom >
                {cc.personName}
              </Typography>
              <Typography variant="h7" color="primary" gutterBottom >
                {moment(cc.createdAt).format("YYYY-MM-DD hh:mm:ss")}
              </Typography>
            </Grid>

            <Grid item sm={8} xs={10}  >
              <Typography style={{ width: "100%" }} className={classes.heading}>
                {cc.description
                  && cc.description.split("\n").map((i, key) => {
                    return <p className="inlineBlock" key={key}>{i.trim()}</p>
                  })}
              </Typography>
            </Grid>

          </Grid>

          <IconButton onClick={()=>this.deactivateProjectComment(cc.id,index)}> 
            <DeleteIcon color="primary" />
          </IconButton>
        </Grid>
      </Paper>
    )
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
          orgId: this.state.redirectIdOrgOrProject,
        }
      }} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/ProjectComments"} />
        <div className={classes.root} >
          <Grid container justify="center" direction="column" alignItems="center" className="panel-dashboard">
            <PageTitle pageTitle={"Project Comments"} />
            <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
              <Grid item sm={10}>
                <Paper className={classes.paper} >
                  <div className={classes.divScrollView} ref={(el) => { this.divScrollView = el; }}>
                    {this.state.projectComments.map((cc, index) => this.renderComment(cc, index))}
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {this.renderEnterComment()}
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

export default withStyles(styles)(ProjectComment);