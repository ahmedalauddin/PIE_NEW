/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/UpdateUser.js
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Descr:    Update the UserContext.
 * -----
 * Modified: 2019-03-19 12:27:02
 * Editor:   Darrin Tisdale
 */
import React, { useContext } from "react";
import { UserContext } from "./UserContext";

function UpdateUser(userData) {
  // grab the context via the context api
  const c = useContext(UserContext);

  // now access the member of the object we want
  c.setUser(userData);
  return("updated");
}

export default UpdateUser;

