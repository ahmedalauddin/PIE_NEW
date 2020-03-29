/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/person.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-26 17:49:05
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const personController = require("../controllers").Person;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all persons
  logger.debug(`${callerType} GET -> path: /api/persons`);
  router.get("/api/persons", personController.list);

  // create a person
  logger.debug(`${callerType} POST -> path: /api/persons`);
  router.post("/api/persons", personController.create);

  // Update a person with id
  logger.debug(`${callerType} PUT -> path: /api/persons/:id`);
  router.put("/api/persons/:id", personController.update);

  // TODO add DELETE /api/persons/:id for deleting a person, also deactivate
  logger.debug(`${callerType} PUT -> path: /api/persons/disable/:id`);
  router.put("/api/persons/disable/:id", personController.disable);

  // logger.debug(`${callerType} PUT -> path: /api/persons/disable_from_proj/:id`);
  // router.put("/api/persons/disable_from_proj/:personid/:projectid", personController.disable_from_proj);

  logger.debug(`${callerType} PUT -> path: /api/persons/disable_from_org/:personid/:orgid`);
  router.put("/api/persons/disable_from_org/:personid/:orgid", personController.disable_from_org);

  // Find a person by ID
  logger.debug(`${callerType} GET -> path: /api/persons/:id`);
  router.get("/api/persons/:id", personController.findById);

  // Find a person by project
  logger.debug(`${callerType} GET -> path: /api/project-persons/:projectId`);
  router.get("/api/project-persons/:projectId/:orgId", personController.findByProject);

  // Find persons assigned to a project
  logger.debug(`${callerType} GET -> path: /api/persons-assigned/:projectId`);
  router.get("/api/persons-assigned/:projectId", personController.getPersonsAssignedToProject);
  router.get("/api/persons-assigned-and-owned/:projectId", personController.getPersonsAssignedAndOwnedToProject);
  router.get("/api/persons-owned/:projectId", personController.getPersonsOwnedToProject);

  // Find a person by organization
  logger.debug(`${callerType} GET -> path: /api/persons-org/:orgId/:onlyForOrg`);
  router.get("/api/persons-org/:orgId/:onlyForOrg", personController.findByOrganization);

  // Find a person by email
  logger.debug(`${callerType} GET -> path: /api/persons/email/:email`);
  router.get("/api/persons/email/:email", personController.findByEmail);
};
