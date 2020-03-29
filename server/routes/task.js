/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/task.js
 * Created:  2019-03-22 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-23
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const taskController = require("../controllers").Task;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all tasks
  logger.debug(`${callerType} GET -> path: /api/tasks`);
  router.get("/api/tasks", taskController.list);

  // get all tasks by project id
  logger.debug(`${callerType} GET -> path: /api/tasks/project/:projid`);
  router.get("/api/tasks/project/:projid", taskController.listByProject);

  // get all tasks with assigned name
  logger.debug(`${callerType} GET -> path: /api/tasks/assigned`);
  router.get("/api/tasks/assigned", taskController.listWithAssigned);

  // get all tasks with assigned name
  logger.debug(`${callerType} GET -> path: /api/tasks/mostrecent`);
  router.get("/api/tasks/mostrecent", taskController.listMostRecent);

  // create a task
  logger.debug(`${callerType} POST -> path: /api/tasks`);
  router.post("/api/tasks", taskController.create);

  // Update a task with id
  logger.debug(`${callerType} PUT -> path: /api/tasks/:id`);
  router.put("/api/tasks/:id", taskController.update);

  // TODO add DELETE /api/tasks/:id for deleting a task

  // Find a task by ID
  logger.debug(`${callerType} GET -> path: /api/tasks/:id`);
  router.get("/api/tasks/:id", taskController.findById);
};
