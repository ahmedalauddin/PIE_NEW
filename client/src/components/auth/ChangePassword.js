/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/auth/ChangePassword.js
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
import { getUser } from "../../redux";
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

class ChangePassword extends React.Component {
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
    passwordSent:false,
    openSnackbar: false,
    message: "",
    delLoader: false
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

  async handleSubmit(event) {
   event.preventDefault();
   this.setState({
    delLoader: true
  })
   const response = await fetch("/api/auth/changepassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
    
    if(response.ok){
      const mgs=await response.json();
      if(mgs.success){
        this.setState({ openSnackbar: true, message: mgs.message, delLoader: false , password: "",  oldpassword: "", confirm: "",});
      }else{
        this.setState({ openSnackbar: true, message: mgs.message, delLoader: false });
      }
    }else{
      this.setState({ openSnackbar: true, message: "something went wrong", delLoader: false });
    }
    
  }

  componentDidMount() {
    this.setState({email:getUser().email})
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
              <Card className={classes.card}>
                <CardContent>
                  <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        component="h2"
                        color="secondary"
                        gutterBottom
                      >
                        Change Password
                      </Typography>
                      <Typography variant="h7" component="h6" style={this.state.success?{color:'green'}:{color:'red'}} gutterBottom>
                        {this.state.msgText}
                      </Typography>
                    </Grid>
                   
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="oldpassword"
                          label="Old Password"
                          type="password"
                          onChange={this.handleChange("oldpassword")}
                          value={this.state.oldpassword}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid container xs={12} style={{flexDirection:"row",marginTop:20}}>
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

                      <Typography variant="h5" component="h2" style={{marginLeft:20}}>
                      {
                       this.state.delLoader ?
                        <CircularProgress /> :
                          
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                            disabled={this.state.oldpassword=='' || this.state.password=='' || this.state.password!=this.state.confirm}
                          >
                            Submit
                          </Button>
                            }
                        </Typography>

                        

                        
                      </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </form>
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

export default withStyles(styles)(ChangePassword);

