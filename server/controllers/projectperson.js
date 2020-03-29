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
  // Update persons for a project.  This may need to be a loop and update the entries
  // sequentially, including those removed from a project.  The update will need to have multiple
  // rows updated.
  update(req, res) {
    console.log('req--',req.params.projectId);
    // console.log('res--',res);
    // Update ProjectPerson with SQL similar to this example.
    /*
      INSERT into `projectpersons`
      (projectId, personId, owner)
      VALUES
      ('69', '118', '0', null),
        ('67', '118', '1', true),
        ('66', '118', '0', null),
        ('34', '118', '1', '1'),
        ('55', '118', '0', null),
        ('8', '118', '0', null),
        ('7', '118', '0', null)
      ON DUPLICATE KEY
      UPDATE projectId=projectId, personId=personId, owner=owner;
     */

    // Break the input json down into an array and we can update with one SQL statement.
    // Use JSON.parse.
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

        console.log("Start---------------------------------------");
        console.log(sql);
        console.log("End---------------------------------------");
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
