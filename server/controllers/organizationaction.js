"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const util = require("util");
const mailer = require("./mailer");

module.exports = {

  // Find a Action Project by Id
  listByOrganization(req, res) {
    const where= [
      {
        orgId: req.params.orgId,
        disabled: 0
      }
    ]

    if(req.params.createdAt){
      const startDate=new Date(req.params.createdAt);
      const endDate = new Date(req.params.createdAt);
      endDate.setHours( endDate.getHours() + 24 );
      
      where.push({createdAt:{
          $lt: endDate,
          $gt: startDate
      }})
    }
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
    logger.debug(`${callerType} create -> New Organization Action for Organization id : ${organizationId}`);
 
      return models.OrganizationAction.create({
        title: title,
        description: description,
        orgId: organizationId,
        status: status,
        assigneeId: assigneeId
      })
        .then(OrganizationAction => {
         logger.debug(`${callerType} created OrganizationAction`);
         
        })
        .then(() => {
          if(assigneeId){
            var userAssignee = models.Person.findByPk(assigneeId,{raw:true}).then((respons)=>{
              // console.log('createOrganizationAction-----------------userAssigneeuserAssigneeuserAssignee-',respons);
              var to = respons.email;
              var subject = "Valueinfinity - New Action assigned.";
              var text = "Hi "+respons.firstName+", A new action '"+title+"' is assigned to you."
              mailer.sendMail(to,subject,text);
            })

            
          }
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
    logger.debug(`${callerType} Update -> Update Organization Action for Organization id : ${id}`);
 
      return models.OrganizationAction.update({
        title: title,
        description: description,
        assigneeId: assigneeId,
        status:status,
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
          if(assigneeId){
            var userAssignee = models.Person.findByPk(assigneeId,{raw:true}).then((respons)=>{
              // console.log('updateOrganizationAction-----------------userAssigneeuserAssigneeuserAssignee-',respons);
              var to = respons.email;
              var subject = "Valueinfinity - Action Updated.";
              var text = "Hi "+respons.firstName+", An existing Action '"+title+"' is updated recently that is assigned to you."
              mailer.sendMail(to,subject,text);
            })      
          }
          res.status(201).send({
            success: true,
            message: "Organization Action " + title + " updated successfully"
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
};
