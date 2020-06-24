/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/Topbar.js
 * Created:  2019-03-23
 * Author:   Brad Kaufman
 * Desc:     Topbar menu for the application.
 *
 * Modified: 2020-01-18
 * Changes:  Adding logged in username (email address) the the app bar.
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import { isAdministrator, isLoggedIn, getUser,isCustomerAdmin,checkPermision } from "../redux";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button/index";
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
const profileLogo = require("../images/profile.png");
const logo = require("../images/ValueInfLogo.png");

const styles = theme => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    backgroundColor: "white"
  },
  productLogo: {
    display: 'inline-block',
    borderLeft: `1px solid ${theme.palette.grey['A100']}`,
    marginLeft: 32,
    paddingLeft: 24,
    [theme.breakpoints.up('md')]: {
      paddingTop: '1.5em'
    }
  },
  image: {
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  inline: {
    display: "inline"
  },
  flex: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center"
    }
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  tagline: {
    display: "inline-block",
    marginLeft: 10
  },
  iconContainer: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  iconButton: {
    float: "right"
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: "auto"
  },
  profileLogoMenu: {
    width: 30,
    height: 30,
    margin:10
  },
  profileLogoMenuContainer: {
  
    padding:0,
    width:48,
    margin:5,
    alignItems:"right",
    justifyContent:"right"
  },

  profileLogo: {
    width: 40,
    height: 40,
    margin:10
  },
  profileLogoContainer: {
   
    padding:0,
    width:60,
    margin:5,
    alignItems:"center",
    justifyContent:"center"
  },
  typography:{
    padding: 2
  }
});

const LoginMenu = [
  {
    label: "Login",
    pathname: "/login"
  }
];

const AdminMenu = [
  {
    label: "Dashboard",
    pathname: "/analytics-dashboard"
  },
  {
    label: "Projects",
    pathname: "/paneldashboard"
  },
  {
    label: "Mind Maps",
    pathname: "/mindmaplist"
  },
  {
    label: "Regrouping",
    pathname: "/organizationactions"
  },
  {
    label: "Search",
    pathname: "/search"
  },
  {
    label: "Organizations",
    pathname: "/orgdashboard"
  },
  {
    label: "Action Tracker",
    pathname: "/analytics"
  },
  {
    label: "Client Filter",
    pathname: "/clientorg"
  }
];


const StandardAdminMenu = [
 
  {
    label: "Dashboard",
    pathname: "/analytics-dashboard"
  },
  {
    label: "Projects",
    pathname: "/paneldashboard"
  },
  {
    label: "Mind Maps",
    pathname: "/mindmaplist"
  },
  {
    label: "Regrouping",
    pathname: "/organizationactions"
  },
  {
    label: "Search",
    pathname: "/search"
  },
  {
    label: "Action Tracker",
    pathname: "/analytics"
  },
  {
    label: "Organization",
    pathname: "/organization"
  },
  {
    label: "Role Managment",
    pathname: "/rolemgt"
  }
];


function getStandardMenu(){

  const StandardMenu = [];
  
  StandardMenu.push({
    label: "Dashboard",
    pathname: "/analytics-dashboard"
  });
  
  if(checkPermision('Dashboard','read')){
      StandardMenu.push({
        label: "Project",
        pathname: "/paneldashboard"
      })
  }
  if(checkPermision('Mind Map','read')){
      StandardMenu.push({
        label: "Mind Maps",
        pathname: "/mindmaplist"
      })
  }
  if(checkPermision('Regrouping','read')){
        StandardMenu.push({
          label: "Regrouping",
          pathname: "/organizationactions"
        })
    }

  if(checkPermision('Search','read')){
      StandardMenu.push({
        label: "Search",
        pathname: "/search"
      })
  }

  if(checkPermision('Analytics','read')){
      StandardMenu.push({
        label: "Action Tracker",
        pathname: "/analytics"
      })
  }
  if(checkPermision('Organization','read')){
      StandardMenu.push({
        label: "Organization",
        pathname: "/organization"
      })
  }


  return StandardMenu;
}
function getMenu(menuType) {
  var menu = null;

  if (menuType === "notLoggedIn") {
    menu = LoginMenu;
  } else if (menuType === "standard") {
    menu = getStandardMenu();
  }  else if (menuType === "standard-admin") {
    menu = StandardAdminMenu;
  } else if (menuType === "admin") {
    menu = AdminMenu;
  } else {
    menu = LoginMenu;
  }
  return menu;
}

