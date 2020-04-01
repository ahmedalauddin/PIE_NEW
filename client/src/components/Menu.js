// Menu.js is not currently used.
const Menu = [
  {
    label: "Login",
    pathname: "/login",
    admin: false,
    intro: true
  },
  {
    label: "Dashboard",
    pathname: "/paneldashboard",
    admin: false,
    intro: false
  },
  {
    label: "Mind Maps",
    pathname: "/mindmaplist",
    admin: true,
    intro: false
  },
  {
    label: "Regrouping",
    pathname: "/organizationactions",
    admin: true,
    intro: false
  },
  {
    label: "Projects",
    pathname: "/projectdashboard",
    admin: true,
    intro: false
  },
  {
    label: "Organizations",
    pathname: "/orgdashboard",
    admin: true,
    intro: false
  },
  {
    label: "Analytics",
    pathname: "/analytics",
    admin: true,
    intro: false
  },
  {
    label: "Client Filter",
    pathname: "/clientorg",
    admin: true,
    intro: false
  },
  {
    label: "Logout",
    pathname: "/logout",
    admin: false,
    intro: false
  },
  {
    label: "About",
    pathname: "/about",
    admin: false,
    intro: true
  }
];

export default Menu;
