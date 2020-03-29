/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/TestProject.js
 * Descr:    Test harness for the Project component.
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-19
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../../Topbar";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName, getOrgDepartments } from "../../../redux";
import ProjectActions from "../ProjectActions";
import ProjectPersons from "../ProjectPersons";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "../../typo/SectionHeader";
import { red } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import AppBar from '@material-ui/core/AppBar';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import MenuItem from '@material-ui/core/MenuItem';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { getSorting, stableSort } from "../../TableFunctions";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KpiTable from "../../kpi/KpiTable";
import ActionTable from "../ActionTable";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/*
const styles = theme => ({
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
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  }
});
*/

const styles = theme => ({
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
    flexBasis: '15%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '15%',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
});

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const rows = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  { id: "title", numeric: false, disablePadding: true, label: "KPI" },
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: "Description"
  },
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: "Type"
  }
];

class MyTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}


class TestProject extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
  }

  handleSubmit(event) {

  };

  handleChange = (event, value) => {
    //this.setState({ value });
  };

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  setOrganizationInfo = () => {
    this.setState({
      orgName: "Testing Org",
      orgId: 2
    });
  };

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    organizations: [],
    departments: [],
    projid: 0,
    kpis: [],
    title: "",
    businessGoal: "",
    expanded: null,
    org: "",
    orgId: "",
    orgName: "",
    description: "",
    value: 0,
    hasError: ""
  };


  componentDidMount() {
    this.setOrganizationInfo();
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { expanded } = this.state;
    const currentPath = this.props.location.pathname;
    let projId = this.props.match.params.id;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                check font
                <form onSubmit={this.handleSubmit} noValidate>
                  {this.state.msg}
                  <TextField
                    required
                    id="title-required"
                    label="Project Title"
                    onChange={this.handleChange("title")}
                    value={this.state.title}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="description"
                    label="Description"
                    multiline
                    rowsMax="6"
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="businessGoal"
                    label="Business Goal"
                    multiline
                    rowsMax="4"
                    value={this.state.businessGoal}
                    onChange={this.handleChange("businessGoal")}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                 <Grid container lg>
                  <Grid item sm>
                    <Typography component="p">
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="kpi-simple">
                          Main KPI
                        </InputLabel>
                        <Select
                          value={this.state.mainKpiId}
                          inputProps={{
                            name: "mainKpiId",
                            id: "mainKpiId"
                          }}
                        >

                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      <Typography variant="h5" component="h2">
                        <TextField
                          id="standard-required"
                          label="Progress"
                          onChange={this.handleChange("progress")}
                          value={this.state.progress}
                          className={classes.textField}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                %
                              </InputAdornment>
                            )
                          }}
                        />
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item sm>
                    <Typography component="p">
                      <TextField
                        id="startAt"
                        label="Start Date"
                        type="date"
                        value={this.state.startAt}
                        onChange={this.handleChange("startAt")}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Typography>
                    <Typography component="p">
                      <TextField
                        id="endAt"
                        label="End Date"
                        type="date"
                        value={this.state.endAt}
                        onChange={this.handleChange("endAt")}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
                  <div className={classes.spaceTop}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSubmit}
                      className={classes.secondary}
                    >
                      {this.state.buttonText}
                    </Button>
                  </div>
                </form>
              </Paper>
            </Grid>
            <Grid item lg={10}>
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handlePanelChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>KPIs</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Fab component={Link} color="primary" aria-label="Add" to={`/kpicard`} className={classes.fab}>
                    <AddIcon />
                  </Fab>
                  <KpiTable/>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handlePanelChange('panel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Actions</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Fab component={Link} color="primary" aria-label="Add" to={`/action`} className={classes.fab}>
                    <AddIcon />
                  </Fab>
                  <ActionTable/>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handlePanelChange('panel3')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>People</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Fab component={Link} color="primary" aria-label="Add" to={`/kpicard`} className={classes.fab}>
                    <AddIcon />
                  </Fab>
                  Some text here. Some text here. Some text here. Some text here. Some text here. ome text here. Some text here.
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TestProject);
