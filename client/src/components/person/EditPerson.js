// Simpler version of edit person, 1/22/19.
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/index";
import Typography from "@material-ui/core/Typography/index";
import { styles } from "../styles/MaterialSense";

class EditPerson extends React.Component {
  state = {
    person: ""
  };

  componentDidMount() {
    const url1 = "/api/persons/" + this.props.match.params.id;
    fetch(url1)
      .then(res => res.json())
      .then(person => this.setState({ person }));
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <form>
                      <Typography variant="body1" gutterBottom>
                        <label htmlFor="username">Username</label>
                        <br />
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={this.state.person.username}
                        />
                      </Typography>

                      <Typography variant="body1" gutterBottom>
                        <label htmlFor="firstName">First name</label>
                        <br />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={this.state.person.firstName}
                        />
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <label htmlFor="lastName">Last name</label>
                        <br />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={this.state.person.lastName}
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <label htmlFor="email">Email</label>
                        <br />
                        <input
                          id="email"
                          name="email"
                          type="text"
                          value={this.state.person.email}
                        />
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <button>Submit</button>
                      </Typography>
                    </form>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(EditPerson);
