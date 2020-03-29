/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/kpitag.js
 * Created:  2019-05-04
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const kpitag = require("../controllers/kpitag");

module.exports = router => {
  const callerClass = "router";

  // get the list of kpitags
  logger.debug(`${callerClass} GET -> path: /api/kpitags`);
  router.get("/api/kpitags", kpitag.list);

};
