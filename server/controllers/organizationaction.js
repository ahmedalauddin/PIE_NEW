"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {

  // Find a Action Project by Id
  listByOrganization(req, res) {
    const where= [
      {
        orgId: req.params.orgId,
        disabled: 0,
        dateAdded:req.params.dateAdded
      }
    ]

    
    logger.info(`${callerType} Action Organization, findAll where ${JSON.stringify(where)}`);
    return models.OrganizationAction.findAll({
      
      include: [
        {
          model: models.Organization,
          as: "organization"
        },
        {
          model: models.Person,
          as: "person",
          
        },
  
      ],
      where
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


  // List all Actions for a single Organization
  listByOrganizationOld(req, res) {
    let sql = "select * from OrganizationActions " +
      "where orgId = " + req.params.orgId + " and disabled = 0";
    logger.debug(`${callerType} Get OrganizationActions by OrgId -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} Get OrganizationActions by OrgId -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} Get OrganizationActions by OrgId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  organizationActionPersons(req, res) {
    let orgId = req.params.orgId;
    // let sql = "select P.id, P.fullName, P.email, P.role, P.orgId, D.name as department, \
    //   (select group_concat(title) from Projects Pr, ProjectPersons PP \
    //   where Pr.id = PP.projectId and PP.personId = P.id order by Pr.title) as projects \
    //   from Persons P left outer join Departments D on P.deptId = D.id \
    //   where P.orgId = " + orgId + " and P.disabled = false  \
    //   order by P.fullName";

    let sql = "select P.id, P.fullName, P.email, P.role, P.orgId, \
              D.name as department, getProjectListForPerson(P.id) as projects \
              from Persons P \
              left outer join Departments D on P.deptId = D.id \
              where (P.orgId = " + orgId + "  \
              or P.id in (select personId from OrganizationPersons OP where OP.organizationId = " + orgId + ")) \
              and P.disabled = false \
              order by P.fullName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} findByOrganization -> sql: ${orgId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByOrganization -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

 // Find a Action Organization by Id
 findById(req, res) {
  logger.error(`${callerType} Action Organization, findById `);
  return models.OrganizationAction.findByPk(req.params.id, {
    include: [
      {
        model: models.Organization,
        as: "organization"
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

  async createOrganizationAction(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const organizationId = req.params.orgId;
    const status = req.body.status;
    const assigneeId = req.body.assigneeId;
    const dateAdded = req.body.dateAdded;
    logger.debug(`${callerType} create -> New Organization Action for Organization id : ${organizationId}`);
 
      return models.OrganizationAction.create({
        title: title,
        description: description,
        orgId: organizationId,
        status: status,
        assigneeId: assigneeId,
        dateAdded: dateAdded,
        createdAt:new Date(dateAdded)
      })
        .then(OrganizationAction => {
         logger.debug(`${callerType} created OrganizationAction`);
         
        })
        .then(() => {
        
          res.status(201).send({
            success: true,
            message: "Organization Action " + title + " created successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} create -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  async updateOrganizationAction(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const id = req.params.actionId;
    const status = req.body.status;
    const assigneeId = req.body.assigneeId;
    const projectActions = req.body.projectActions;
    logger.debug(`${callerType} Update -> Update Organization Action for Organization id : ${id}`);
 
      return models.OrganizationAction.update({
        title: title,
        description: description,
        assigneeId: assigneeId,
        status:status,
        projectActions
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(OrganizationAction => {
         logger.debug(`${callerType} Updated OrganizationAction`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Organization Action updated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },


  async deactivateOrganizationAction(req, res) {
    const id = req.params.actionId;
    logger.debug(`${callerType} Deactivate -> Deactivate Organization Action for id : ${id}`);
 
      return models.OrganizationAction.update({
        disabled: true
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(OrganizationAction => {
         logger.debug(`${callerType} Deactivate OrganizationAction`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Organization Action deactivated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  copyAction(req, res) {
    logger.info(`${callerType} Action Organization, copyAction `);
    let sql = "select * from OrganizationActions " +
              "where orgId = " + req.params.orgId + " and assigneeId="+req.params.assigneeId +
              " and description<>'' and disabled = 0 order by createdAt desc limit 1";
    logger.debug(`${callerType} Get OrganizationActions by OrgId -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} Get copyAction by OrgId -> successful, count: ${_k.length}`);

        if(_k && _k.length){
          models.OrganizationAction.update({
            description: _k[0].description
          },
          {
            returning: true,
            where: {
              id: req.params.actionId
            }
          }) .then(_k => {
            res.status(201).send(_k);
          }).catch(error => {
            logger.error(`${callerType} Get copyAction by OrgId -> error: ${error.stack}`);
            res.status(400).send(error);
          });
        }else{
          res.status(201).send(_k);
        }
      })
      .catch(error => {
        logger.error(`${callerType} Get copyAction by OrgId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },
  meetingDays(req, res) {
    logger.info(`${callerType} called meetingDays`);
    let sql = "select distinct dateAdded from OrganizationActions where orgId = " + req.params.orgId + " and disabled = 0";

    logger.debug(`${callerType} meetingDays -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} meetingDays -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} meetingDays -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
