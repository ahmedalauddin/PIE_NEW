/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/index.js
 * Created:  2019-01-27 13:44:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 10:57:57
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);

// construct the routes
module.exports = router => {
  const callerType = "router";

  // all paths handled by the router are done off of /api
  logger.debug(`${callerType} GET -> path: /api`);
  router.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the Value Infinity MVP API"
    })
  );
};
