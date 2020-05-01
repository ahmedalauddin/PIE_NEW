/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindMap.js
 * Descr:    Container page for D3 mind map.  The container contains the tree mind map (the actual D3 mond map),
 *           plus the tabs on the right for the mind map node detail (node name, descrip, and associated KPI)
 *           and the prioritized KPI list.
 * Created:  2019-06-22
 * Author:   Brad Kaufman
 *
 * Modified: 2019-10-01
 * Changes:  Tabs for node detail and prioritzing KPIs.
 * Editor:   Brad Kaufman
 */
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "../Topbar";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import { red, grey } from "@material-ui/core/colors";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import { getOrgId, getOrgName, checkPermision, getMindmap, getMindmapNode } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import TreeMindMap from "./TreeMindMap";
import NodeDetail from "./NodeDetail";
import PrioritizeKpis from "./PrioritizeKpis";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  root: {
    height: "92vh"
  },
  paper: {
    padding: theme.spacing.unit * 3,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  /*
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
   */
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

class MindMap extends React.Component {
  constructor(props) {
    super(props);
    this.sendSelectedNode = this.sendSelectedNode.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      orgName: getOrgName(),
      orgId: getOrgId(),
      selectedNodeId: "",
      selectedNodeText: "",
      openSnackbar: false,
      message: "",
      tabValue: 0,
      selectedNodesCount: 0,
      map:null,
      showTree:false,
      nodeMetaData:{},
      kpisData:{}
    };
  };

  // This is the callback used by TreeMindMap.  Use this to get information from the TreeMindMap.
  async sendSelectedNode(nodeId, nodeText, mindmapId) {
    const kpi=await this.fetchKpi(nodeId);
    const {kpisData} = this.state;
    kpisData[nodeId]=kpisData[nodeId] || kpi;

    this.setState({
      selectedNodeId: nodeId,
      selectedNodeText: nodeText,
      mindmapId: mindmapId,
      kpisData
    });
  };

  updateSelectedNodesCount = (count) => {
    this.setState({
      selectedNodesCount: count
    })
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
    const mindmapId =  this.props.location.state ? this.props.location.state.mindmapId : ''; 

    if(mindmapId){
      fetch(`/api/mindmaps/${mindmapId}`)
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            response.json().then(map => {
            if (map) {
              let nodeMetaData={};
              if(map.mapData && map.mapData.nodeMetaData){
                nodeMetaData=map.mapData.nodeMetaData;
              }
              this.setState({map,showTree:true,mindmapId,nodeMetaData});
              setTimeout(async ()=>{
                const selectedNodeId=getMindmapNode().id;
                if(selectedNodeId){
                  const kpi=await this.fetchKpi(selectedNodeId);
                  const {kpisData} = this.state;
                  kpisData[selectedNodeId]=kpi;
                  this.setState({
                    selectedNodeId,
                    kpisData
                  });
                }
              },200)
            } else {
              this.setState({showTree:true,mindmapId})
            }
          });
        } else{
          this.setState({showTree:true})
        }
      }).catch(()=>this.setState({showTree:true}));
    }else{
      this.setState({showTree:true});
    }

  }

  async fetchKpi(selectedNodeId) {

    let res = await fetch(`/api/kpis-mindmapnode/${selectedNodeId}`);
    let kpis = await res.json();

    if (kpis && kpis.length > 0) {
      return {
        title: kpis[0].title,
        kpiId: kpis[0].id,
        description: kpis[0].description,
        project: kpis[0].project,
        projectDescription: kpis[0].projectDescription,
        formula: kpis[0].formulaDescription,
      }
    } else {
      return {}
    }

  }

  saveMindmap = (mapName,mapDescription,isNewMap) => {
    //this.saveNoteToJson();

    const { mindmapId,nodeMetaData } = this.state;
    const mapData = getMindmap();
    mapData.nodeMetaData=nodeMetaData;
    let postData = {
      orgId: this.state.orgId,
      mapData,
      mapName: mapName,
      mapDescription: mapDescription
    };

    // Method -- POST (create) or PUT (update) depending if we're working on a new mindmap.
    let method = (!isNewMap) ? "PUT" : "POST";
    let url = (!isNewMap) ? "/api/mindmaps/" + mindmapId : "/api/mindmaps";

    setTimeout(() => {
      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      })
        .then(response => response.json())
        .then(async response => {
          const kpisData=await this.saveKpis();
          if (isNewMap) {
            this.setState({
              openSnackbar: true,         // Success - open the snackbar
              message: "Mind map saved.",
              isNewMap: false,
              mindmapId: response.id,
              kpisData
            });
          } else {
            this.setState({
              openSnackbar: true,         // Success - open the snackbar
              message: "Mind map saved.",
              isNewMap: false,
              kpisData
            });
          }
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  }

  async saveKpis() {
    const {kpisData,orgId}=this.state;
    
    let nodeIds=Object.keys(kpisData);
    console.log("called saveKpis",kpisData)
    for(let n=0;n<nodeIds.length;n++){
      const mindmapNodeId=nodeIds[n];
      let kpi=kpisData[mindmapNodeId];
      
      if(!kpi.title || !kpi.formula || !kpi.description){
        continue;
      }

      console.log("Updating Kpi :: ",kpi.title);

      kpi.mindmapNodeId=mindmapNodeId;
      kpi.orgId=orgId;

      let kpiId=kpi.kpiId;
      let apiPath = "";
      let method = "";
      
      if (kpiId > 0) {
        apiPath = "/api/kpis/" + kpiId;
        method = "PUT";
      } else {
        method = "POST";
        apiPath = "/api/kpis";
      }

      try{

        const response=await fetch(apiPath, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kpi)
        })
        console.log("responseData",response);
        if(response.status ==200 || response.status ==201){
          const responseData=await response.json();
          kpi.kpiId=responseData.kpiId;
          console.log("responseData",responseData);
        }
      }catch(e){console.log(e)}
    }

    return kpisData;
   
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

  handleTabChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  }

  render() {
    const { classes } = this.props;
    const { map,mindmapId,showTree,nodeMetaData,selectedNodeId,kpisData } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={"/mindmaplist"}/>
        <div className={classes.root}>
          <Grid container className={classes.root} spacing={24}>
            <Grid item xs={false} sm={9} md={9} >
              {showTree && 
                <TreeMindMap map={map} 
                              saveMindmap={this.saveMindmap}
                              mindmapId={mindmapId} 
                              updateSelectedNodesCount={this.updateSelectedNodesCount} 
                              callback={this.sendSelectedNode.bind(this)} />}
            </Grid>
            <Grid item xs={false} sm={3} md={3} >
              <div className={classes.root}>
                <AppBar position="static" elevation={0}>
                  <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
                    <Tab label="Node" />
                    {checkPermision('Mind Map Prioritized KPI','read') && <Tab label="Prioritized KPIs" />}
                  </Tabs>
                </AppBar>
                {this.state.tabValue === 0 && (
                  <TabContainer>
                    {selectedNodeId && <NodeDetail onChangeKpisData={(data)=>this.setState({kpisData:data})}  onChangeNodeMetaData={(data)=>this.setState({nodeMetaData:data})} kpisData={kpisData} nodeMetaData={nodeMetaData} nodeId={selectedNodeId} mindmapId={mindmapId} messages={this.showMessages} selectedNodesCount={this.state.selectedNodesCount}/>}
                  </TabContainer>)}
                {this.state.tabValue === 1 && (
                  <TabContainer>
                    <PrioritizeKpis mindmapId={mindmapId} messages={this.showMessages}/>
                  </TabContainer>)}
              </div>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MindMap);
