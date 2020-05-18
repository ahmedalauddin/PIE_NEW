/**
 * Project:     valueinfinity-mvp
 * File:        /client/src/components/ClientOrg.js
 * Created:     2019-02-04
 * Author:      Brad Kaufman
 * Description: Filter client organization for VI personnel.  Sets the Redux store
 *              for organization.
 * -----
 * Modified:    2019-09-21
 * Editor:      Brad Kaufman
 * Changes:     Update to direct to mind map.
 */
import React from "react";
import { Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "../typo/SectionHeader";
import Button from "@material-ui/core/Button/index";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { setOrg, store } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";

const redirectComponent = "/mindmaplist";

class ClientOrg extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      id: "",
      organizations: [{id:0,name:'Select Organization'}],
      org: "",
      orgId: 0,
      expanded: false,
      readyToRedirect: false,
      labelWidth: 0,
      msgText: "",
      disableButton:false,
      openSnackbar: false,
      message: "",
      openDialog : false,
      deletemindMapId:''
    };
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

  enableButton = ()=>{
    setTimeout(() => {
      this.setState({ disableButton: false });
    },1500099);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ disableButton: true,openSnackbar: true,
      message: 'Please wait...' });
      this.enableButton();

    let orgId = this.state.orgId;
    // Fetch the organization selected.
    fetch("/api/organizations/" + orgId)
      .then(response => {
       console.log('response--',response);
        if (response.ok) {
          this.setState({ 
            openSnackbar: true,
            message: 'Please wait...' });
          
          // status code 200 is success.
          console.log("ClientOrg.js, org selected. Status = 200");
          return response.json();
        } else {
          this.setState({ disableButton: false,
            openSnackbar: true,
            message: "Something went wrong." });
          // alert(response.statusText);
          // here, we get out of the then handlers and
          // over to the catch handler
          throw new Error("Network response was not ok.");
        }
      })
      .then(orgData => {
        // console.log('then 2', orgData);
        this.setState({ disableButton: false });
        store.dispatch(setOrg(JSON.stringify(orgData)));
      })
      .then(response => {
        // console.log('then 3');
        this.setState({ readyToRedirect: true, disableButton:false,openSnackbar: true,
          message: 'Organization set Successfully.' });
      })
      .catch(err => {
        // console.log('catch--',err);
        this.setState({ readyToRedirect: false, disableButton:false,openSnackbar: true,
          message: 'Server error ('+err+').' });
      });
  }

  componentDidMount() {
    let message = "";
    if (this.props.location.state && this.props.location.state.message)  {
      message = this.props.location.state.message;
      this.setState({
        openSnackbar: true,
        message: message
      });
    }

    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => {
        organizations.unshift({id:0,name:'Select Organization'})
        this.setState({ organizations });
      });
  }


  showMessages = (message) => {
    // alert(message);
    this.setState( {
      openSnackbar: true,
      message: message
    });
  };

  // Functions for the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };



  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to={redirectComponent} />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
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
                <Grid item xs={12} md={4}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="h2"
                        color="secondary"
                        gutterBottom
                      >
                        Select client organization
                      </Typography>
                        <FormControl className={classes.formControl} style={{width:"100%"}}>
                          <InputLabel shrink htmlFor="org-simple">
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
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Snackbar
              open={this.state.openSnackbar}
              onClose={this.handleClose}
              TransitionComponent={this.state.Transition}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={<span id="message-id">{this.state.message}</span>}
            />
            </Grid>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ClientOrg);
