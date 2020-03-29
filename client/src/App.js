/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/App.js
 * Created:  2019-02-16 23:32:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-04-04
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./stylesheets/App.css";
import "typeface-roboto";
import Routes from "./routes";
import { blue, indigo, grey } from "@material-ui/core/colors";
import { bindActionCreators } from "redux";
import { setUser, setOrg, setProjectStatusFilter, setProjectStartYearFilter,
  setProjectEndYearFilter, setMindmapNode, setMindmap } from "./redux";
import { connect } from "react-redux";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"SegoeUI"',
      '"Lato"',
      "sans-serif"
    ].join(",")
  }
});

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  organization: state.organization,
  mindmap: state.mindmap,
  mindmapNode: state.mindmapNode,
  projectFilter: state.projectFilter
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setUser, setOrg, setProjectStatusFilter, setProjectStartYearFilter,
    setProjectEndYearFilter, setMindmapNode, setMindmap }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


