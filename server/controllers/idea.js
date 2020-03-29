/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/idea.js
 * Created:  2019-07-05
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const models = require("../models");
const logger = require("../util/logger")(__filename);
const Idea = require("../models").Idea;
const callerType = "controller";

module.exports = {
  create(req, res) {
    const orgId = req.body.orgId;
    logger.debug(`${callerType} create idea -> orgId: ${orgId}`);
    logger.debug(`${callerType} create idea -> JSON: req.body: ${JSON.stringify(req.body)}`);
    return models.Idea.create({
      name: req.body.nodeTitle,
      nodeId: req.body.nodeId,
      ideaText: req.body.idea,
      orgId: req.body.orgId
    })
      .then(() => {
        res.status(201).send();
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update an idea
  update(req, res) {
    const nodeid = req.params.nodeid;
    return models.Idea.update(
      {
        name: req.body.nodeTitle,
        ideaText: req.body.idea,
        orgId: req.body.orgId
      },
      {
        returning: true,
        where: {
          nodeId: nodeid
        }
      }
    )
      .then(_i => {
        logger.debug(`${callerType} Idea update -> successful`);
        res.status(201).send(_i);
      })
      .catch(error => {
        logger.error(`${callerType} Idea update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find an idea by Id
  findById(req, res) {
    logger.error(`${callerType} Idea, findById `);
    return models.Idea.findByPk(req.params.id, {
    })
      .then(_i => {
        logger.debug(
          `${callerType} findById -> successful, id: ${_i.id}`
        );
        res.status(201).send(_i);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find an idea by the ID of a node on a mindmap.
  findByNodeId(req, res) {
    logger.error(`${callerType} Idea, findByNodeId `);
    return models.Idea.findOne({
      where: {
        nodeId: req.params.nodeid
      }
    })
      .then(_i => {
        logger.debug(
          `${callerType} findByNodeId -> successful, id: ${_i.id}`
        );
        res.status(201).send(_i);
      })
      .catch(error => {
        logger.error(`${callerType} findByNodeId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all ideas for a single organization
  listByOrganization(req, res) {
    //logger.info(`${callerType} Idea, req.params.orgid: ${req.params.orgid} `);
    return models.Idea.findAll({
      where: { orgId: req.params.orgid },
      order: [["createdAt", "ASC"]]
    })
      .then(_i => {
        logger.debug(`${callerType} listByOrganization -> successful, count: ${_i.length}`);
        res.status(201).send(_i);
      })
      .catch(error => {
        logger.error(`${callerType} listByOrganization -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
