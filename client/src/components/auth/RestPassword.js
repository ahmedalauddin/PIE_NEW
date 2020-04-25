/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/auth/RestPassword.js
 * Descr:    Change user password.
 * Created:  2019-06-01
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-06
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SectionHeader from "../typo/SectionHeader";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    paddingBottom: 200
  },
  grow: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});

class RestPassword extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    oldpassword: "",
    confirm: "",
    org: "",
    orgId: 0,
    organizations: [],
    isEditing: false,
    isNew: false,
    expanded: false,
    labelWidth: 0,
    passwordSent:false
  };

  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleSubmit(event) {
    event.preventDefault();
    let redirectTarget = "";

    // Authenticate against the username
    fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          console.log("RestPassword.js, logged in. Status = 200");
          return response.json();
        }
      })
      .then(user => {
      })
      .then(() => {
        
        this.setState({
          passwordSent: true
        });
        setTimeout(()=>window.history.back(),500);

      })
      .catch(err => {
        this.setState({
          isFailedLogin: true,
          msgText: "Login failed, please try again."
        });
      });
  }

  componentDidMount() {
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
       
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12} md={4}>
                <SectionHeader title="" subtitle="" />
                <Card className={classes.card} style={{minHeight:300}}>
                  <CardContent>
                  {!this.state.passwordSent ?
                    <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          component="h2"
                          color="secondary"
                          gutterBottom
                        >
                          Request new password.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          id="email"
                          label="Email Address"
                          onChange={this.handleChange("email")}
                          value={this.state.email}
                          className={classes.textField}
                          margin="normal"
                          />
                      </Grid>
                     
                      <Grid container xs={12} style={{flexDirection:"row"}}>
                      <Typography variant="h5" component="h2" style={{marginLeft:20}}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                          >
                            Submit
                          </Button>
                        </Typography>

                        <Typography variant="h5" component="h2" style={{marginLeft:20}}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>window.history.back()}
                            className={classes.secondary}
                          >
                            Cancel
                          </Button>
                        </Typography>

                        
                      </Grid>

                      </Grid>

:
                <Typography
                variant="h7"
                component="h7"
                color="secondary"
                gutterBottom
              >
                New password sent in email.
              </Typography>}
                    
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </form>
       
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(RestPassword);

