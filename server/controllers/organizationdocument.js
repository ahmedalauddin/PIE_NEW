"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const util = require("util");
const mailer = require("./mailer");

module.exports = {
   listByOrganization(req, res) {
  logger.debug(`${callerType} Organization Documents findAll by ORG ID`);
  return models.OrganizationDocument.findAll({
    
    include: [
      {
        model: models.Person,
        as: "person",
        required: true,
        attributes: ['firstName','lastName','disabled']
      },

    ],
    where: [
      {
        orgId: req.params.orgId,
        disabled: 0
      }
    ]
  })
    .then(_k => {
      logger.debug(
        `${callerType} Documents findByOrgId -> successful, title: ${_k}`
      );
      res.status(201).send(_k);
    })
    .catch(error => {
      logger.error(`${callerType} findById -> error: ${error.stack}`);
      res.status(400).send(error);
    });
},

  async deactivate(req, res) {
    const id = req.params.id;
    logger.debug(`${callerType} Deactivate -> Deactivate Document for id : ${id}`);
 
      return models.OrganizationDocument.update({
        disabled: true
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} Deactivate Organization Document`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Organization Document deactivated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },
//  // Find a Document by Id
 findById(req, res) {
  logger.error(`${callerType} Document Project, findById `);
  return models.OrganizationDocument.findByPk(req.params.id, {
    include: [
      {
        model: models.Person,
        as: "person"
      }
    ]
  })
    .then(_k => {
      logger.debug(
        `${callerType} findById -> successful, title: ${_k.title}`
      );
      res.status(201).send(_k);
    })
    .catch(error => {
      logger.error(`${callerType} findById -> error: ${error.stack}`);
      res.status(400).send(error);
    });
},

  async createDocument(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const fileName = req.file.filename;
    const orgId = req.params.orgId;
    const uploadBy = req.body.uploadBy;

    logger.debug(`${callerType} create -> New ORG Document for ORG id : ${orgId}`);
 
      return models.OrganizationDocument.create({
        title,
        description,
        fileName,
        orgId,
        uploadBy
      })
        .then(OrganizationDocument => {
         logger.debug(`${callerType} created ORG Document`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Organization Document " + title + " created successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} create -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  async updateorganizationdocument(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const id = req.params.id;
    
    logger.debug(`${callerType} Update -> Update Organization Document for id : ${id}`);
 
      return models.OrganizationDocument.update({
        title: title,
        description: description
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} Updated Organization Document`);
         
        })
        .then(() => {
         
          res.status(201).send({
            success: true,
            message: "Organization Document " + title + " updated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

//   projectPersonsForDocumentByProjectId(req, res) {
//     let sql = "select per.id, per.disabled, per.fullName from ProjectPersons pp, Persons per " +
//       "where per.disabled = 0 and pp.personId = per.id and (pp.inProject = 1 OR pp.owner = 1) and projectId = " + req.params.projectId + " " +
//       "order by per.fullName;";
//     return models.sequelize
//       .query(
//         sql,
//         {
//           type: models.sequelize.QueryTypes.SELECT
//         }
//       )
//       .then(p => {
//         logger.debug(`${callerType} projectPersonsForDocumentByProjectId -> ProjectId: ${req.params.projectId}`);
//         res.status(200).send(p);
//       })
//       .catch(error => {
//         logger.error(`${callerType} projectPersonsForDocumentByProjectId -> error: ${error.stack}`);
//         res.status(400).send(error);
//       });
//   },

};
