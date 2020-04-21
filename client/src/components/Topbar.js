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
import { isAdministrator, isLoggedIn, getUser,isCustomerAdmin } from "../redux";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button/index";

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
    label: "Projects",
    pathname: "/projectdashboard"
  },
  {
    label: "Organizations",
    pathname: "/orgdashboard"
  },
  {
    label: "Analytics",
    pathname: "/analytics"
  },
  {
    label: "Client Filter",
    pathname: "/clientorg"
  },
  {
    label: "Logout",
    pathname: "/logout"
  },
  {
    label: "About",
    pathname: "/about"
  }
];

const StandardMenu = [
  {
    label: "Dashboard",
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
    label: "Analytics",
    pathname: "/analytics"
  },
  {
    label: "Organization",
    pathname: "/organization"
  },
  {
    label: "Logout",
    pathname: "/logout"
  },
  {
    label: "About",
    pathname: "/about"
  }
];

const StandardAdminMenu = [
  {
    label: "Dashboard",
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
    label: "Analytics",
    pathname: "/analytics"
  },
  {
    label: "Organization",
    pathname: "/organization"
  },
  {
    label: "Role Managment",
    pathname: "/rolemgt"
  },
  {
    label: "Logout",
    pathname: "/logout"
  },
  {
    label: "About",
    pathname: "/about"
  }
];

function getMenu(menuType) {
  var menu = null;

  if (menuType === "notLoggedIn") {
    menu = LoginMenu;
  } else if (menuType === "standard") {
    menu = StandardMenu;
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
    if (!currentPath  || currentPath === "/paneldashboard") {
      value = 0;
    }
    if (currentPath === "/mindmaplist") {
      value = 1;
    }
    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = 2;
    }
    if (currentPath === "/search") {
      value = 3;
    }
    if (currentPath === "/projectdashboard" || (currentPath !== undefined && currentPath.includes("/project/"))) {
      value = 4;
    }
    if (currentPath === "/orgdashboard"  || currentPath === "/department") {
      value = 5;
    }
    if (currentPath === "/analytics") {
      value = 6;
    }
    if (currentPath === "/clientorg") {
      value = 7;
    }
    if (currentPath === "/logout") {
      value = 8;
    }
    if (currentPath === "/about") {
      value = 9;
    }
  } else if (menuType === "standard") {
    if (!currentPath ||  currentPath === "/paneldashboard") {
      value = 0;
    }
    if (currentPath === "/mindmaplist") {
      value = 1;
    }

    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = 2;
    }
    if (currentPath === "/search") {
      value = 3;
    }
    if (currentPath === "/analytics") {
      value = 4;
    }
    if (currentPath === "/clientorg"  || currentPath === "/person" || currentPath === "/department") {
      value = 5;
    }
    if (currentPath === "/logout") {
      value = 6;
    }
    if (currentPath === "/about") {
      value = 7;
    }
  }else if (menuType === "standard-admin") {
    if (!currentPath ||  currentPath === "/paneldashboard") {
      value = 0;
    }
    if (currentPath === "/mindmaplist") {
      value = 1;
    }

    if (currentPath === "/organizationactions" || (currentPath !==  undefined && currentPath.includes("/OrganizationAction"))) {
      value = 2;
    }
    if (currentPath === "/search") {
      value = 3;
    }
    if (currentPath === "/analytics") {
      value = 4;
    }
    if (currentPath === "/clientorg"  || currentPath === "/person" || currentPath === "/department") {
      value = 5;
    }
    if (currentPath === "/rolemgt") {
      value = 6;
    }
    if (currentPath === "/logout") {
      value = 7;
    }
    if (currentPath === "/about") {
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

  render() {
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";
    let menuType = "";
    const username = getUser().email;
    if (isLoggedIn() && !this.props.loggedOut && isAdministrator()) {
      menuType = "admin";
    }else if (isLoggedIn() && !this.props.loggedOut && !isAdministrator() && isCustomerAdmin()) {
      menuType = "standard-admin";
    } else if (isLoggedIn() && !this.props.loggedOut && !isAdministrator()) {
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
                <div className={classes.productLogo}>
                  <Typography>
                    <Link style={{color: 'black', textDecorationLine:'none'}} activeStyle={{color: 'black'}} to={`/`}>ValueInfinity Innovation Platform</Link>
                  </Typography>
                </div>
                <div className="more-menu-btn">
                  <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={this.menuFun}
                  >
                    Open Menu
                  </Button>
                </div>
                <div className={classes.tabContainer+' '+this.state.mobileShow}>
                  <Tabs
                    value={this.current(menuType) || this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                  >
                    {menu.map((item, index) => (
                      <Tab key={index} component={Link} to={{pathname: item.pathname, search: this.props.location.search}} classes={{root: classes.tabItem}} label={item.label} />
                    ))}
                  </Tabs>
                </div>
                <div className={classes.productLogo} align={"right"}>
                  <Typography>
                    {username}
                  </Typography>
                </div>
              </React.Fragment>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(Topbar));
