import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";
import moment from "moment";
import styles from "../styles/CardStyles";

class ActionCardItem extends Component {
  render() {
    //Card item is just enclosed with a <div>
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Link to={`/actioncard/${this.props.actionid}`}>
            <Avatar aria-label="Detail" className={classes.avatar}>
              <DescriptionIcon />
            </Avatar>
          </Link>
          <Typography
            style={{ textTransform: "uppercase" }}
            color="secondary"
            gutterBottom
          >
            Action Item
          </Typography>
          <Typography variant="h6" gutterBottom>
            {this.props.title}
          </Typography>
          <Typography variant="h7" gutterBottom>
            {this.props.description}
          </Typography>
          <Typography variant="h8" gutterBottom>
            Status: {this.props.taskstatus}
          </Typography>
          <Typography variant="h8" gutterBottom>
            Updated: {moment(this.props.updated).format("YYYY-MM-DD")}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(ActionCardItem);
