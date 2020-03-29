/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/department.js
 * Created:  2019-04-12
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const models = require("../models");
const logger = require("../util/logger")(__filename);
const Organization = require("../models").Organization;
const callerType = "controller";

module.exports = {
  create(req, res) {
    return models.Department.create({
      name: req.body.name,
      description: req.body.description,
      orgId: req.body.orgId
    })
      .then(_d => {
        logger.debug(`${callerType} create -> added department, id: ${_d.id}`);
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} create -> department, error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a department
  update(req, res) {
    const id = req.params.id;
    return models.Department.update(
      {
        name: req.body.name,
        description: req.body.description,
        orgId: req.body.orgId
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(_d => {
        logger.debug(`${callerType} update -> successful`);
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  disable(req, res) {
    const id = req.params.id;
    logger.debug("Calling department disable");
    // logger.debug(
    //   `${callerType} disable>>> -> body: ${util.inspect(req.body, {
    //     showHidden: false,
    //     depth: null
    //   })}`
    // );
    return models.Department.update(
      {
        disabled: true,
        disabledAt: new Date()
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update -> successful`);
        res.status(200).send({
          success: true,
          message: "Department deleted successfully"
        });
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send({
          success: true,
          message: "Error occured while deleting"
        });
      });
  },

  // Find a department by Id
  findById(req, res) {
    logger.error(`${callerType} Department, findById `);
    return models.Department.findByPk(req.params.id, {
      include: [
        {
          model: models.Organization,
          as: "organization"
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

  // List all deaprtments for a single organization
  listByOrg(req, res) {
    return models.Department.findAll({
      where: { orgId: req.params.orgid, disabled:false },
      order: [["name", "ASC"]],
      include: [
        {
          model: Organization,
          as: "organization"
        }
      ]
    })
      .then(_d => {
        logger.debug(`${callerType} listByOrg -> successful, count: ${_d.length}`);
        res.status(201).send(_d);
      })
      .catch(error => {
        logger.error(`${callerType} listByOrg -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all departments
  listall(req, res) {
    return models.Department.findAll({
      include: [
        {
          model: models.Organization,
          as: "organization"
        }
      ]
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
