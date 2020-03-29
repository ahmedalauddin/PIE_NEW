/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/kpitag.js
 * Created:  2019-05-04
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  // List all tags
  list(req, res) {
    return models.KpiTag.findAll({
    })
      .then(_t => {
        logger.debug(`${callerType} list -> successful, count: ${_t.length}`);
        res.status(201).send(_t);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
