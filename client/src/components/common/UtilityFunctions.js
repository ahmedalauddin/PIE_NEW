import moment from "moment";

/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/common/UtilityFunctions.js
 * Descr:    General set of utility functions.
 * Created:  2019-10-02
 * Author:   Brad Kaufman
 */
export function handleNull(refToParse) {
  try {
    if (refToParse != null) {
      return refToParse;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
}

export function formatDate(dateInput) {
  let dateOut = "";
  if (dateInput !== null) {
    dateOut = moment(dateInput).format("YYYY-MM-DD");
  }
  return dateOut;
}
