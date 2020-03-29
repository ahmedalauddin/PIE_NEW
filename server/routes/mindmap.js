/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/mindmap.js
 * Created:  2019-01-27 17:59:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-10-01
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const mindmap = require("../controllers/mindmap");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get all mindmaps
  logger.debug(`${callerType} GET -> path: /api/mindmaps-list/:orgId`);
  router.get("/api/mindmaps-list/:orgId", mindmap.list);

  // create a mindmap
  logger.debug(`${callerType} POST -> path: /api/mindmaps`);
  router.post("/api/mindmaps", mindmap.create);

  // get a mindmap by id
  logger.debug(`${callerType} GET -> path: /api/mindmaps/:id`);
  router.get("/api/mindmaps/:id", mindmap.findById);

  // get a mindmap by organization id
  logger.debug(`${callerType} GET -> path: /api/mindmaps-org/:orgId`);
  router.get("/api/mindmaps-org/:orgId", mindmap.findByOrgId);

  // **** NEW *************
  // get mindmap node information
  logger.debug(`${callerType} GET -> path: /api/mindmap-node/:mindmapId/:nodeId`);
  router.get("/api/mindmap-node/:mindmapId/:nodeId", mindmap.getNodeDescription);

  // **** NEW *************
  // get mindmap node information second version
  logger.debug(`${callerType} GET -> path: /api/mindmap-node2/:mindmapId/:nodeId`);
  router.get("/api/mindmap-node2/:mindmapId/:nodeId", mindmap.getNode);

  // update a mindmap
  logger.debug(`${callerType} PUT -> path: /api/mindmaps/:id`);
  router.put("/api/mindmaps/:id", mindmap.update);

  // delete a mindmap
  logger.debug(`${callerType} DELETE -> path: /api/mindmaps/:id`);
  router.delete("/api/mindmaps/:id", mindmap.deleteMindmap);
};
