/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/taskpriority.js
 * Created:  2019-05-02
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const taskPriorityController = require("../controllers").TaskPriority;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all task priorities
  logger.debug(`${callerType} GET -> path: /api/taskpriorities`);
  router.get("/api/taskpriorities", taskPriorityController.list);
};
