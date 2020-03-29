/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/UserContext.js
 * Created:  2019-03-17
 * Author:   Brad Kaufman
 * Descr:    User Context using React's Context API.
 * -----
 * Modified: 2019-03-19 12:25:24
 * Editor:   Darrin Tisdale
 */
import React, { Component } from "react";

/**
 * *UserContext*
 * the context that stores information
 */
export const UserContext = React.createContext();

/**
 * *UserConsumer*
 * the consumer for the context
 */
export const UserConsumer = UserContext.Consumer;

let reducer = (state, action) => {
  let s;
  switch(action.type) {
  case "setUser":
    s = {...this.state, user: action.payload};
    break;
  case "setOrg":
    s = {...this.state, organization: action.payload};
    break;
  default:
    s = initialState;
  }
  return s;
};

let initialState = {
  user: {},
  organization: {}
};

export function UserProvider (props) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = {state, dispatch};
  return(<UserContext.Provider value={value}>
    {props.children}
  </UserContext.Provider>);
}
