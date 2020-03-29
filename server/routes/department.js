/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/department.js
 * Created:  2019-04-12
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const departmentController = require("../controllers").Department;
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // select all departments
  logger.debug(`${callerType} GET -> path: /api/departments`);
  router.get("/api/departments", departmentController.listall);

  // select a single department by ID
  logger.debug(`${callerType} GET -> path: /api/departments/:id`);
  router.get("/api/departments/:id", departmentController.findById);

  // list by organization
  logger.debug(`${callerType} GET -> path: /api/departments/org/:orgid`);
  router.get("/api/departments/org/:orgid", departmentController.listByOrg);

  // create a department
  logger.debug(`${callerType} POST -> path: /api/departments`);
  router.post("/api/departments", departmentController.create);

  // update a department
  logger.debug(`${callerType} PUT -> path: /api/departments/:id`);
  router.put("/api/departments/:id", departmentController.update);

  // TODO add DELETE /api/departments-deactivate/:id for deleting a department, also deactivate
  logger.debug(`${callerType} PUT -> path: /api/departments-deactivate/:id`);
  router.put("/api/departments-deactivate/:id", departmentController.disable);

  // TODO add DELETE /api/departments/:id method for deleting a department
};
