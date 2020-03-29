/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/task.js
 * Created:  2019-03-21 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-23
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const models = require("../models");
const Person = require("../models").Person;
const Project = require("../models").Project;
const TaskPriority = require("../models").TaskPriority;
const TaskStatus = require("../models").TaskStatus;
const Milestone = require("../models").Milestone;
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    return models.Task.create({
      title: req.body.title,
      description: req.body.description,
      statusId: req.body.taskstatus,
      assignedTo: req.body.assigned,
      milestoneId: req.body.milestone,
      comments: req.body.comments,
      projectId: parseInt(req.body.projectId),
      priorityId: req.body.priority
    })
      .then(t => {
        logger.debug(`${callerType} create -> added task, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a task
  update(req, res) {
    const id = req.params.id;
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Task.update(
      {
        title: req.body.title,
        description: req.body.description,
        milestoneId: req.body.milestone,
        comments: req.body.comments,
        statusId: req.body.taskstatus,
        priorityId: req.body.priority
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update Task -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} update Task -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a task by Id
  findById(req, res) {
    return models.Task.findById(req.params.id, {
      include: [
        {
          model: Project,
          as: "project"
        },
        {
          model: Person,
          as: "assigned"
        },
        {
          model: Milestone,
          as: "milestone"
        },
        {
          model: TaskStatus,
          as: "status"
        },
        {
          model: TaskPriority,
          as: "priority"
        }
      ]
    })
      .then(t => {
        logger.debug(`${callerType} findById -> id: ${t.id}`);
        res.status(200).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all tasks for a single project
  listByProject(req, res) {
    return models.Task.findAll({
      where: { projectId: req.params.projid },
      order: [["title", "DESC"]],
      include: [
        {
          model: models.Person,
          as: "assigned"
        },
        {
          model: TaskStatus,
          as: "status"
        }
      ]
    })
      .then(tasks => {
        logger.debug(`${callerType} listByProject -> successful, count: ${tasks.length}`);
        res.status(201).send(tasks);
      })
      .catch(error => {
        logger.error(`${callerType} listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all tasks with the person assigned
  listWithAssigned(req, res) {
    logger.debug(`${callerType} list tasks -> start`);
    return models.sequelize.query("select T.projectId, T.status, T.id, T.title, T.description, " +
      "Concat(P.firstName, ' ', P.lastName) as fullName from Tasks T, Persons P where T.assignedTo = P.id",
      {
        type: models.sequelize.QueryTypes.SELECT,
        order: [["title", "ASC"]]
      })
      .then(tasks => {
        logger.debug(`${callerType} list -> count: ${tasks.length}`);
        res.status(200).send(tasks);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all tasks with the person assigned
  listMostRecent(req, res) {
    logger.debug(`${callerType} list tasks -> start`);
    return models.sequelize.query("select id, projectId, assignedTo, title, status, description, updatedAt from Tasks " +
          "order by updatedAt desc limit 6",
      {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(tasks => {
        logger.debug(`${callerType} list -> count: ${tasks.length}`);
        res.status(200).send(tasks);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all tasks
  list(req, res) {
    logger.debug(`${callerType} list tasks -> start`);
    return models.Task.findAll({
      include: [
        {
          model: models.Person,
          as: "assigned"
        }
      ],
      order: [["title", "ASC"]]
    })
      .then(tasks => {
        logger.debug(`${callerType} list -> count: ${tasks.length}`);
        res.status(200).send(tasks);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
