import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import { styles } from "../styles/MaterialSense";
import Topbar from "../Topbar";
import IframeComponent from "../iframe/IframeComponent";
import "../iframe/IframeSytyle.css";

class Analytics extends Component {
  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    // return <Redirect to="/Login" />;
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div>
          <IframeComponent src="http://ec2-13-59-69-6.us-east-2.compute.amazonaws.com:8088" height="100%" width="100%"/>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Analytics);
