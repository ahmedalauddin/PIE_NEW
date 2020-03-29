import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from '@material-ui/core/FormHelperText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const statuses = [
  "Approved",
  "Not Approved",
  "In Progress",
  "Completed",
  "Postponed"
];

const years = [
  "2011",
  "2012",
  "2013",
  "2014",
  "2015"
];

const rows = [
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "task", numeric: false, disablePadding: true, label: "Pending Action" },
  { id: "owners", numeric: false, disablePadding: true, label: "Owners" },
  { id: "audience", numeric: false, disablePadding: true, label: "Audience" },
  { id: "mainKpi", numeric: false, disablePadding: true, label: "Targeted KPI" },
  { id: "progress", numeric: true, disablePadding: false, label: "Progress" },
  { id: "start", numeric: false, disablePadding: true, label: "Start Date" },
  { id: "end", numeric: false, disablePadding: true, label: "End Date" }
];

const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "flex-end",
  },
  filters: {
    alignItems: "flex-end",
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 170,
    maxWidth: 450,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

var msg = "";

class Test1 extends Component {
  constructor(props) {
    super(props);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    selected: [],
    selectedYrs: [],
    projects: [],
    yearList: [],
    status: [],
    startYear: [],
    endYear: [],
    projectId: null,
    readyToRedirect: false,
    readyToEdit: false,
    selectChips: null,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false
  };

  componentDidMount() {
  };

  handleClick = (event, id) => {};


  handleChange = event => {
    this.setState({ status: event.target.value });
  };

  handleStartYearChange = event => {
    this.setState({ startYear: event.target.value });
  };

  handleEndYearChange = event => {
    this.setState({ endYear: event.target.value });
  };

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  }

  renderEditRedirect = () => {

  }

  handleUpdate = (event) => {

  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Typography
                variant="subtitle1"
                color="secondary"
                gutterBottom
              >
                All projects for ValueInfinity
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignSelf="end" alignItems="flex-end" item xs={12}>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="selectChips">Status</InputLabel>
                <Select
                  multiple
                  value={this.state.status}
                  onChange={this.handleChange}
                  input={<Input id="selectChips" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value =>
                        <Chip key={value} label={value} className={classes.chip} />
                      )}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Filter by status</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="yearStartFilter">Start year</InputLabel>
                <Select
                  multiple
                  value={this.state.startYear}
                  onChange={this.handleStartYearChange}
                  input={<Input id="yearStartFilter" />}
                  renderValue={selectedYrs => (
                    <div className={classes.chips}>
                      {selectedYrs.map(value =>
                        <Chip key={value} label={value} className={classes.chip} />
                      )}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {years.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Filter projects beginning in year</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="yearEndFilter">End year</InputLabel>
                <Select
                  multiple
                  value={this.state.endYear}
                  onChange={this.handleEndYearChange}
                  input={<Input id="yearEndFilter" />}
                  renderValue={selectedYrs => (
                    <div className={classes.chips}>
                      {selectedYrs.map(value =>
                        <Chip key={value} label={value} className={classes.chip} />
                      )}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {years.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Filter projects ending in year</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.secondary}
              >
                Update Results
              </Button>
            </Grid>
            <Grid item>
              Data goes here.
              <br/>
              <br/>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Test1);
