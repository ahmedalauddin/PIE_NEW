/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-30
 * Editor:   Brad Kaufman
 */
const Auth = require("./auth");
const Dataset = require("./dataset");
const Datasource = require("./datasource");
const Department = require("./department");
const Kpi = require("./kpi");
const KpiTag = require("./kpitag");
const Idea = require("./idea");
const Milestone = require("./milestone");
const Mindmap = require("./mindmap");
const Organization = require("./organization");
const Person = require("./person");
const Project = require("./project");
const ProjectPerson = require("./projectperson");
const ProjectStatus = require("./projectstatus");
const Task = require("./task");
const TaskStatus = require("./taskstatus");
const TaskPriority = require("./taskpriority");

module.exports = {
  Auth,
  Dataset,
  Datasource,
  Department,
  Kpi,
  KpiTag,
  Idea,
  Milestone,
  Mindmap,
  Organization,
  Person,
  Project,
  ProjectPerson,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus
};
