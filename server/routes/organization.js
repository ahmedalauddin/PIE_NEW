/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-09-22
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const orgController = require("../controllers").Organization;
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // select all organizations
  logger.debug(`${callerType} GET -> path: /api/organizations`);
  router.get("/api/organizations", orgController.list);

  // select all organizations for a dashboard list
  logger.debug(`${callerType} GET -> path: /api/organizations-dashboard`);
  router.get("/api/organizations-dashboard", orgController.dashboardList);

  // save KPI prioritization lock
  logger.debug(`${callerType} PUT -> path: /api/org-save-prioritization-lock/:id`);
  router.put("/api/org-save-prioritization-lock/:id", orgController.saveKpiPrioritizationLock   );

  // select all organizations for a dashboard list
  logger.debug(`${callerType} GET -> path: /api/ft-search`);
  router.get("/api/ft-search", orgController.fulltextSearch);

  // select a single organization by ID
  logger.debug(`${callerType} GET -> path: /api/organizations/:id`);
  router.get("/api/organizations/:id", orgController.findById);

  
// Update Name of a single organization by ID
logger.debug(`${callerType} POST -> path: /api/organizations/:id`);
router.post("/api/organizations/:id", orgController.updateOrganizationName);

  // select a single organization by ID to check its KPI prioritization lock.
  logger.debug(`${callerType} GET -> path: /api/organizations-kpilock/:id`);
  router.get("/api/organizations-kpilock/:id", orgController.checkKpiPrioritizationLock);

  // create an organization
  logger.debug(`${callerType} POST -> path: /api/organizations`);
  router.post("/api/organizations", orgController.create);

  // TODO add PUT /api/organizations/:id method for updating an organization.
  // TODO add DELETE /api/organizations/:id method for deleting an organization

    // deactivate a organization with id
logger.debug(`${callerType} DELETE -> path: /api/organization-deactivate/:id`);
router.put("/api/organization-deactivate/:id", orgController.deactivate);


 logger.debug(`${callerType} GET -> path: /api/orgnization-project-status/:id`);
  router.get("/api/orgnization-project-status/:id", orgController.orgnizationProjectStatus);

  logger.debug(`${callerType} GET -> path: /api/orgnization-project-action-status/:id`);
  router.get("/api/orgnization-project-action-status/:id", orgController.orgnizationProjectActionStatus);

  logger.debug(`${callerType} GET -> path: /api/orgnization-project-action-new-vs-close/:id`);
  router.get("/api/orgnization-project-action-new-vs-close/:id", orgController.orgnizationProjectActioNewVsClose)

  logger.debug(`${callerType} GET -> path: /api/orgnization-milstone-status/:id`);
  router.get("/api/orgnization-milstone-status/:id", orgController.orgnizationMilstoneStatus);

};
