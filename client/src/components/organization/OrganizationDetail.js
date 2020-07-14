/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/organization/OrganizationDetail.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-27
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { red } from "@material-ui/core/colors";
import { withRouter } from "react-router-dom";
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
  }
});

class OrganizationDetail extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openMindmap = this.openMindmap.bind(this);
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
    mainKpiId: null,
    hasError: "",
    kpis: [],
    startAt: "",
    endAt: "",
    progress: 0,
    message: "",
    buttonText: "Create",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    labelWidth: 0,
    delLoader:false,
    readyToRedirect:false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };


  openMindmap = () => {
    return <Redirect to="/treemindmap" />;
  };


  handleSubmit(event) {
    event.preventDefault();
    let orgId = parseInt(this.props.orgId);
    let apiPath = "";
    let successMessage = "";
    let method = "";

    this.setState({
      delLoader: true
    })

    if (orgId > 0) {
      // For updates
      apiPath = "/api/organizations/" + orgId;
      successMessage = "Organization updated."
      method = "POST";
    } else {
      // For create
      apiPath = "/api/organizations/";
      successMessage = "Organization created."
      method = "POST";
    }
    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
      .then(res => res.json())
      .then(organization => {
        this.setState({ delLoader: false })
        this.props.messages(successMessage);
        if (orgId > 0){}else {
           this.setState({  orgId: organization.orgId,organizationId: organization.id, message: successMessage })
           // this.props.history.push({pathname: '/organization/', state: {organizationId:organization.id }})

           setTimeout(()=>this.setState({readyToRedirect:true}),500);
        }
     })
        .catch(err => {
          this.setState({ message: "Error occurred.",delLoader: false });
        });
    }, 2000);
  }

  componentDidMount() {
    let orgId = parseInt(this.props.orgId);
    if (orgId > 0) {
      fetch(`/api/organizations/${orgId}`)
        .then(res => res.json())
        .then(organization => {
          this.setState({
            name: organization.name,
            orgId: organization.orgId,
            projects: organization.projects,
            persons: organization.persons,
            organization: organization,
            buttonText: "Update"
          });
        });
    } else {
      this.setState({
        isEditing: true,
        buttonText: "Create"
      });
    }
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;
    const {readyToRedirect,organizationId } =this.state;
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }


    if(readyToRedirect){
      return (
        <Redirect
          to={{
            pathname: "/orgdashboard",
            state: {
              redirect:"/organization",
              organizationId
            }
          }}
        />
      );
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
              id="name"
              label="Name"
              onChange={this.handleChange("name")}
              value={this.state.name}
              className={classes.textField}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid> 
          <Grid item xs={12} sm={6}>
            {
              this.state.delLoader ?
                <CircularProgress /> :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  className={classes.outlinedButton}
                >
                {this.state.buttonText}
              </Button>
            }
            {/* Issue #63 GitLab */}
            {/* <Button
              variant="contained"
              color="primary"
              className={classes.outlinedButton}
              onClick={this.openMindmap}
            >
              Edit Mind Map
            </Button>
            <br /> */}
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default withRouter(withStyles(styles)(OrganizationDetail));