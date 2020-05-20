/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/milestone.js
 * Descr:    Sequelize controller for milestone.
 * Created:  2019-05-12
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-22
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const models = require("../models");
const Project = require("../models").Project;
const Task = require("../models").Task;
const Person = require("../models").Person;
const TaskStatus = require("../models").TaskStatus;
const TaskPriority = require("../models").TaskPriority;
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const mailer = require("./mailer");

module.exports = {
  create(req, res) {
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Milestone.create({
      title: req.body.title,
      description: req.body.description,
      statusId: req.body.statusId,
      orgId: req.body.orgId,
      targetDate: req.body.targetDate,
      projectId: parseInt(req.body.projectId),
      projectStartAt: new Date(req.body.projectStartAt),
      projectEndAt: new Date(req.body.projectEndAt)
    })
      .then(t => {
        logger.debug(`${callerType} create -> added Milestone, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        // Would like to handle the constraint error from the database if the milestone falls outside of the project
        // start and end date: "check constraint on Projects.startAt failed".  In the meantime, just assume
        // this is the error when we get a 400 code response.
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a milestone
  update(req, res) {
    const id = req.params.id;
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Milestone.update(
      {
        title: req.body.title,
        description: req.body.description,
        statusId: req.body.statusId,
        orgId: req.body.orgId,
        targetDate: req.body.targetDate,
        projectId: parseInt(req.body.projectId)
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update Milestone -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} update Milestone -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a milestone by Id
  findById(req, res) {
    return models.Milestone.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "project"
        },
        {
          model: Task,
          as: "tasks"
        },
        {
          model: TaskStatus,
          as: "status"
        }
      ]
    })
      .then(t => {
        logger.debug(`${callerType} Milestone findById -> id: ${t.id}`);
        res.status(200).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all milestones for a single project
  listByProject(req, res) {
    return models.Milestone.findAll({
      where: { projectId: req.params.projid },
      order: [["targetDate", "ASC"]],
      include: [
        {
          model: Project,
          as: "project"
        },
        {
          model: models.Task,
          as: "tasks",
          include: [
            {
              model: TaskStatus,
              as: "status"
            },
            {
              model: TaskPriority,
              as: "priority"
            },
            {
              model: Person,
              as: "assigned"
            }
          ]
        },
        {
          model: TaskStatus,
          as: "status"
        }
      ]
    })
      .then(milestones => {
        logger.debug(`${callerType} Milestone listByProject -> successful, count: ${milestones.length}`);
        res.status(201).send(milestones);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Save a Gantt chart
  async saveGantt(req, res) {
    const projectId = req.body.projectId;
    const jsonData = req.body.jsonData;
    
    const fetchSql = "select jsonData from Gantt where projectId = " + projectId;
    let newTaskOrReAssigned=null;
    try{
      const result =await models.sequelize.query( fetchSql, { type: models.sequelize.QueryTypes.SELECT })
      const existingJsonData=result[0].jsonData.data;
      const data=JSON.parse(jsonData).data;
      const newData=data.filter((reqData)=>{
        for(let i=0;i<existingJsonData.length;i++){
          if(existingJsonData[i].id==reqData.id && existingJsonData[i].assignedId==reqData.assignedId){
            return false;
          }
        }
        return true;
      })
     
      if(newData.length>0 && newData[0].assignedId){
        newTaskOrReAssigned=newData[0];
      }
    }catch(e){
      logger.debug(`${callerType} existingJsonData fetch error `);
    }
    
    const sql = "update Gantt set jsonData = '" + jsonData + "' where projectId = " + projectId + ";";
    
  
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.RAW
    })
      .then(async gantt => {
        logger.debug(`${callerType} Milestone saveGantt -> successful`);
        res.status(201).send(gantt);

        if(newTaskOrReAssigned){
          const person= await models.Person.findByPk(newTaskOrReAssigned.assignedId,{raw:true});
          const project= await models.Project.findByPk(projectId,{raw:true});

          const startDate=newTaskOrReAssigned.start_date.split(" ")[0];
          const endDate=newTaskOrReAssigned.end_date.split(" ")[0];

            var to = person.email;
            var subject = "Notification of task assignment";
           
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
                <td  style="font:17px Arial, Helvetica, sans-serif; color:#333;">The following task(s) has been assigned to you. The details of the task has been mentioned below.</td>
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
            margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Task Description </em> : ${newTaskOrReAssigned.text}</td>
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
            margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Assigned </em> : ${newTaskOrReAssigned.assigned}</td>
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
            margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Current Progress </em> : ${newTaskOrReAssigned.progressTxt}</td>
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
            margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> Start Date </em> : ${startDate} </td>
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
            margin-right: 10px;"></span> <em style="width:150px;font-style:normal;display:inline-block;"> End Date </em> : ${endDate} </td>
              </tr>
              <tr>
                <td height="20"></td>
              </tr>
              <tr>
                <td style="font:17px Arial, Helvetica, sans-serif; color:#333;">Open Task Link <a href="http://pie.value-infinity.com/project/${projectId}" target="_blank" style="color:#0B6CDA; text-decoration:underline;">http://pie.value-infinity.com/project/</td>
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
      })
      .catch(error => {
        logger.error(`${callerType} Milestone saveGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Save a Gantt chart
  createGantt(req, res) {
    const projectId = req.body.projectId;
    const orgId = req.body.orgId;
    const jsonData = req.body.jsonData;
    const sql = "insert into Gantt (orgId, projectId, jsonData) values (" + orgId + ", " + projectId +
      ", '" + jsonData + "')";
    logger.debug(`createGantt -> sql: ${sql}`);
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.RAW
    })
      .then(gantt => {
        logger.debug(`${callerType} Milestone saveGantt -> successful`);
        res.status(201).send(gantt);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone saveGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },
 
  // List all milestones for a single project for our Gantt chart.
  listForGantt(req, res) {
    const projectId = req.params.projid;
    /*
    const sql = "select t.id, t.title as text, t.startDate as start_date, t.endDate as end_date, " +
      "'task' as type, t.milestoneId as parent, datediff(t.endDate, t.startDate)  as duration " +
      "from Tasks t where t.projectId = " + projectId + " and t.milestoneId is not null " +
      "union select m.id, m.title as text, m.startDate as start_date, m.targetDate as end_date, " +
      "'milestone' as type, null as parent, null as duration " +
      "from Milestones m where m.projectId = " + projectId + " " +
      "order by parent, start_date, end_date;";    */
    const sql = "select jsonData from Gantt where projectId = " + projectId;

    return models.sequelize.query(
      sql, {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(milestones => {
        logger.debug(`${callerType} Milestone listForGantt -> successful, count: ${milestones.length}`);
        res.status(201).send(milestones);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone listForGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  saveComment(req, res) {
    logger.debug( `${callerType} saveComment called` );
    return models.TaskComment.create({
      description: req.body.description,
      taskId: req.body.taskId,
      projectId: req.body.projectId,
      personName: req.body.personName,
      createdAt: new Date(),
      updatedAt: new Date()
    })
      .then(t => {
        logger.debug(`${callerType} saveComment, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} saveComment -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  getComments(req, res) {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const sql = "select * from TaskComments where projectId = " + projectId+" and taskId = "+taskId+" order by createdAt desc";

    return models.sequelize.query(
      sql, {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(comments => {
        logger.debug(`${callerType} getComments -> successful, count: ${comments.length}`);
        res.status(201).send(comments);
      })
      .catch(error => {
        logger.error(`${callerType} getComments -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

};
