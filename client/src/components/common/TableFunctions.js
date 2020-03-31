/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/common/TableFunctions.js
 * Created:  2019-06-29
 * Descr:    Table functions for sorting and ordering used in our tables.
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */

export function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(array, cmp) {
  
  if(!array || !array.map) return;

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
