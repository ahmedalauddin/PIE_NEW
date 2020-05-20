"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const projectaction = require("../controllers/projectaction");

module.exports = router => {
  const callerClass = "router";
  // get action-project by project 
  logger.debug(`${callerClass} GET -> path: /api/action-project/:projid`);
  router.get("/api/action-project/:projid", projectaction.listByProject);

  router.get("/api/action/findAll", projectaction.findAll);

  // Post action-project by project
  logger.debug(`${callerClass} POST -> path: /api/action-project/:projid`);
  router.post("/api/action-project/:projid", projectaction.createProjectAction);

  // Put action-project by project
  logger.debug(`${callerClass} PUT -> path: /api/action-project/:projid`);
  router.put("/api/action-project/:actionId", projectaction.updateProjectAction);

    // Deactivate action-project by ActionId
    logger.debug(`${callerClass} PUT -> path: /api/action-project-deactivate/:actionId`);
    router.put("/api/action-project-deactivate/:actionId", projectaction.deactivateProjectAction);

  // Find action-project by ID
  logger.debug(`${callerClass} Find -> path: /api/action-project-id/:id`);
  router.get("/api/action-project-id/:id", projectaction.findById);

  router.get("/api/project-action-persons/:projectId", projectaction.projectActionPersonsByProjectId);

  logger.debug(`${callerClass} POST -> path: /api/action-org`);
  router.post("/api/action-org", projectaction.orgnizationActions);

  logger.debug(`${callerClass} POST -> path: /api/actions-count-org/:id`);
  router.get("/api/actions-count-org/:id", projectaction.orgnizationActionsCount);
};