function getAppbarValue(menuType, currentPath)  {
  var value = 0;
  if (menuType === "admin") {

    if (!currentPath  || currentPath === "/analytics-dashboard") {
      value = 0;
    }
    if (!currentPath  || currentPath === "/paneldashboard") {
      value = 1;
    }
    if (currentPath === "/mindmaplist") {
      value = 2;
    }
    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = 3;
    }
    if (currentPath === "/search") {
      value = 4;
    }
    /*if (currentPath === "/projectdashboard" || (currentPath !== undefined && currentPath.includes("/project/"))) {
      value = 5;
    }*/
    if (currentPath === "/orgdashboard"  || currentPath === "/department") {
      value = 5;
    }
    if (currentPath === "/analytics") {
      value = 6;
    }
    if (currentPath === "/clientorg") {
      value = 7;
    }
    
  } else if (menuType === "standard") {
    let menus=[];
    
    menus.push('Dashboard')

    if (checkPermision('Dashboard','read') ) {
      menus.push('Project')
    }
    if (checkPermision('Mind Map','read') ) {
      menus.push('Mind Map')
    }

    if (checkPermision('Regrouping','read') ) {
      menus.push('Regrouping')
    }
    if (checkPermision('Search','read') ) {
      menus.push('Search')
    }
    if (checkPermision('Analytics','read') ) {
      menus.push('Analytics')
    }
    if (checkPermision('Organization','read') ) {
      menus.push('Organization')
    }
    if (currentPath === "/logout") {
      menus.push('logout')
    }

    if (!currentPath ||  currentPath === "/analytics-dashboard") {
      value = menus.indexOf('Dashboard');
    }

    if (!currentPath ||  currentPath === "/paneldashboard") {
      value = menus.indexOf('Project');
    }
    if ( currentPath === "/mindmaplist") {
      value = menus.indexOf('Mind Map');
    }

    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = menus.indexOf('Regrouping');
    }
    if (currentPath === "/search") {
      value = menus.indexOf('Search');
    }
    if ( currentPath === "/analytics") {
      value = menus.indexOf('Analytics');
    }
    if (currentPath === "/clientorg"  || currentPath === "/person" || currentPath === "/department") {
      value = menus.indexOf('Organization');
    }
    if (currentPath === "/logout") {
      value = menus.indexOf('logout');
    }
  
    
    if(value<0){
      value=0;
    }
  }else if (menuType === "standard-admin") {
    if (!currentPath  || currentPath === "/analytics-dashboard") {
      value = 0;
    }
    if (!currentPath ||  currentPath === "/paneldashboard") {
      value = 1;
    }
    if (currentPath === "/mindmaplist") {
      value = 2;
    }

    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = 3;
    }
    if (currentPath === "/search") {
      value = 4;
    }
    if (currentPath === "/analytics") {
      value = 5;
    }
    if (currentPath === "/clientorg"  || currentPath === "/person" || currentPath === "/department") {
      value = 6;
    }
    if (currentPath === "/rolemgt") {
      value = 7;
    }
    if (currentPath === "/logout") {
      value = 8;
    }
   
  } else {
    if (!currentPath ||  currentPath === "/login") {
      value = 0;
    }
  }
  return value;
};


class Topbar extends Component {

  constructor(props) {
    super(props);
    this.menuFun = this.menuFun.bind(this);
  }

