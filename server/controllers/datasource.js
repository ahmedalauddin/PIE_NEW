/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/dataset.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-26 15:46:04
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    return models.DataSet.create({
      title: req.body.title,
      description: req.body.description,
      sourceFile: req.body.sourceFile
    })
      .then(_k => {
        logger.debug(`${callerType} create -> added dataset, id: ${_k.id}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a Kpi
  update(req, res) {
    return models.DataSet.update(
      {
        title: req.body.title,
        description: req.body.description,
        sourceFile: req.body.sourceFile
      },
      {
        returning: true,
        where: {
          id: req.params.id
        }
      }
    )
      .then(_k => {
        logger.debug(`${callerType} update -> successful`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a Kpi by Id
  findById(req, res) {
    return models.DataSet.findByPk(req.params.id, {
      include: [
        {
          model: models.DataSource,
          as: "datasource"
        }
      ]
    })
      .then(_d => {
        logger.debug(
          `${callerType} findById -> successful, title: ${_d.title}`
        );
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all datasets for a single project
  listByProject(req, res) {
    return models.DataSet.findAll({
      where: { projectId: req.params.projid },
      order: [["title", "DESC"]]
    })
      .then(_d => {
        logger.debug(
          `${callerType} listByProject -> successful, count: ${_d.length}`
        );
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all datasets
  list(req, res) {
    return models.DataSet.findAll({
      include: [
        {
          model: models.Project,
          as: "project"
        }
      ]
    })
      .then(_d => {
        logger.debug(`${callerType} list -> successful, count: ${_d.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
