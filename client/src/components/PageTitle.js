import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid/index";
import Divider from '@material-ui/core/Divider';
class PageTitle extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    pageTitle: 'Loading...'
  };

  render() {
    const { pageTitle } = this.props;
    
    
    return (
        <Grid item xs={12} md={10}>
        <Typography variant="subtitle1" color="secondary">
            {pageTitle}
        </Typography>
        </Grid>
    );
  }
}

export default withRouter(PageTitle);
