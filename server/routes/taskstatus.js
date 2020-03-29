/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/taskstatus.js
 * Created:  2019-05-01
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const taskStatusController = require("../controllers").TaskStatus;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all task statuses
  logger.debug(`${callerType} GET -> path: /api/taskstatuses`);
  router.get("/api/taskstatuses", taskStatusController.list);

};
