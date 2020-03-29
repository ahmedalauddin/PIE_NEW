/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/PrioritizeKpis.js
 * Created:  2019-07-08
 * Descr:    List prioritized KPIs.
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-09-23
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import {getOrgId } from "../../redux";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

//<editor-fold desc="Non-class react-beautiful-dnd methods">
const getItems = count =>
  Array.from({length: count}, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const styles = theme => ({
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
    display: "flex",
    flexDirection: "column",
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
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
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

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 3,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "lightgrey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: 500
});

//</editor-fold>

class PrioritizeKpis extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchKpis = this.fetchKpis.bind(this);
    this.findIndexSubmitted = this.findIndexSubmitted.bind(this);
    this.fetchOrganizationKpiLock = this.fetchOrganizationKpiLock.bind(this);
    this.updatePrioritizationLock = this.updatePrioritizationLock.bind(this);
    this.saveKpiPriorities = this.saveKpiPriorities.bind(this);
    this.state = {
      items: getItems(10),
      kpis: [],
      /* kpis: [{
        id: "",
        title: "",
        orgPriority: "",
        projId: "",
        projTitle: "",
        projDescription: ""
      }], */
      kpiProjectSubmitted: null,
      indexSubmitted: null,
      message: "",
      orgName: "",
      orgId: getOrgId(),
      orgKpiPriorityLock: false,
      lockPrioritization: false,
      dragDisabled: false,
      helpText: "",
      lockButtonText: ""
    };
  };

  static propTypes = {
    mindmapId: PropTypes.number.isRequired
  };

  //<editor-fold desc="Fetch methods">
  fetchKpis() {
    // Fetch KPIs by priority
    let organizationId = getOrgId();

    if (organizationId > 0) {
      // Fetch the KPIs only for an organization by priority
      fetch(`/api/kpis-orgpriority/${organizationId}`)
        .then(res => res.json())
        .then(kpis => this.setState({
          kpis: kpis
        }))
        .then( () => {
          console.log("testing");
        });
    }
  };

  fetchOrganizationKpiLock() {
    // Fetch organization to see if its Kpi prioritization is locked
    let organizationId = getOrgId();
    console.log("org Id is" + organizationId);

    if (organizationId > 0) {
      // Fetch the KPIs only for an organization by priority
      fetch(`/api/organizations-kpilock/${organizationId}`)
        .then(res => res.json())
        .then(org => {
          let helpText = "";
          let lockButtonText = "";
          let dragDisabled = null;
          if ((org[0].lockPrioritization === true) || (org[0].lockPrioritization === 1)) {
            helpText = "Unlock prioritization to enable reordering KPI priorities.";
            lockButtonText = "Unlock Prioritization";
            dragDisabled = true;
          } else {
            helpText = "Drag KPIs up and down to reorder their priorities.";
            lockButtonText = "Lock Prioritization";
            dragDisabled = false;
          }

          this.setState({
            orgName: org[0].name,
            orgKpiPriorityLock: org[0].lockPrioritization,
            helpText: helpText,
            lockButtonText: lockButtonText,
            dragDisabled: dragDisabled
          });
          console.log("fetchOrganizationKpiLock, lockPrioritization selected is:" + org[0].lockPrioritization);
        });
    }
  };

  //</editor-fold>

  //<editor-fold desc="Component and other methods">
  componentDidMount() {
    this.fetchKpis();
    this.fetchOrganizationKpiLock();
  };

  handleChange = (i, name) => event => {
    console.log("name: " + [name]);
    console.log("event.target.id: " + event.target.id);

    // get index from the control's id.
    var position = event.target.id.indexOf("-");
    var index = event.target.id.substring(position+1, position+10);

    let kpisCopy = JSON.parse(JSON.stringify(this.state.kpis));

    console.log("control's index is: " + index);

    if (name === "projDescription") {
      kpisCopy[index].projDescription = event.target.value;
    } else if (name === "projTitle") {
      kpisCopy[index].projTitle = event.target.value;
    } else {
      console.log("control's index is: " + index);
    }
    this.setState({
      kpis: kpisCopy
    });
  };
  //</editor-fold>

  //<editor-fold desc="Submit and API update methods">
  updatePrioritizationLock() {
    const orgId = getOrgId();
    let successMessage = "";

    setTimeout(() => {
      fetch("/api/org-save-prioritization-lock/" + orgId, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(() => {
          console.log("Going to log message: " + successMessage);
          this.setState({
            message: successMessage,
            // readyToRedirect: true
          });
        })
        .then(updated => {
          this.fetchOrganizationKpiLock();
        })
        .catch(err => {
          this.setState({message: "Error occurred."});
        });
    }, 2000);
  }

  saveKpiPriorities() {
    const orgId = getOrgId();
    let successMessage = "";

    setTimeout(() => {
      fetch("/api/kpis-save-priorities/" + orgId, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(() => {
          console.log("Going to log message: " + successMessage);
          this.setState({
            message: successMessage,
            // readyToRedirect: true
          });
        })
        .catch(err => {
          this.setState({message: "Error occurred."});
        });
    }, 2000);
  };

  //</editor-fold>

  // Use the kpiId submnitted to determine the index in the control array.
  findIndexSubmitted = (kpiId) => {
    let index = "";
    for (let i=0; i<this.state.kpis.length; i++) {
      if (this.state.kpis[i].id === kpiId) {
        index = i;
        break;
      }
    }
    return index;
  }

  // This function is for the snackbar messages.
  anotherFunction = () => {
    this.props.showMessages(this.state.message);
  };

  // Handle submit of a project as main KPI for one of the selected KPI sections.
  handleSubmit = (kpiId) => (event) => {
    // Add the index to state so we know what we are submitting.
    let successMessage = "";
    let index = this.findIndexSubmitted(kpiId);
    this.setState({
      kpiProjectSubmitted: kpiId,
      indexSubmitted: index
    });

    console.log("JSON state: " + JSON.stringify(this.state));
    setTimeout(() => {
      fetch("/api/projects-add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then( () => {
          successMessage = "Project " + this.state.kpis[index].projTitle + " saved.";
          console.log("Going to log message: " + successMessage);
          this.setState({
            message: successMessage
          });
          this.props.messages(successMessage);
        })
        .catch(err => {
          this.setState({message: "Error occurred."});
        });
    }, 2000);
  };

  //<editor-fold desc="Drag and drop methods">
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const kpis = reorder(
      this.state.kpis,
      result.source.index,
      result.destination.index
    );

    this.setState({
      kpis
    });
    this.saveKpiPriorities();
  }

  //</editor-fold>

  render() {
    const {classes} = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    console.log("Org KPI priority lock is: " + this.state.orgKpiPriorityLock);

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.helpText}
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.kpis.map((kpi, index) => (
                  <Draggable key={kpi.id} draggableId={kpi.id} index={index} isDragDisabled={this.state.dragDisabled}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <ExpansionPanel>
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <div className={classes.column}>
                              <Typography className={classes.heading}>
                                <strong>{kpi.title}</strong>
                              </Typography>
                              <Typography className={classes.secondaryHeading}>
                                {kpi.description}
                              </Typography>
                            </div>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails className={classes.details}>
                            <form onSubmit={this.handleSubmit} noValidate>
                              <Typography className={classes.secondaryHeading}>
                                <input type="hidden" name="kpiId" value={kpi.id}/>
                                <TextField
                                  id={`title-${index}`}
                                  label="Project Title"
                                  onChange={this.handleChange(index, "projTitle")}
                                  value={kpi.projTitle}
                                  fullWidth
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                                <TextField
                                  id={`description-${index}`}
                                  label="Description"
                                  onChange={this.handleChange(index, "projDescription")}
                                  value={kpi.projDescription}
                                  fullWidth
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  value={kpi.id + "-index-" + index}
                                  onClick={this.handleSubmit(kpi.id)}
                                  className={classes.secondary}
                                >
                                  Add or Update Project
                                </Button>
                              </Typography>
                            </form>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          variant="contained"
          color="primary"
          onClick={this.updatePrioritizationLock}
          className={classes.secondary}
        >
          {this.state.lockButtonText}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(PrioritizeKpis);
