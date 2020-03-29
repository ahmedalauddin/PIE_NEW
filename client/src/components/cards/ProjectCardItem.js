import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DescriptionIcon from "@material-ui/icons/Description";
import moment from "moment";
import styles from "../styles/CardStyles";
import { Link } from "react-router-dom";

class ProjectCardItem extends Component {
  render() {
    //Card item is just enclosed with a <div>
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Link to={`/projectcard/${this.props.projid}`}>
            <Avatar className={classes.avatar}>
              <DescriptionIcon />
            </Avatar>
          </Link>
          <Typography
            style={{ textTransform: "uppercase" }}
            color="secondary"
            gutterBottom
          >
            Project
          </Typography>
          <Typography variant="h6" gutterBottom>
            {this.props.title}
          </Typography>
          <Typography variant="h7" gutterBottom>
            {this.props.description}
          </Typography>
          <Typography variant="h7" gutterBottom>
            Start date: {moment(this.props.started).format("YYYY-MM-DD")}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(ProjectCardItem);
