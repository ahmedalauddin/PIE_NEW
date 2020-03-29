/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/idea.js
 * Created:  2019-01-27 17:59:36
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const idea = require("../controllers/idea");

module.exports = router => {
  const callerClass = "router";

  // get the list of ideas by organization
  logger.debug(`${callerClass} GET -> path: /api/ideas-org/:orgid`);
  router.get("/api/ideas-org/:orgid", idea.listByOrganization);

  // create an idea
  logger.debug(`${callerClass} POST -> path: /api/ideas`);
  router.post("/api/ideas", idea.create);

  // select an idea by ID
  logger.debug(`${callerClass} GET -> path: /api/ideas/:id`);
  router.get("/api/ideas/:id", idea.findById);

  // select an idea by mindmap node ID
  logger.debug(`${callerClass} GET -> path: /api/ideas-node/:nodeid`);
  router.get("/api/ideas-node/:nodeid", idea.findByNodeId);

  // Update an idea with a nodeid
  logger.debug(`${callerClass} PUT -> path: /api/ideas/:nodeid`);
  router.put("/api/ideas/:nodeid", idea.update);

  // TODO: add idea delete method.
};
