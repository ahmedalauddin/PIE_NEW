/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/App.js
 * Created:  2019-02-16 23:32:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-19 12:30:42
 * Editor:   Darrin Tisdale
 */

import React from "react";
import { UserContext } from "./components/UserContext";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./stylesheets/App.css";
import Routes from "./routes";
import { blue, indigo } from "@material-ui/core/colors";
//import withAuth from "./components/withAuth";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', "sans-serif"].join(",")
  }
});

function App() {
  let {state, dispatch} = React.useContext(UserContext);
  let setUser = u = () => dispatch({type:"setUser", payload: u});
  let setOrg = o = () => dispatch({type:"setOrg", payload: o});

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <UserProvider>
          <Routes />
        </UserProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
