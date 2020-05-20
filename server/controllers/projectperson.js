/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/projectperson.js
 * Created:  2019-04-24
 * Author:   Brad Kaufman
 * Descr:    Sequelize controller for project persons.
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const Organization = require("../models").Organization;
const ProjectPerson = require("../models").ProjectPerson;
const models = require("../models");
const logger = require("../util/logger")(__filename);
const util = require("util");
const callerType = "controller";

module.exports = {
  
  update(req, res) {
    
    var jsonData = req.body.orgPersons;
    let sqlArrays = "";
    let sql = "";
    let isOwner = "";
    let isInProject = "";

    if (jsonData) {
      // Convert the JSON into some arrays for a SQL statement.
      for (var i = 0; i < jsonData.length; i++) {
        // Have to deal with null and true.  Replace null with '0', true with '1',
        // and false with '0'.
        switch (jsonData[i].owner) {
          case "null":
            isOwner = "0";
            break;
          case 1:
            isInProject = "1";
            break;
          case true:
            isOwner = "1";
            break;
          case "1":
            isOwner = "1";
            break;
          default:
            isOwner = "0";
        }
        switch (jsonData[i].inProject) {
          case "null":
            isInProject = "0";
            break;
          case true:
            isInProject = "1";
            break;
          case 1:
            isInProject = "1";
            break;
          case "1":
            isInProject = "1";
            break;
          default:
            isInProject = "0";
        }
        sqlArrays += "('" + jsonData[i].id + "', '" + req.params.projectId +
          "', '" + isOwner + "', '" + isInProject + "') ";
        if (i < jsonData.length - 1) {
          sqlArrays += ", ";
        }
      }
      sql = "INSERT into `ProjectPersons` " +
        "(personId, projectId, owner, inProject) " +
        "VALUES " + sqlArrays +
        "ON DUPLICATE KEY " +
        "UPDATE personId=values(personId), projectId=values(projectId), " +
        "owner=values(owner), inProject=values(inProject);"

      let _obj = util.inspect(req, { showHidden: false, depth: null });
      // logger.debug(`${callerType} update ProjectPerson -> request: ${_obj}`);
      logger.debug(`${callerType} update ProjectPerson -> sql: ${sql}`);

      return models.sequelize
        .query(sql)
        .then(([results, metadata]) => {
          // Results will be an empty array and metadata will contain the number of affected rows.
          res.status(201).send({ success: true, message: "Project Persons updated successful"});
        })
        .catch(error => {
          logger.error(`${callerType} findByProject -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
    else {
      logger.debug(`${callerType} update ProjectPerson -> no JSON data in request`);
      return "error - no JSON";
    }
  },

  // find a project and persons by project id.  Typical way to do this is likely just using the project
  // API instead.
  getProject(req, res) {
    let _obj = util.inspect(req.body, { showHidden: false, depth: null });
    logger.debug(`${callerType} ProjectPerson.getProject -> request: ${_obj}`);
    const projectId = req.params.projectId;
    return ProjectPerson.findAll( {
      where: {
        projectId: projectId
      }
    })
      .then(p => {
        logger.info(`${callerType} getProject -> successful, 
          title: ${p ? p.title : "not found"}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} getProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }

};
