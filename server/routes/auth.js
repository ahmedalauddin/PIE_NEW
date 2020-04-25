/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/auth.js
 * Created:  2019-02-16 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-17
 * Editor:   Brad Kaufman
 */
"use strict";

const auth = require("../controllers/auth");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerClass = "router";

  // authenticate
  logger.debug(`${callerClass} POST -> path: /api/auth/authenticate`);
  router.post("/api/auth/authenticate", auth.authenticate);

  // logout
  logger.debug(`${callerClass} GET -> path: /api/auth/logout`);
  router.get("/api/auth/logout", auth.logout);

  // validateToken
  logger.debug(`${callerClass} POST -> path: /api/auth/validate`);
  router.get("/api/auth/validate", auth.validateToken);

   // reset password
   logger.debug(`${callerClass} POST -> path: /api/auth/reset`);
   router.post("/api/auth/reset", auth.reset);

   logger.debug(`${callerClass} POST -> path: /api/role`);
   router.post("/api/auth/role", auth.saveAcl);

   logger.debug(`${callerClass} GET -> path: /api/role/:orgId`);
   router.get("/api/auth/role/:orgId", auth.getAcl);

   logger.debug(`${callerClass} POST -> path: /api/auth/changepassword`);
   router.post("/api/auth/changepassword", auth.changePassword);

   logger.debug(`${callerClass} GET -> path: /api/roletypes/:orgId`);
   router.get("/api/auth/roletypes/:orgId", auth.getRoletypes);

};
