import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName, getOrgDepartments } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import PageTitle from "../PageTitle";
const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    paddingBottom: 200
  },
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
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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



class OrganizationMemberAction extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
   this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    
  }
 
  state = {
    title: "",
    description: "",
    orgId: 0,
    status: 'Open',
    persons: [],
    assigneeId: null,
    project: {},
    openSnackbar: false,
    snackbarMessage: "",
    message: "",
    delLoader:false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleStatusChange = event => {
    this.setState({status: event.target.value});
  };



  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

 

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };
  handlePersonChange = event => {
    this.setState({assigneeId: event.target.value});
  };



  componentDidMount() {
    let orgName = getOrgName();
    let orgId = getOrgId();
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });

    this.setState({
      isEditing: true,
      orgId: orgId,
      buttonText: "Create"
    });
    
   
  }

  render() {
    const { classes } = this.props;
 
    return (
     
                <form  noValidate>
                  
                  <Grid container spacing={24}>
                    <Grid item sm={10}>
                      <TextField
                        required
                        id="title-required"
                        label="Title"
                        fullWidth
                        onChange={this.handleChange("title")}
                        value={this.state.title}
                        className={classes.textFieldWide}
                        margin="normal"
                      />
                    </Grid>
                    

                    

                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                      >
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="Status">Status</InputLabel>
                        <Select
                          value={this.state.status && this.state.status}
                          onChange={this.handleStatusChange}
                          inputProps={{
                            name: "status",
                            id: "status"
                          }}
                        >
                          <MenuItem key='Open' value='Open'>
                                Open
                              </MenuItem>

                              <MenuItem key='Closed' value='Closed'>
                              Closed
                              </MenuItem>
                            
                        </Select>
                      </FormControl>
                  
                      <Typography component="p">
                      {
                        this.state.delLoader ?
                        <CircularProgress /> :
                          <Button
                            variant="contained"
                            color="primary"
                           
                            className={classes.secondary}
                          >
                            Save
                          </Button>
                        }
                      </Typography>
                      <br />
                    </Grid>
                  </Grid>
                </form>
              
    );
  }
}

export default withStyles(styles)(OrganizationMemberAction);
