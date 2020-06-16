/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/dashboard/DashboardStyles.js
 * Desc:     Commond styles for project dashboards.
 * Created:  2019-10-08
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-12-26
 * Changes:  Removing maxWidth from card style to allow component to be centered on the screen.
 * Editor:   Brad Kaufman
 */
export const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "flex-end"
  },
  filters: {
    alignItems: "flex-end"
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paddingbottom20: {
    paddingBottom:"20px"
  },
  card: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  paperWidget: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
    boxShadow:"0px 1px 5px 0px #303f9f, 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  secondaryHeadingLink: {
    fontSize: theme.typography.pxToRem(15),
    color: "#0d47a1",
    textDecoration: "underline"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 170,
    maxWidth: 600,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20rem"
  },
  columntitle: {
    flexBasis: "22rem"
  },
  columnclient: {
    flexBasis: "15rem"
  },

  columnstatus: {
    flexBasis: "10rem"
  },
  columntarget: {
    flexBasis: "14rem"
  },
  columnstartdate: {
    flexBasis: "13rem"
  },
  columnenddate: {
    flexBasis: "13rem"
  },
  columnactions: {
    flexBasis: "12rem"
  },
  narrowColumn: {
    flexBasis: "20rem"
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    }
  },
  dataPickerInput: {
    fontSize: "0.875rem",
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottomColor: "grey",
    borderBottomWidth: "1px"
  }
});

export default styles;
