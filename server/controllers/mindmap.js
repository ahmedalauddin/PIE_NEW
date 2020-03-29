/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/mindmap.js
 * Created:  2019-01-27 17:59:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-11-29
 * Changes:  Add name and description to save fields for update and create.
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
//TODO determine means to handle nodes of mindmap creating/updating/deleting projects

module.exports = {
  create(req, res) {
    logger.debug(`${callerType} create -> mapData: ${req.body.mapData}`);
    return models.Mindmap.create({
      orgId: req.body.orgId,
      mapData: req.body.mapData,
      mapName: req.body.mapName,
      mapDescription: req.body.mapDescription
    },
    {
      returning: true
    }
    )
      .then(result => {
        logger.debug(`${callerType} create -> id: ${result.id}`);
        res.status(201).send(result);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a mindmap
  update(req, res) {
    const id = req.params.id;
    return models.Mindmap.update(
      {
        mapData: req.body.mapData,
        mapName: req.body.mapName,
        mapDescription: req.body.mapDescription
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(m => {
        logger.debug(`${callerType} update -> updatedAt: ${m.updatedAt}`);
        res.status(200).send(m);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Delete a mindmap
  deleteMindmap(req, res) {
    const id = req.params.id;
    return models.Mindmap.update(
      {
        active: 0
      },
      {
      where: {
        id: id
      }
    })
      .then(c => {
        logger.debug(`${callerType} delete -> ${c} maps deleted`);
        res.status(200).send({
         success: true,
          message: "Mindmap Deleted successfully"
        });
      })
      .catch(error => {
        logger.error(`${callerType} delete -> error: ${error.stack}`);
        res.status(400).send({
          success: false,
           message: "Unknown error occurred "+error.stack
         });
      });
  },

  // Find a mindmap by id
  findById(req, res) {
    return models.Mindmap.findById(req.params.id)
      .then(mms => {
        logger.debug(`${callerType} findById -> count: ${mms.length}`);
        res.status(200).send(mms);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a mindmap by id
  findByOrgId(req, res) {
    logger.debug(`${callerType} findByOrgId -> orgId: ${req.params.orgId}`);
    // Get the lastest mind map for an organization.
    let sql = "select id, orgId, mapData, updatedAt from Mindmaps " +
      "where orgId = " + req.params.orgId + " " +
      "order by updatedAt desc limit 1";
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(mms => {
        // logger.debug(`${callerType} findById -> count: ${mms.length}`);
        res.status(200).send(mms);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Get the mind map node description.  Pass in two parameters, the mindmap ID and the ID
  // of the node.
  getNodeDescription(req, res) {
    const nodeId = req.params.nodeId;
    const mindmapId = req.params.mindmapId;

    logger.debug(`${callerType} getNodeDescription -> orgId: ${req.params.mindmapId}`);
    logger.debug(`${callerType} getNodeDescription -> orgId: ${req.params.nodeId}`);

    // This uses MySQL json functions to get information from a JSON field.  Pass in the .id, get the .description back.
    const sql = "select json_unquote(json_extract(mapData, replace(json_unquote(json_search(mapData, 'one', '" + nodeId + "')), '.id', '.description'))) " +
      "as nodeDescript from Mindmaps m where m.id = " + mindmapId + ";";

    logger.debug(`${callerType} getNodeDescription -> sql: ${sql}`);
    return models.sequelize
      .query(sql, {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(mms => {
        res.status(200).send(mms);
      })
      .catch(error => {
        logger.error(`${callerType} getNodeDescription -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Get the mind map node.  Pass in two parameters, the mindmap ID and the ID
  // of the node.
  getNode(req, res) {
    const nodeId = req.params.nodeId;
    const mindmapId = req.params.mindmapId;
    const args = "'" + mindmapId + "', " + nodeId;
    // This uses MySQL json function to get information from a JSON field.  Pass in the .id, get the .description back.
    const sql = "select getMindmapJsonNode(" + mindmapId + ", '" + nodeId + "')";

    logger.debug(`mindmap: getNode -> sql: ${sql}`);
    return models.sequelize
      .query(sql, {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(mms => {
        res.status(200).send(mms);
      })
      .catch(error => {
        logger.error(`${callerType} getNodeDescription -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find all mindmaps
  list(req, res) {
    if (req.params.orgId) {
      return models.Mindmap.findAll({
        attributes: ["id", "mapName", "mapDescription", "createdAt", "updatedAt", "orgId"],
        order: [["createdAt", "DESC"]],
        where: {
          orgId: req.params.orgId,
          active: 1
        }
      })
        .then(map => {
          logger.debug(`${callerType} list -> id: ${map.id}`);
          res.status(200).send(map);
        })
        .catch(error => {
          logger.error(`${callerType} list -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
    /* else {
      return models.Mindmap.findAll({
        include: [
          {
            model: models.Mindmap,
            as: "Mindmap"
          }
        ]
      })
        .then(maps => {
          logger.debug(`${callerType} list -> count: ${maps.length}`);
          res.status(200).send(maps);
        })
        .catch(error => {
          logger.error(`${callerType} list -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }  */
  }
};
