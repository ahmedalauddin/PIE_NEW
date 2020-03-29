/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/About.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24
 * Editor:   Brad Kaufman
 * Notes:
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "../typo/SectionHeader";
import Package from "../../../package.json";

class About extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    task: {},
    projectId: 0,
    title: ""
  };

  componentDidMount() {

  }

  render() {
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center" className={classes.root}>
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={8}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        color="secondary"
                        gutterBottom
                      >
                        About the ValueInfinity Innovation Platform<br/><br/>
                      </Typography>
                      <div>
                        <Typography variant="body2">
                          Version: {Package.version}<br/>
                          Build date: 1/19/2020
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body">
                          <ul>
                            <li>Add dropdown for person assigned to Gantt chart task</li>
                            <li>Changes to retrieve top three tasks for project dashboard from Gantt JSON array</li>
                            <li>Add people and departments on organization component </li>
                          </ul>
                        </Typography>
                      </div>
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

export default withStyles(styles)(About);
