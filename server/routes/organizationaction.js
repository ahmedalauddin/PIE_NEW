"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const organizationaction = require("../controllers/organizationaction");

module.exports = router => {
  const callerClass = "router";
  // get Actions by project
 /* logger.debug(`${callerClass} GET -> path: /api/action-organization/:orgId`);
  router.get("/api/action-organization/:orgId", organizationaction.listByOrganization);
  */

  logger.debug(`${callerClass} GET -> path: /api/action-organization/:orgId/:dateAdded`);
  router.get("/api/action-organization/:orgId/:dateAdded", organizationaction.listByOrganization);


  // Post action-organization by organization
  logger.debug(`${callerClass} POST -> path: /api/action-organization/:orgId`);
  router.post("/api/action-organization/:orgId", organizationaction.createOrganizationAction);

  // Put action-organization by organization
  logger.debug(`${callerClass} PUT -> path: /api/action-organization/:orgId`);
  router.put("/api/action-organization/:actionId", organizationaction.updateOrganizationAction);

  // Find action-organization by ID
  logger.debug(`${callerClass} Find -> path: /api/action-organization-id/:id`);
  router.get("/api/action-organization-id/:id", organizationaction.findById);

  router.get("/api/organization-action-persons/:orgId", organizationaction.organizationActionPersons);

  // Deactivate action-organization by ActionId
  logger.debug(`${callerClass} PUT -> path: /api/action-organization-deactivate/:actionId`);
  router.put("/api/action-organization-deactivate/:actionId", organizationaction.deactivateOrganizationAction);

  logger.debug(`${callerClass} copy action -> path: /api/action-organization/:orgId/:assigneeId/:actionId`);
  router.get("/api/copy-action-organization/:orgId/:assigneeId/:actionId", organizationaction.copyAction);

  logger.debug(`${callerClass} meeting days -> path: /api/action-organization-meeting-days/:orgId`);
  router.get("/api/action-organization-meeting-days/:orgId", organizationaction.meetingDays);
};
