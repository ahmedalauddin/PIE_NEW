/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Login.js
 * Descr:    Login component, authenticates the user into the app.
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Descr:    Login and authentication for the app.
 * -----
 * Modified: 2019-04-17
 * Editor:   Brad Kaufman
 */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { store, setUser, setOrg, isAdministrator, setProjectListFilter, isLoggedIn,checkPermision } from "../../redux";

class Login extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    email: "",
    pwdhash: "",
    password: "",
    isEditing: false,
    isUserLoggedIn: false,
    isFailedLogin: false,
    readyToRedirect: false,
    redirectTarget: "",
    userData: "",
    storeUser: "",
    expanded: false,
    labelWidth: 0,
    msgText: "",
    disableButton:false
  };

  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    let redirectTarget = "";
    this.setState({ disableButton: true });
    // Authenticate against the username
    fetch("/api/auth/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        this.setState({ disableButton: false }); 
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          response.json().then(res => {
            if (res.success === false) {
              this.setState({
                isFailedLogin: true,
                msgText: (res.message) ? "Email or password is incorrect" : res.err
              });
            }
          });
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          console.log("Login.js, logged in. Status = 200");
          return response.json();
        }
      })
      .then(user => {
        // Use Redux to save the user information.
        store.dispatch(setUser(JSON.stringify(user)));
        // Initialize project filters for the Redux store.
        let status = [];
        let startYear = [];
        let endYear = [];
        let filters = { status, startYear, endYear };
        store.dispatch(setProjectListFilter(filters));

        console.log("Login.js, user:" + JSON.stringify(""));
        if (!isAdministrator()) {
          store.dispatch(setOrg(JSON.stringify(user.organization)));
          console.log("Login.js, non-admin, organization:" + JSON.stringify(user).organization);
        }
      })
      .then(() => {
        console.log("Ready to redirect");
        if (!isAdministrator()) {
          if(checkPermision('Dashboard','read')){
            redirectTarget = "/paneldashboard";
          }else if(checkPermision('Mind Map','read')){
            redirectTarget = "/mindmaplist";
          }else if(checkPermision('Regrouping','read')){
            redirectTarget = "/organizationactions";
          }else if(checkPermision('Search','read')){
            redirectTarget = "/search";
          }else if(checkPermision('Analytics','read')){
            redirectTarget = "/analytics";
          }else if(checkPermision('Organization','read')){
            redirectTarget = "/organization";
          }else if(checkPermision('About','read')){
            redirectTarget = "/about";
          }
        } else {
          redirectTarget = "/clientorg";
        }
        this.setState({
          isUserLoggedIn: true,
          readyToRedirect: true,
          redirectTarget: redirectTarget
        });
      })
      .catch(err => {
        // this.setState({
        // isFailedLogin: true,
        // msgText: "Login failed, please try again."
        // });
      });
  }

  componentDidMount() { }

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to={this.state.redirectTarget} />;
    }

    if (isLoggedIn()) {
      let redirectTarget = "";
      if (!isAdministrator()) {
          
        if(checkPermision('Dashboard','read')){
          redirectTarget = "/paneldashboard";
        }else if(checkPermision('Mind Map','read')){
          redirectTarget = "/mindmaplist";
        }else if(checkPermision('Regrouping','read')){
          redirectTarget = "/organizationactions";
        }else if(checkPermision('Search','read')){
          redirectTarget = "/search";
        }else if(checkPermision('Analytics','read')){
          redirectTarget = "/analytics";
        }else if(checkPermision('Organization','read')){
          redirectTarget = "/organization";
        }else if(checkPermision('About','read')){
          redirectTarget = "/about";
        }
      } else {
        redirectTarget = "/clientorg";
      }
      this.setState({
        isUserLoggedIn: true,
        readyToRedirect: true,
        redirectTarget: redirectTarget
      });
    }

    return (
      <React.Fragment  >
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <form onSubmit={this.handleSubmit} noValidate >
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                <Grid item xs={12} md={6}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h5" component="h2" color="secondary" gutterBottom>
                        Please login
                      </Typography>
                      
                      <Typography variant="h6" component="h2" color="secondary" gutterBottom>
                        {this.state.msgText}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="email"
                          label="Email"
                          fullWidth
                          onChange={this.handleChange("email")}
                          value={this.state.email}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          fullWidth
                          id="password"
                          label="Password"
                          type="Password"
                          onChange={this.handleChange("password")}
                          value={this.state.password}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <div className={classes.spaceTop}>
                          <br />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                            disabled={this.state.disableButton}
                          >
                            Submit
                          </Button>
                        </div>
                      </Typography>
                      <Typography component="div">
                        <br /><br />
                         <Link to={`/password`}>Forgot password?</Link> 
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </form>
      </React.Fragment>


    );
  }
}

export default withStyles(styles)(Login);
