import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BaseDialog from "./BaseDialog";

const styles = theme => ({
  container: {
    maxWidth: 600,
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  bottomMargin: {
    marginBottom: theme.spacing.unit * 2
  }
});

class DeleteOrganizationDialog extends Component {




  render() {
    const { classes,heading,deleteId } = this.props;
    return (
      <BaseDialog {...this.props}>
        <div className={classes.bottomMargin}>
          <Typography variant="body1" gutterBottom>
            {heading}
          </Typography>
        </div>
        <Button
          // component={Link}
          // to="/dashboard"
          className={classes.bottomMargin}
          variant="contained"
          onClick={() => this.props.closeFunction()}
          color="primary"
          autoFocus
        >
          No, Don't delete
        </Button>
        <Button
          // component={Link}
          // to="/dashboard"
          variant="outlined"
          onClick={() => this.props.delFunction(deleteId)}
          color="primary"
          autoFocus
        >
          Yes I'm Sure
        </Button>
      </BaseDialog>
    );
  }
}

export default withRouter(withStyles(styles)(DeleteOrganizationDialog));
