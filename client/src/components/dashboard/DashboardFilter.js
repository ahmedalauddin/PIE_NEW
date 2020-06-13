/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/DashboardFilter.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-06-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-03
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import {getOrgId, setProjectListFilter, store} from "../../redux";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { styles } from "../styles/DashboardStyles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
};
const statuses = [
  "Approved",
  "Not Approved",
  "In Progress",
  "Completed",
  "Postponed"
];

const divStyle = {
  background: '#fff',
  display: 'flex',
  margin: '0px 0px 15px 0px',
  alignItems: 'center',
  flexGrow: '0',
  maxWidth: '83%',
  flexBasis: '83%',
  justifyContent: 'center',
};


class DashboardFilter extends Component {
  constructor(props) {
    super(props);
    this.updateFilterValues = this.updateFilterValues.bind(this);
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization:"",
      orgName: "",
      isClicked: false,
      selected: [],
      selectedYrs: [],
      projects: [],
      projectId: null,
      readyToEdit: false,
      yearList: [],
      status: [],
      startYear: [],
      endYear: [],
      readyToRedirect: false,
      selectChips: null,
      toProject: false,
      toProjectId: "",
      hasError: false
    };
  }
  handleStatusChange = event => {
    this.setState({ status: event.target.value });
  };

  handleStartYearChange = event => {
    this.setState({ startYear: event.target.value });
  };

  handleEndYearChange = event => {
    this.setState({ endYear: event.target.value });
  };

  updateFilterValues() {
    // We'll use Redux to update the filter.  These are arrays of filter values for status, etc.
    let status = this.state.status;
    let startYear = this.state.startYear;
    let endYear = this.state.endYear;

    let filters = {status, startYear, endYear};
    store.dispatch(setProjectListFilter(filters));
  };

  componentDidMount() {
    // Get the organization from the filter.
    let fetchUrl = "/api/projects-years";
    if (!this.props.allClients) {
      fetchUrl += "/" + getOrgId();
    }

    // Get list of years for filtering.
    fetch(fetchUrl)
      .then(res => {
        return res.json();
      })
      .then(years => {
        let beginYear = years[0].beginYear;
        let endYear = years[0].endYear;
        let yearList = [];
        let i = 0;
        for (var yr = beginYear; yr <= endYear; yr++) {
          yearList[i] = yr;
          i++;
        }
        this.setState({
          yearList: yearList,
        });
      });
  };

  render() {
    const { classes } = this.props;
console.log("this.state.status",this.state.status);
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <Grid container direction="row" justify="center" alignItems="flex-end" className="dash">
        <div style={divStyle}> 
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="selectChips">Status</InputLabel>
              <Select
                multiple
                value={this.state.status}
                onChange={this.handleStatusChange}
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
                {this.state.yearList.map(year => (
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
                {this.state.yearList.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Filter projects ending in year</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.isClicked}
                onClick={this.updateFilterValues}
                className={classes.secondary}
              >
                Update Results
              </Button>
            </FormControl>
          </Grid>
        </div>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DashboardFilter);
