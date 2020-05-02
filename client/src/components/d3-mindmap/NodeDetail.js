/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/NodeDetail.js
 * Created:  2019-06-24
 * Descr:    Provides ability to create KPI and project from mindmap node.
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-01-11
 * Editor:   Brad Kaufman
 * Changes:  Adding selected node text.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { getOrgId, getMindmapNode, checkPermision } from "../../redux";
import { red } from "@material-ui/core/colors";
import * as jsonq from "jsonq";

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

class NodeDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kpiId: undefined,
      title: undefined,
      formula: undefined,
      description: undefined,
      orgId: 0,
      nodeDescription: getMindmapNode().description,
      mindmapNodeId: getMindmapNode().id,
      node: "",
      project: undefined,
      projectId: undefined,
      projectDescription: undefined,
      kpiSaveDisabled: false,
      hasError: "",
      startAt: "",
      endAt: "",
      message: "",
      buttonText: "Create KPI",
      isEditing: false,
      redirect: false,
      isNew: false,
      nodeMetaData:null,
      nodeId:null,
      nodeDescription:"",
      notes:"",
      kpi:{},
      orgId: getOrgId()
    };
  };

  //<editor-fold desc="Snackbar functions">
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  // This function is for the snackbar messages.
  anotherFunction = () => {
    this.props.showMessages(this.state.message);
  };

  // For the snackbar
  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };
  


  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  


  componentDidMount() {
    this.updateComponent();
  }

  componentDidUpdate(prevProps) {
    if(this.props.nodeId != prevProps.nodeId){
      this.updateComponent();
    }
  };

  updateComponent(){
    const {nodeMetaData,nodeId,kpisData} =this.props;
    let nodeDescription="";
    let notes="";
    if(!nodeMetaData[nodeId]){
      nodeMetaData[nodeId]={}
    }
    if(nodeMetaData[nodeId].nodeDescription){
      nodeDescription=nodeMetaData[nodeId].nodeDescription;
    }
    if(nodeMetaData[nodeId].notes){
      notes=nodeMetaData[nodeId].notes;
    }
    const kpi = kpisData[nodeId];
    const kpiId =kpi.kpiId || 0;
    const title =kpi.title || '';
    const formula =kpi.formula || '';
    const description =kpi.description || '';

    this.setState({ nodeMetaData,nodeId,nodeDescription,notes,kpisData,kpiId,title,formula,description })
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes,onChangeNodeMetaData,onChangeKpisData } = this.props;
    const {nodeMetaData,nodeId,nodeDescription,notes,kpisData,title,formula,description} =this.state;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <div className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {getMindmapNode().name}
              </Typography>
              <TextField
                id="nodeDescription"
                label="Node Description"
                onChange={(event)=>this.setState({nodeDescription:event.target.value})}
                onBlur={()=>{nodeMetaData[nodeId].nodeDescription=nodeDescription;onChangeNodeMetaData(nodeMetaData)}}
                value={nodeDescription}
                rowMax="6"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              
              <br />

            {checkPermision('Mind Map KPI','read') &&<>

              <TextField
                id="title"
                label="KPI Title"
                onChange={(event)=>this.setState({title:event.target.value})}
                onBlur={()=>{kpisData[nodeId].title=title;onChangeKpisData(kpisData)}}
                value={title}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="description"
                label="KPI Description"
                onChange={(event)=>this.setState({description:event.target.value})}
                onBlur={()=>{kpisData[nodeId].description=description;onChangeKpisData(kpisData)}}
                value={description}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="formula"
                label="KPI Formula"
                multiline
                rowsMax="4"
                value={formula}
                onChange={(event)=>this.setState({formula:event.target.value})}
                onBlur={()=>{kpisData[nodeId].formula=formula;onChangeKpisData(kpisData)}}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
             
              </>}
              <br/>
              <TextField
                id="outlined-multiline-static"
                label="Note"
                multiline
                rows={6}
                margin="normal"
                onChange={(event)=>this.setState({notes:event.target.value})}
                onBlur={()=>{nodeMetaData[nodeId].notes=notes;onChangeNodeMetaData(nodeMetaData)}}
                value={notes}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(NodeDetail);
