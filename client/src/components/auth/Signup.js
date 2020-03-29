/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import MenuItem from "@material-ui/core/MenuItem/index";
import TextField from "@material-ui/core/TextField/index";
import InputLabel from "@material-ui/core/InputLabel/index";
import FormControl from "@material-ui/core/FormControl/index";
import Select from "@material-ui/core/Select/index";
import Button from "@material-ui/core/Button/index";
import { Link, Redirect } from "react-router-dom";

class Signup extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    org: "",
    orgId: 0,
    organizations: [],
    isEditing: false,
    isNew: false,
    expanded: false,
    labelWidth: 0
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
    if(this.state.password.length < 6){
      this.setState({
        msgText: "Password must be more than 6 characters."
      });
    }else if(this.state.password !== this.state.confirm){
  this.setState({
    msgText: "Please check password and confirm password."
  });
}else if(this.state.lastName.length < 1 || this.state.lastName.length > 27 || this.state.firstName.length < 1 || this.state.firstName.length > 27){
  this.setState({
    msgText: "First & Last name must between at 1 and 128 characters."
  });
}else if(this.state.orgId === 0 || this.state.orgId === undefined){
  this.setState({
    msgText: "Please select organization."
  });
}else if (this.state.email === '' || (this.state.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email))) {
    this.setState({
      msgText: 'Invalid email address'
    });
  
}else
    {
    setTimeout(() => {
      // This uses the Person Create function.
      fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
         
          data.json().then(res => {
            if (data.status !== 201) {
              this.setState({
                msgText: (res.errors && res.errors[0].message) ? res.errors[0].message : "Something went wrong."
              });
            }

            if (data.status === 201) {
              this.setState({
                msgText: "Successfully signed up.",
                readyToRedirect: true,
                redirectTarget: "/login"
              });


            }
          });
          
        })
        .catch(err => {
          console.log("Signup error: " + err);
        });
      //}
      //setSubmitting(false);
    }, 500);
  }
  }

  componentDidMount() {
    if (parseInt(this.props.match.params.id) > 0) {
      fetch(`/api/persons/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(person => {
          this.setState({
            id: this.props.match.params.id,
            email: person.email,
            firstName: person.firstName,
            lastName: person.lastName,
            orgId: person.orgId,
            pwdhash: person.pwdhash
          });
          //alert('project.orgId = ' + this.state.orgId + ', title = ' + this.state.title + ', org = ' + this.state.org);
        });
    } else {
      this.setState({ isEditing: true });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => {
        this.setState({ organizations });
      });
  }

  render() {
    const { classes } = this.props;

    if (this.state.readyToRedirect) {
      return <Redirect to={this.state.redirectTarget} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={12}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                    <Typography variant="h6" component="h2" color="secondary" gutterBottom>
                        {this.state.msgText}
                      </Typography>
                      <Typography
                        style={{ textTransform: "uppercase" }}
                        color="secondary"
                        gutterBottom
                      />
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="firstName"
                          label="First Name"
                          onChange={this.handleChange("firstName")}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="lastName"
                          label="Last Name"
                          onChange={this.handleChange("lastName")}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="email"
                          label="Email Address"
                          onChange={this.handleChange("email")}
                          value={this.state.email}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="password"
                          label="Password"
                          type="password"
                          onChange={this.handleChange("password")}
                          value={this.state.password}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="confirm"
                          label="Confirm password"
                          type="password"
                          onChange={this.handleChange("confirm")}
                          value={this.state.confirm}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="org-simple">
                            Organization
                          </InputLabel>
                          <Select
                            value={this.state.orgId}
                            onChange={this.handleSelectChange}
                            inputProps={{
                              name: "orgId",
                              id: "org-simple"
                            }}
                          >
                            {this.state.organizations.map(org => {
                              return (
                                <MenuItem key={org.id} value={org.id}>
                                  {org.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <br />
                        <br />
                        <br />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <div className={classes.spaceTop}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                          >
                            Submit
                          </Button>
                        </div>
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

export default withStyles(styles)(Signup);

/*
getOrgFromEmail = () => {
    // Figure out what the organization is from the email address.
    const emailParsed = EmailAddresses.parseOneAddress(this.state.email);
    const domain = emailParsed.domain;
    var domainarr = [];
    domainarr = domain.split('.');
    const company = domainarr[domainarr.length-2];
    alert('company: ' + company);
    var orgId = 1;

    var orgPath = '/api/organization/name/' + company;
    alert('orgPath: ' + orgPath);
    setTimeout(() => {
        fetch(orgPath)
            .then(res => res.json())
            .then(results => {
                orgId = results.id;
            });
    }, 2000);

    return(orgId);
}
*/
