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
        .then(async () => {
          if(assigneeId){
            var person = await models.Person.findByPk(assigneeId,{raw:true});
            const project= await models.Project.findByPk(projectId,{raw:true});
              // console.log('createProjectAction-----------------------userAssigneeuserAssigneeuserAssignee-',respons);
              var to = person.email;
              var subject = "Notification of action assignment";
              //var text = "Hi "+respons.firstName+", A new action '"+title+"' is assigned to you."
              var text =`<!doctype html>
              <html>
              <head>
              <meta charset="utf-8">
              <title>::::</title>
              <style>
              body {
                margin: 0;
                padding: 0;
              }
              </style>
              </head>
              
              <body>
              <table border="0" width="750" style="padding:0; margin:0;">
                <tr>
                  <td style="font:17px Arial, Helvetica, sans-serif; color:#333;">Hello ${person.firstName}, </td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
                <tr>
                  <td  style="font:17px Arial, Helvetica, sans-serif; color:#333;">The following action has been assigned to you. The details of the action has been mentioned below.</td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
                <tr>
                  <td  style="font:16px/30px Arial, Helvetica, sans-serif; color:#333; font-weight:bold; padding-left:30px;"><span style="height: 8px;
              width: 8px;
              border-radius: 50%;
              border: 0;
              background: #333;
              display: inline-block;
              position: relative;
              top: -2px;
              margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Project Title </em> : ${project.title}</td>
                </tr>
                <tr>
                  <td  style="font:16px/30px Arial, Helvetica, sans-serif; color:#333; font-weight:bold;padding-left:30px;"><span style="height: 8px;
              width: 8px;
              border-radius: 50%;
              border: 0;
              background: #333;
              display: inline-block;
              position: relative;
              top: -2px;
              margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Action Title </em> : ${title}</td>
                </tr>
                <tr>
                  <td style="font:16px/30px Arial, Helvetica, sans-serif; color:#333; font-weight:bold;padding-left:30px;"><span style="height: 8px;
              width: 8px;
              border-radius: 50%;
              border: 0;
              background: #333;
              display: inline-block;
              position: relative;
              top: -2px;
              margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Action Description </em> : ${description}</td>
                </tr>
                <tr>
                  <td style="font:16px/30px Arial, Helvetica, sans-serif; color:#333; font-weight:bold;padding-left:30px;"><span style="height: 8px;
              width: 8px;
              border-radius: 50%;
              border: 0;
              background: #333;
              display: inline-block;
              position: relative;
              top: -2px;
              margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Assigned to </em> : ${person.firstName +'' +person.lastName}</td>
                </tr>
                <tr>
                  <td style="font:16px/30px Arial, Helvetica, sans-serif; color:#333; font-weight:bold;padding-left:30px;"><span style="height: 8px;
              width: 8px;
              border-radius: 50%;
              border: 0;
              background: #333;
              display: inline-block;
              position: relative;
              top: -2px;
              margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Status </em> : ${status} </td>
                </tr>
                
                <tr>
                  <td height="20"></td>
                </tr>
                <tr>
                  <td style="font:17px Arial, Helvetica, sans-serif; color:#333;">Open Task Link <a href="http://pie.value-infinity.com/project/" target="_blank" style="color:#0B6CDA; text-decoration:underline;">http://pie.value-infinity.com/project/</td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
                <tr>
                  <td style="font:italic 15px Arial, Helvetica, sans-serif; color:#333;">This is an system generated email, please do not reply to this email</td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
                <tr>
                  <td style="font:17px Arial, Helvetica, sans-serif; color:#333;">Thanks</td>
                </tr>
                <tr>
                  <td style="font:17px Arial, Helvetica, sans-serif; color:#333;">Team Value-Infinity.</td>
                </tr>
              </table>
              </body>
              </html>
              `;
              
              mailer.sendMail(to,subject,text);
            

            
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
