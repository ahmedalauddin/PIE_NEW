/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/milestone.js
 * Created:  2019-05-14
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const milestoneController = require("../controllers").Milestone;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // TODO: may need list method
  // get all milestones
  // logger.debug(`${callerType} GET -> path: /api/milestones`);
  // router.get("/api/milestones", milestoneController.list);

  // get by id
  logger.debug(`${callerType} GET -> path: /api/milestones/:id`);
  router.get("/api/milestones/:id", milestoneController.findById);

  // get all milestones by project id
  logger.debug(`${callerType} GET -> path: /api/milestones-project/:projid`);
  router.get("/api/milestones-project/:projid", milestoneController.listByProject);

  // get all milestones for our Gantt chart view
  logger.debug(`${callerType} GET -> path: /api/gantt/:projid`);
  router.get("/api/gantt/:projid", milestoneController.listForGantt);

  // update Gantt chart view
  logger.debug(`${callerType} PUT -> path: /api/gantt/:projid`);
  router.put("/api/gantt/:projid", milestoneController.saveGantt);

  // update Gantt chart view
  logger.debug(`${callerType} POST -> path: /api/gantt/:projid`);
  router.post("/api/gantt/:projid", milestoneController.createGantt);

  // create a milestone
  logger.debug(`${callerType} POST -> path: /api/milestones`);
  router.post("/api/milestones", milestoneController.create);

  // Update a task with id
  logger.debug(`${callerType} PUT -> path: /api/milestones/:id`);
  router.put("/api/milestones/:id", milestoneController.update);

  // TODO add DELETE /api/tasks/:id for deleting (or deactivating) a milestone

  logger.debug(`${callerType} POST -> path: /api/milestones-comments`);
  router.post("/api/milestones-comments", milestoneController.saveComment);

  logger.debug(`${callerType} GET -> path: /api/milestones-comments`);
  router.get("/api/milestones-comments/:projectId/:taskId", milestoneController.getComments);

};
