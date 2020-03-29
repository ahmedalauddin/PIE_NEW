/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/taskpriority.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-26 15:41:43
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  // Find a status by Id
  findById(req, res) {
    return models.TaskPriority.findByPk(req.params.id, {
    })
      .then(_d => {
        logger.debug(
          `${callerType} findById -> successful, title: ${_d.label}`
        );
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all statuses
  list(req, res) {
    return models.TaskPriority.findAll({
      order: [["priority", "ASC"]],
    })
      .then(_d => {
        logger.debug(`${callerType} list -> successful, count: ${_d.length}`);
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
