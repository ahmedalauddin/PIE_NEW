/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/kpi.js
 * Created:  2019-01-27 17:59:36
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:12:23
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const kpi = require("../controllers/kpi");

module.exports = router => {
  const callerClass = "router";

  // get the list of kpis
  logger.debug(`${callerClass} GET -> path: /api/kpis`);
  router.get("/api/kpis", kpi.list);

  // create a kpi
  logger.debug(`${callerClass} POST -> path: /api/kpis`);
  router.post("/api/kpis", kpi.create);

  // create a kpi and a project with it
  //logger.debug(`${callerClass} POST -> path: /api/kpis-with-project`);
  //router.post("/api/kpis-with-project", kpi.createWithProject);

  // Assign KPIs to a project
  //logger.debug(`${callerClass} POST -> path: /api/kpis-assign/:projid`);
  //router.post("/api/kpis-assign/:projid/:orgnId", kpi.saveAsNew);

  logger.debug(`${callerClass} POST -> path: /api/kpis-assign/:projid/:orgnId`);
  router.post("/api/kpis-assign/:projid/:orgnId", kpi.kpisAssign);

  // select a kpi by ID
  logger.debug(`${callerClass} GET -> path: /api/kpis/:id`);
  router.get("/api/kpis/:id", kpi.findById);

  // get KPIs by project
  logger.debug(`${callerClass} GET -> path: /api/kpis-project/:projid`);
  router.get("/api/kpis-project/:projid", kpi.listByProject);

  // get KPIs by matching its mindmap node ID.
  logger.debug(`${callerClass} GET -> path: /api/kpis-mindmapnode/:mindmapNodeId`);
  router.get("/api/kpis-mindmapnode/:mindmapNodeId", kpi.getByMindmapNode);

  // get KPIs by organization
  logger.debug(`${callerClass} GET -> path: /api/kpis-organization/:orgid`);
  router.get("/api/kpis-organization/:orgid", kpi.listByOrganization);

  // get KPIs by organization and priority
  logger.debug(`${callerClass} GET -> path: /api/kpis-orgpriority/:orgid`);
  router.get("/api/kpis-orgpriority/:orgid", kpi.listByOrganizationAndPriority);

  // save KPI priority list
  logger.debug(`${callerClass} GET -> path: /api/kpis-save-priorities/:orgid`);
  router.put("/api/kpis-save-priorities/:orgid", kpi.savePriorityOrder);

  // search KPIs
  logger.debug(`${callerClass} GET -> path: /api/kpis-search`);
  router.get("/api/kpis-search", kpi.search);

  // Update a KPI with id
  logger.debug(`${callerClass} PUT -> path: /api/kpis/:id`);
  router.put("/api/kpis/:id", kpi.update);

  // Deactivate a KPI with id
  logger.debug(`${callerClass} PUT -> path: /api/kpis-deactivate/:id`);
  router.put("/api/kpis-deactivate/:id", kpi.deactivate);
  // Remove a KPI with id from a Project and from its MainKpiId so that it will remain in Organization
  logger.debug(`${callerClass} PUT -> path: /api/kpis-deactivate/:id`);
  router.put("/api/kpis-deactivate-from-project/:id", kpi.removeFromProject);

   // Deactivate a KPI with id
   logger.debug(`${callerClass} PUT -> path: /api/export-kpi-to-org/:id`);
   router.put("/api/export-kpi-to-org/:id", kpi.exportKpiToOrg);

};
