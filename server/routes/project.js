/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/project.js
 * Created:  2019-02-01 12:39:21
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-09-28
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaration
const projController = require("../controllers").Project;
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get a list of projects
  logger.debug(`${callerType} GET -> path: /api/projects`);
  router.get("/api/projects", projController.list);

  // Create a project
  logger.debug(`${callerType} POST -> path: /api/projects`);
  router.post("/api/projects", projController.create);
  
  router.post("/api/createnewproject", projController.createAndReturnNewProjectId);
  

  // Create a project with KPI
  logger.debug(`${callerType} POST -> path: /api/projects-add`);
  router.post("/api/projects-add", projController.createOrUpdateProjectWithKpi);

  // Retrieve a single project by Id
  logger.debug(`${callerType} GET -> path: /api/projects/:id`);
  router.get("/api/projects/:id", projController.findById);

  // list most recently updated projects
  logger.debug(`${callerType} GET -> path: /api/projects-recent`);
  router.get("/api/projects-recent", projController.getMostRecent);

  // list projects for an org for our dashboard
  //logger.debug(`${callerType} GET -> path: /api/projects-dashboard/:orgId`);
  //router.get("/api/projects-dashboard/:orgId", projController.getProjectDashboard);

  // list earliest and latest years associated with projects
  logger.debug(`${callerType} GET -> path: /api/projects-years/:orgId`);
  router.get("/api/projects-years/:orgId", projController.getProjectYears);

  // list earliest and latest years associated with projects
  logger.debug(`${callerType} GET -> path: /api/projects-years`);
  router.get("/api/projects-years", projController.getProjectYears);

  // list all projects for our dashboard
  logger.debug(`${callerType} GET -> path: /api/projects-all`);
  router.get("/api/projects-all", projController.getAllProjects);

  // list most recently updated projects
  logger.debug(`${callerType} POST -> path: /api/projects-filtered`);
  router.post("/api/projects-filtered", projController.getProjectFilteredDashboard);

  // Retrieve a list of projects for a selected organization
  logger.debug(`${callerType} GET -> path: /api/projects/organization/:orgid`);
  router.get("/api/projects/organization/:orgid", projController.findByOrganization);

  // Update a project with id
  logger.debug(`${callerType} PUT -> path: /api/projects/:id`);
  router.put("/api/projects/:id", projController.update);

  // delete a project with id
  logger.debug(`${callerType} DELETE -> path: /api/projects/:id`);
  router.delete("/api/projects/:id", projController.destroy);

  // deactivate a project with id
  logger.debug(`${callerType} DELETE -> path: /api/project-deactivate/:id`);
  router.put("/api/project-deactivate/:id", projController.deactivate);

  // list most recently updated projects
  logger.debug(`${callerType} POST -> path: /api/projects-comment`);
  router.post("/api/projects-comment", projController.saveProjectComment);

  logger.debug(`${callerType} GET -> path: /api/projects-comment/:projId`);
  router.get("/api/projects-comment/:projId", projController.getProjectComments);

  logger.debug(`${callerType} GET -> path: /api/projects-comment/:projId`);
  router.get("/api/projects-comment-recent/:projId", projController.getProjectRecentComments);

  logger.debug(`${callerType} GET -> path: /api/projects-comment/:id`);
  router.delete("/api/projects-comment/:id", projController.deactivateProjectComments);

  logger.debug(`${callerType} GET -> path: /api/orgnization-projects/:id`);
  router.get("/api/orgnization-projects/:id", projController.orgnizationProjects);


};