  state = {
    value: 0,
    open: false,
    mobileShow: '',
    anchorEl:null,
    showPopover:false
  };

  menuFun() {
    if(this.state.mobileShow === 'mobileShow'){
      this.setState({ mobileShow:'' });
    }else{
      this.setState({ mobileShow:'mobileShow' });
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }


  current = (menuType) => {
    let value = 0;
    value = getAppbarValue(menuType, this.props.currentPath);
    return value;
  };

  openPopover = (event) => {
    const {showPopover} =this.state;
    this.setState({anchorEl:event.currentTarget,showPopover:!showPopover})
  };

  toSentenceCase(string) {
    var sentence = string.split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  }

  render() {
   
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";
    let menuType = "";
  
    const isLogin=isLoggedIn()
    if (isLogin && !this.props.loggedOut && isAdministrator()) {
      menuType = "admin";
    }else if (isLogin && !this.props.loggedOut && !isAdministrator() && isCustomerAdmin()) {
      menuType = "standard-admin";
    } else if (isLogin && !this.props.loggedOut && !isAdministrator()) {
      menuType = "standard";
    } else {
      menuType = "notLoggedIn";
    }
    let menu = getMenu(menuType);
    
    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={24} alignItems="baseline">
            <Grid item xs={12} className={classes.flex}>
              <React.Fragment>
              
                <Grid container direction="row" alignItems="center" justify="space-between" className={classes.tabContainer+' '+this.state.mobileShow} style={{width:"100%",margin:0}}>
                  <div style={{width:"5rem",textAlign:"right"}}>
                    <img href="#" src={require('../images/new-logo.png')} style={{height: "3rem",width: "auto"}} />
                  </div>
                  <Tabs
                    value={this.current(menuType) || this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    style={{alignSelf:"center"}}
                    onChange={this.handleChange}
                  >
                    {menu.map((item, index) => (
                      <Tab key={index} component={Link} to={{pathname: item.pathname, search: this.props.location.search}} classes={{root: classes.tabItem}} label={item.label} />
                    ))}
                  </Tabs>
                  {isLogin && !this.props.loggedOut &&  
                  <div  className={classes.profileLogoMenuContainer} align={"right"} onClick={(event)=>this.openPopover(event)}>
                      <img src={profileLogo} alt="" className={classes.profileLogoMenu} />
                    
                  </div>}
                </Grid>
                
                {isLogin && !this.props.loggedOut && this.renderPopOver()}
                
              </React.Fragment>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  renderPopOver(){
    const {anchorEl,showPopover} =this.state;
    const { classes } = this.props;
    const user = getUser();
    return (
        <Popper style={{zIndex:9999}} open={showPopover} anchorEl={anchorEl} placement={'bottom-end'} transition>
          {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper style={{ minWidth: 300 }}>

              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"

              >
                <Grid item xs={3}>
                  <div className={classes.profileLogoContainer} align={"center"} onClick={(event) => this.openPopover(event)}>
                    <img src={profileLogo} alt="" className={classes.profileLogo} />
                  </div>
                </Grid>
              </Grid>

              <Grid  item xs={12} style={{paddingLeft:20}}>
                <Typography className={classes.typography}>Name: {this.toSentenceCase(user.fullName)}</Typography>
                <Typography className={classes.typography}>Email: {user.email}</Typography>
                {user.role && <Typography className={classes.typography}>Role: {user.role}</Typography>}
              </Grid>


              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"

              >
                <Grid item xs={12}>
                  <Tab component={Link} to={{ pathname: '/password', search: this.props.location.search }} classes={{ root: classes.tabItem }} label={'Change Password'} />
                  <Tab component={Link} to={{ pathname: '/logout', search: this.props.location.search }} classes={{ root: classes.tabItem }} label={'Logout'} />
                  
                </Grid>
              </Grid>
            </Paper>
          </Fade>
          )}
        </Popper>
    )
  }
}

export default withRouter(withStyles(styles)(Topbar));
