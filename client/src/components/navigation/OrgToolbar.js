/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/naviagtion/OrgToolbar.js
 * Created:  2019-3-27
 * Author:   Brad Kaufman
 * Descr:    Tabbed navigation for card components.
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 * Notes:
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";
import styles from "../styles/ToolbarStyles";

class OrgToolbar extends Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, location } = this.props;

    return (
      <div className={classes.itemContainer}>
        <div className={classes.tabContainer}>
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All KPIs" component={Link} to={`/listkpis/${this.props.orgid}`} />
            <Tab label="New KPI" component={Link} to={{ pathname: '/kpicard', state: { projid: this.props.orgid} }}/>
            <Tab label="Projects" component={Link} to={`/listprojects/${this.props.orgid}`}/>
            <Tab label="New Project" component={Link} to={{ pathname: '/projectcard', state: { projid: this.props.orgid} }}/>
            <Tab label="Departments" component={Link} to={`/listdepts/${this.props.orgid}`}/>
            <Tab label="New Department" component={Link} to={{ pathname: '/deptcard', state: { projid: this.props.orgid} }}/>
            <Tab label="People" component={Link} to={`/listpersons/${this.props.orgid}`}/>
            <Tab label="New Person" component={Link} to={{ pathname: '/personcard', state: { projid: this.props.orgid} }}/>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OrgToolbar);
