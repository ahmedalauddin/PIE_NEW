/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/taskstatus.js
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

  // List all statuses
  list(req, res) {
    return models.TaskStatus.findAll({
    })
      .then(_s => {
        logger.debug(`${callerType} list -> successful, count: ${_s.length}`);
        res.status(201).send(_s);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
