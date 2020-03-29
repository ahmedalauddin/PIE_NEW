"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const util = require("util");
const mailer = require("./mailer");

module.exports = {
  // List all KPIs for a single project
  findAll(req, res) {
    let sql = "select * from ProjectActions " +
      "where projid = " + req.params.projid + " and disabled = 0";
    logger.debug(`${callerType} Get ProjectActions by ProjectId -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} Get ProjectActions by ProjectId -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} Get ProjectActions by ProjectId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },
  
  projectActionPersonsByProjectId(req, res) {
    let sql = "select per.id, per.disabled, per.fullName from ProjectPersons pp, Persons per " +
      "where per.disabled = 0 and pp.personId = per.id and (pp.inProject = 1 OR pp.owner = 1) and projectId = " + req.params.projectId + " " +
      "order by per.fullName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} projectActionPersonsByProjectId -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} projectActionPersonsByProjectId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

   // Find a Action Project by Id
   listByProject(req, res) {
  logger.error(`${callerType} Action Project, findAll `);
  return models.ProjectAction.findAll({
    
    include: [
      {
        model: models.Project,
        as: "project"
      },
      {
        model: models.Person,
        as: "person",
        
      },

    ],
    where: [
      {
        projId: req.params.projid,
        disabled: 0
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

 // Find a Action Project by Id
 findById(req, res) {
  logger.error(`${callerType} Action Project, findById `);
  return models.ProjectAction.findByPk(req.params.id, {
    include: [
      {
        model: models.Project,
        as: "project"
      },
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

  async createProjectAction(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const projectId = req.params.projid;
    const assigneeId = req.body.assigneeId;
    logger.debug(`${callerType} create -> New Project Action for project id : ${projectId}`);
 
      return models.ProjectAction.create({
        title: title,
        description: description,
        status: status,
        projId: projectId,
        assigneeId: assigneeId
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} created ProjectAction`);
         
        })
        .then(() => {
          if(assigneeId){
            var userAssignee = models.Person.findByPk(assigneeId,{raw:true}).then((respons)=>{
              // console.log('createProjectAction-----------------------userAssigneeuserAssigneeuserAssignee-',respons);
              var to = respons.email;
              var subject = "Valueinfinity - New Action assigned.";
              var text = "Hi "+respons.firstName+", A new action '"+title+"' is assigned to you."
              mailer.sendMail(to,subject,text);
            })

            
          }
          res.status(201).send({
            success: true,
            message: "Project Action " + title + " created successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} create -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  async updateProjectAction(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const id = req.params.actionId;
    const assigneeId = req.body.assigneeId;
    logger.debug(`${callerType} Update -> Update Project Action for id : ${id}`);
 
      return models.ProjectAction.update({
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
        .then(ProjectAction => {
         logger.debug(`${callerType} Updated ProjectAction`);
         
        })
        .then(() => {
          if(assigneeId){
            var userAssignee = models.Person.findByPk(assigneeId,{raw:true}).then((respons)=>{
              // console.log('updateProjectAction-----------------userAssigneeuserAssigneeuserAssignee-',respons);
              var to = respons.email;
              var subject = "Valueinfinity - Action Updated.";
              var text = "Hi "+respons.firstName+", An existing Action '"+title+"' is updated recently that is assigned to you."
              mailer.sendMail(to,subject,text);
            })

            
          }
          res.status(201).send({
            success: true,
            message: "Project Action " + title + " updated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },


  async deactivateProjectAction(req, res) {
    const id = req.params.actionId;
    logger.debug(`${callerType} Deactivate -> Deactivate Project Action for id : ${id}`);
 
      return models.ProjectAction.update({
        disabled: true
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectAction => {
         logger.debug(`${callerType} Deactivate ProjectAction`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Project Action deactivated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },
};
