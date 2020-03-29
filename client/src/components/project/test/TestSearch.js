/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/kpi/Search.js
 * Descr:    Search component for KPIs.
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Descr:    Login and authentication for the app.
 * -----
 * Modified: 2019-04-17
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../../Topbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import { fade } from "@material-ui/core/styles/colorManipulator";
import FormControlLabel from "@material-ui/core/FormControlLabel";



const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  controlBlock: {
    alignItems: 'bottom',
},
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class TestSearch extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    searchText: "",
    searchString: "",
    kpis: [],
    checkedOrg: false
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

    let searchText = this.state.searchText;
    if (searchText != "") {
      this.setState({searchString: searchText});
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center" alignItems="baseline">
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h5"
                    component="h2"
                    color="secondary"
                    gutterBottom
                  >
                    Search KPIs
                  </Typography>

                        <form className={classes.container} noValidate autoComplete="off">
                          <div>

                            <TextField
                              id="searchText"
                              label="Search"
                              className={classes.textField}
                              value={this.state.searchText}
                              onChange={this.handleChange("searchText")}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={this.state.checkedOrg}
                                  onChange={this.handleChange("checkedOrg")}
                                  value="checkedOrg"
                                  color="primary"
                                />
                              }
                              label="Search current client only"
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={this.handleSubmit}
                              className={classes.secondary}
                            >
                              Submit
                            </Button>
                          </div>
                        </form>
                        <Typography>
                          Search results here
                        </Typography>


                </Grid>
              </Grid>
            </Grid>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TestSearch);
