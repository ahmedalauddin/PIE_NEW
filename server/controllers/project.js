/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/project.js
 * Created:  2019-02-01 12:39:20
 * Author:   Darrin Tisdale
 * Descr:    Sequelize controller for projects.
 * -----
 * Modified: 2019-02-26 17:57:47
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const KPI = require("../models").Kpi;
const Task = require("../models").Task;
const ProjectStatus = require("../models").ProjectStatus;
const Person = require("../models").Person;
const Milestone = require("../models").Milestone;
const models = require("../models");
const logger = require("../util/logger")(__filename);
const util = require("util");
const callerType = "controller";
const ProjectComment = require("../models").ProjectComment;

module.exports = {
  // Creates a project in the Project table, then inserts into ProjectPersons, setting its
  // `inProject` flag to false for all people.
  create(req, res) {
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} create -> request: ${_obj}`);
    return Project.create({
      title: req.body.title,
      description: req.body.description,
      orgId: parseInt(req.body.orgId),
      mainKpiId: req.body.mainKpiId,
      businessGoal: req.body.businessGoal,
      mindmapId: req.body.mindmapId,
      nodeId: req.body.nodeId,
      summary: req.body.summary,
      progress: parseInt(req.body.progress),
      startAt: req.params.startDate,
      endAt: req.params.endDate,
      deptId: req.body.deptId,
      statusId:req.body.statusId
    })
      .then(async p => {
        // SQL to insert all people from the org into the ProjectPersons table with
        // the project id.
        let projectId = p.id;
        let sql = "INSERT into `ProjectPersons` " +
          "(personId, projectId, owner, inProject)  " +
          "Select Pe.id, " + projectId + ", 0, 0 from Organizations O, Projects P, Persons Pe  " +
          "where O.id = P.orgId and Pe.orgId = O.id and P.id = " + projectId + " " +
          "ON DUPLICATE KEY UPDATE personId=values(personId)";
        logger.debug(`${callerType} update ProjectPerson -> sql: ${sql}`);
        await models.sequelize.query(`update Projects set statusId=${req.body.statusId} where id = ${projectId}`)
        await models.sequelize.query(sql);
        logger.info(`${callerType} create -> successful, id: ${p.id}`);
        res.status(201).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  createAndReturnNewProjectId(req, res) {
    // let _obj = util.inspect(req, { showHidden: false, depth: null });
    // logger.debug(`${callerType} create -> request: ${_obj}`);
    const createObject={
      title: req.body.title,
      description: req.body.description,
      orgId: parseInt(req.body.orgId),
      mainKpiId: req.body.mainKpiId,
      businessGoal: req.body.businessGoal,
      mindmapId: req.body.mindmapId,
      nodeId: req.body.nodeId,
      summary: req.body.summary,
      progress: parseInt(req.body.progress),
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      deptId: req.body.deptId,
      statusId:req.body.statusId
    };
    return Project.create(createObject)
      .then(async p => {
        // SQL to insert all people from the org into the ProjectPersons table with
        // the project id.
        let projectId = p.id;
        let sql = "INSERT into `ProjectPersons` " +
          "(personId, projectId, owner, inProject)  " +
          "Select Pe.id, " + projectId + ", 0, 0 from Organizations O, Projects P, Persons Pe  " +
          "where O.id = P.orgId and Pe.orgId = O.id and P.id = " + projectId + " " +
          "ON DUPLICATE KEY UPDATE personId=values(personId)";
        logger.debug(`${callerType} update ProjectPerson -> sql: ${sql}`);

        await models.sequelize.query(`update Projects set statusId=${req.body.statusId} where id = ${projectId}`)
        await models.sequelize.query(sql);

        if(projectId){
          res.status(201).send({
            projectId:projectId,
            success: true,
            message: "Project " + req.body.title + " created successfully"
          });
        }else{
          res.status(201).send({
            success: false,
            message: "Eror in creating Project."
          });
        }
      })
     
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Creates project with KPI
  // TODO: look at persons associated with the project, see the create method above.
  createOrUpdateProjectWithKpi(req, res) {
    // let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} createOrUpdateProjectWithKpi -> `);

    const index = req.body.indexSubmitted;
    const projTitle = req.body.kpis[index].projTitle;
    const projDescription = req.body.kpis[index].projDescription;
    const mainKpiId = req.body.kpiProjectSubmitted;
    const orgId = req.body.orgId;
    let message = "";
    /**
     *  Call the setProject stored procedure, which inserts or updates a project, depending on whether a project
     *  exists for the KPI and org.  Note that we call the stored procedure with @returnText as its output parameter,
     *  call the proc, then select the output parameter.  This is because Sequelize does not support output parameters
     *  from stored procedures, we use this approach.  See https://github.com/sequelize/sequelize/issues/7060 for
     *  details.
     */
    /**
     * Try this code later
     * const sql = "set @returnText = null; " +
     *   "call setProject(" +  mainKpiId + ", " + orgId + ", '" + title + "', '" + description + "', @returnText); " +
     *   "SELECT @returnText;";
     */
    const sql = "call setProject(" +  mainKpiId + ", " + orgId + ", '" + projTitle + "', '" + projDescription + "', @message); ";
    return models.sequelize.query(
      sql, {
      type: models.sequelize.QueryTypes.RAW
    })
      .then(statusText => {
        logger.info(`${callerType} createOrUpdateProjectWithKpi -> returned text`);
        res.status(200).send(statusText);
      })
      .catch(error => {
        logger.error(`${callerType} createOrUpdateProjectWithKpi -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a project
  async update(req, res) {
    //logger.debug(`${callerType} project update -> request: ${_obj}`);
    if (req.query.mmid && req.query.nid) {
      let _obj = util.inspect(req, { showHidden: false, depth: null });
     
    

      return Project.update(
        {
          title: req.body.title,
          description: req.body.description,
          businessGoal: req.body.businessGoal,
          summary: req.body.summary,
          mainKpiId: req.body.mainKpiId,
          progress: req.body.progress,
          startAt: req.body.startAt,
          endAt: req.body.endAt,
          statusId: req.body.statusId,
          deptId: req.body.deptId
        },
        {
          returning: true,
          where: {
            mindmapId: parseInt(req.body.mmid),
            nodeId: parseInt(req.body.nid)
          }
        }
      )
        .then(p => {
          logger.info(`${callerType} updateByMindMapNode -> 
          successful, id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} updateByMindMapNode -> 
          error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
     
      let _id = parseInt(req.body.id);

      const updateObject={
        title: req.body.title,
        description: req.body.description,
        businessGoal: req.body.businessGoal,
        summary: req.body.summary,
        mainKpiId: req.body.mainKpiId,
        progress: req.body.progress,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        statusId: req.body.statusId,
        deptId: req.body.deptId,
      };
      if(req.body.statusId==4){
        const sql =  `SELECT statusId FROM Projects where id=${_id}`;
        const result = await models.sequelize.query(sql, {type: models.sequelize.QueryTypes.SELECT})
        if(result.length>0 && result[0].statusId != 4){
          updateObject.completedAt=new Date();
          logger.info(`${callerType} updating  completedAt : ${_id}`);
        }
      }
      console.log(updateObject)
      
      return Project.update(
        updateObject,
        {
          returning: true,
          where: { id: _id }
        }
      )
        .then(p => {
          logger.info(`${callerType} update -> successful, id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  // find a project by id
  findById(req, res) {
    
    logger.debug(`${callerType} findById -> request: ${req.params.id}`);
    return Project.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: Task,
          as: "tasks"
        },
        {
          model: ProjectStatus,
          as: "status"
        },
        {
          model: Person,
          as: "team"
        },
        {
          model: Milestone,
          as: "milestones"
        }
      ]
    })
      .then(p => {
        if(p && p.id){
          let sql = "SELECT  pk.id as pkid,pk.id as pkid,k.* "+
          "FROM ProjectKpis pk,Projects p,Kpis k,Organizations o "+
          "where pk.projId=p.id and  pk.kpiId=k.id and k.orgId = o.id and pk.projId="+p.id;
          models.sequelize
          .query(sql,
            {
              type: models.sequelize.QueryTypes.SELECT
            }
          )
          .then(_k => {
            logger.debug(`${callerType} project kpis -> successful, count: ${_k.length}`);
            p.dataValues.kpis=_k;
            res.status(200).send(p);
          })
          .catch(error => {
            logger.error(`${callerType} project kpis -> error: ${error.stack}`);
            res.status(400).send(error);
          });

        } else{ 
          res.status(200).send(p);
        }
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },


  // destroy a project by id
  deactivate(req, res) {
    
      let _obj = util.inspect(req.body, { showHidden: false, depth: null });
      logger.debug(`${callerType} deactivate -> request: ${_obj}`);
      return Project.update({
        active: 0
      },{
        where: { id: parseInt(req.params.id) }
      })
        .then(([p,d]) => {
          // logger.info(`${callerType} deactivate -> successful, count: ${p}`);
          // res.status(200).send(p);
          if(p === 1){
            res.status(200).send({
              success: true,
              message: "Project deactivated"
            });
          }else{
            res.status(200).send({
              success: true,
              message: "Something went wrong"
            });
          }
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },


  // destroy a project by id
  destroy(req, res) {
    if (req.query.mmid && req.query.nid) {
      logger.debug(
        `${callerType} findForMindMapNode -> 
          mmid: ${req.body.mmid}, nid: ${req.body.nid}`
      );
      return Project.destroy({
        where: {
          mindmapId: parseInt(req.body.mmid),
          nodeId: parseInt(req.body.nid)
        }
      })
        .then(p => {
          logger.info(`${callerType} destroyByMindMapNode -> 
          successful, count: ${p}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} destroyByMindMapNode -> 
          error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      let _obj = util.inspect(req.body, { showHidden: false, depth: null });
      logger.debug(`${callerType} destroy -> request: ${_obj}`);
      return Project.destroy({
        where: { id: parseInt(req.body.id) }
      })
        .then(p => {
          logger.info(`${callerType} destroy -> successful, count: ${p}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} destroy -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  // Find an org by Id
  findByOrganization(req, res) {
    logger.debug(`${callerType} findByOrganization -> id = ${req.params.id}`);

    let sql="select pk.id as pkid,P.id, P.title, P.description, K.title as mainKpi "+
            "FROM ProjectKpis pk,Projects p,Kpis k,Organizations o "+
            "where pk.projId=p.id and  pk.kpiId=k.id and k.orgId = o.id and p.orgId = " + req.params.orgid

    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(org => {
        logger.info(`${callerType} findByOrganization -> returned`);
        res.status(200).send(org);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // Get a range of the years of projects for an organization.  We'll use this to create a dropdown list for
  // a filter in React.
  getProjectYears(req, res) {
    let orgId = 0;
    let sql = "";
    logger.debug(`${callerType} getProjectYears -> id = ${req.params.orgId}`);
    if (req.params.orgId) {
      orgId = req.params.orgId;
      sql = "select min(Year(P.startAt)) as beginYear, max(Year(P.endAt)) as endYear \
        from Projects P  where P.orgId = " + orgId + " limit 1";
    } else {
      sql = "select min(Year(P.startAt)) as beginYear, max(Year(P.endAt)) as endYear \
        from Projects P";
    }
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(years => {
        logger.info(`${callerType} getProjectYears -> returned`);
        res.status(200).send(years);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // get projects by organization
 /* getProjectDashboard(req, res) {
    let sql = "select P.id, P.orgId, P.title as `projectTitle`, PS.label as `status`, K.title as `mainKpi`,\
      P.progress, P.startAt, P.endAt, \
      (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName)) from ProjectPersons PP, Persons Per \
      where P.id = PP.projectId and Per.id = PP.personId and PP.owner = '1') as owners, \
      (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName)) from ProjectPersons PP, Persons Per\
      where P.id = PP.projectId and Per.id = PP.personId) as team, \
      (select group_concat(concat(' ', T.title)) from Tasks T where T.projectId = P.id) as tasks \
      from Projects P left outer join ProjectStatuses PS on P.statusId = PS.id \
      left outer join Kpis K on P.mainKpiId = K.id  \
      where P.orgId = " + req.params.orgId + " order by P.title";
    logger.debug(`${callerType} Project: getProjectDashboard -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT,
          limit: 100
        }
      )
      .then(projects => {
        res.status(200).send(projects);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },*/

  // get projects by organization
  getProjectFilteredDashboard(req, res) {
    try {
      let i = 0;
      const orgId = req.body.orgId;
      const status = req.body.statusFilter;
      const startYears = req.body.startYearFilter;
      const endYears = req.body.endYearFilter;
      const allClients = req.body.allClients;  
      const personId = req.body.userId;     // For whether to filter by a single client organization.
      let firstClause = true;
      let orgClause = "";
      let statusClause = "";
      let statusList = "";
      let startYearClause = "";
      let endYearClause = "";
      let first = true;
      let activeCl = "";
      let personClause = "";
      logger.debug(`${callerType} Project: getProjectFilteredDashboard------------------------------------`);
      
      //<editor-fold desc="Build filter SQL text for the where clauses">
      // Build clause to filter by client organization.
      if (!allClients) {
        if (req.body.orgId) {
          if (firstClause) {
            orgClause = " where ";
            firstClause = false;
          } else {
            orgClause = " and ";
          }
          orgClause += " P.orgId = " + orgId;
        }
      }

      // Build clause to filter on status.
      if (status && status.length >= 1) {
        for (i = 0; i < status.length; i++) {
          status[i] = "'" + status[i] + "'";
        }
        statusList = status.join();
        if (firstClause) {
          statusClause = " where ";
          firstClause = false;
        } else {
          statusClause = " and ";
        }
        statusClause += " PS.label in (" + statusList + ")";
      }
      logger.debug(`${callerType} Project: getProjectFilteredDashboard -> past status`);

      // Build clause to filter on project start year.
      first = true;
      if (startYears && startYears.length >= 1) {
        logger.debug(`${callerType} Project: getProjectFilteredDashboard -> start year, startYears.length: ${startYears.length}`);
        for (i = 0; i < startYears.length; i++) {
          if (!first) {
            startYearClause += " or Year(P.startAt) = " + startYears[i] + " ";
          } else {
            first = false;
            startYearClause = " Year(P.startAt) = " + startYears[i] + " ";
          }
        }
        if (firstClause) {
          logger.debug(`${callerType} Project: getProjectFilteredDashboard -> start year, firstClause: ${firstClause}`);
          startYearClause = " where (" + startYearClause + ")";
          firstClause = false;
        } else {
          startYearClause = " and (" + startYearClause + ")";
        }
      }
      logger.debug(`${callerType} Project: getProjectFilteredDashboard -> past start year, startYearClause: ${startYearClause}`);

      // Build clause to filter on project start year.
      first = true;
      if (endYears && endYears.length >= 1) {
        for (i = 0; i < endYears.length; i++) {
          if (!first) {
            endYearClause += " or Year(P.endAt) = " + endYears[i] + " ";
          } else {
            first = false;
            endYearClause = " Year(P.endAt) = " + endYears[i] + " ";
          }
        }
        if (firstClause) {
          endYearClause = " where (" + endYearClause + ")";
          firstClause = false;
        } else {
          endYearClause = " and (" + endYearClause + ")";
        }
      }

      if (firstClause) {
        activeCl = " where ";
        firstClause = false;
      } else {
        activeCl = " and ";
      }
      activeCl += " P.active=1 ";


      if(personId>0){
        personClause=` and P.id in (select distinct projectId from ProjectPersons where personId=${personId} and (inProject=1 or owner=1)) `;
      }
      logger.debug(`${callerType} Project: getProjectFilteredDashboard -> past end year, endYearClause: ${endYearClause}`);
      //</editor-fold>

      // Updated SQL using a new function, getTopTasks().
      let sql = "select P.id,P.active, P.orgId, P.title as `projectTitle`, PS.label as `status`,K.id as `mainKpiId`, K.title as `mainKpi`, O.name as organization, \
        P.progress, P.startAt, P.endAt, json_array(getTopTasks(3, P.id)) as tasks, \
        (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName) ORDER BY Per.firstName ASC) from ProjectPersons PP, Persons Per  \
        where P.id = PP.projectId and Per.id = PP.personId and PP.owner = '1' and Per.disabled = 0) as owners, \
        (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName) ORDER BY Per.firstName ASC) from ProjectPersons PP, Persons Per  \
        where P.id = PP.projectId and Per.id = PP.personId and PP.inProject = '1' and Per.disabled = 0) as team \
        from Projects P left outer join ProjectStatuses PS on P.statusId = PS.id \
        left outer join Organizations O on P.orgId = O.id \
        left outer join Kpis K on P.mainKpiId = K.id and K.active = 1 "
        + orgClause + statusClause + startYearClause + endYearClause + activeCl + personClause + " order by P.title";

      logger.debug(`${callerType} Project: getProjectFilteredDashboard -> sql: ${sql}`);
      return models.sequelize
        .query(sql,
          {
            type: models.sequelize.QueryTypes.SELECT,
            limit: 50
          }
        )
        .then(projects => {
          res.status(200).send(projects);
        })
        .catch(error => {
          logger.error(error.stack);
          res.status(400).send(error);
        });
    } catch (error) {
      console.log("getProjectFilteredDashboard, exception: " + error);
    }
  },

  // get projects
  // TODO: may need to use getTopTasks function here.
  getAllProjects(req, res) {
    let sql = "select P.id, P.orgId, P.title as `projectTitle`, PS.label as `status`, K.title as `mainKpi`, O.name as organization, \
      P.progress, P.startAt, P.endAt, (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName)) from ProjectPersons PP, \
      Persons Per where P.id = PP.projectId and Per.id = PP.personId and PP.owner = '1') as owners, \
      (select group_concat(concat(' ', T.title)) from Tasks T where T.projectId = P.id) as tasks \
      from Projects P left outer join ProjectStatuses PS on P.statusId = PS.id \
      left outer join Organizations O on P.orgId = O.id  \
      left outer join Kpis K on P.mainKpiId = K.id  \
      order by P.title";
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT,
          limit: 100
        }
      )
      .then(projects => {
        res.status(200).send(projects);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // List most recent projects
  getMostRecent(req, res) {
    // SQL for most recent projects.
    // TODO - factor out KpiProjects, we're not using it now.
    /*
    let sql  = "select id, title, description, startAt, ProjectUpdated, " +
    "    greatest(ProjectUpdated, COALESCE(TUdate, '2000-01-01'), " +
    "      COALESCE(TCdate, '2000-01-01'), COALESCE(KUdate, '2000-01-01'), " +
    "      COALESCE(KCdate, '2000-01-01')) as MostRecent from " +
    " (select  P.id as id, P.title, P.description, P.startAt, P.updatedAt as ProjectUpdated , " +
    "   (select max(T.updatedAt) from Tasks T where T.projectId = P.id) as TUdate, " +
    "   (select max(T.createdAt) from Tasks T where T.projectId = P.id) as TCdate, " +
    "   (select max(K.updatedAt) from Kpis K, KpiProjects KP where K.id = KP.kpiId " +
    "      and P.id = KP.projectId) as KUdate, " +
    "   (select max(K.createdAt) from Kpis K, KpiProjects KP where K.id = KP.kpiId " +
    "      and P.id = KP.projectId) as KCdate " +
    "   from Projects P) as Proj "; */
    let sql = "";
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT,
          limit: 3,
          order: [["MostRecent", "DESC"]]
        }
      )
      .then(projects => {
        res.status(200).send(projects);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // find all projects
  list(req, res) {
    if (req.query.mmid && req.query.nid) {
      logger.debug(
        `${callerType} findForMindMapNode -> 
          mmid: ${req.query.mmid}, nid: ${req.query.nid}`
      );
      return Project.findOne({
        where: {
          mindmapId: parseInt(req.query.mmid),
          nodeId: parseInt(req.query.nid)
        },
        order: [["title", "DESC"]]
      })
        .then(proj => {
          logger.info(
            `${callerType} findByMindMapNode -> successful, 
            id: ${proj ? proj.id : "none found"}`
          );
          res.status(200).send(proj);
        })
        .catch(error => {
          logger.error(
            `${callerType} findByMindMapNode -> error: ${error.stack}`
          );
          res.status(400).send(error);
        });
    } else if (req.query.mmid) {
      logger.debug(`${callerType} findForMindMap -> mmid: ${req.query.mmid}`);
      return Project.findAll({
        where: { mindmapId: parseInt(req.query.mmid) },
        order: [["title", "DESC"]]
      })
        .then(projs => {
          logger.info(
            `${callerType} findForMindMap -> successful, count: ${projs.length}`
          );
          res.status(200).send(projs);
        })
        .catch(error => {
          logger.error(`${callerType} findForMindMap -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      logger.debug(`${callerType} list -> requested`);
      return Project.findAll({
        include: [
          {
            model: Organization,
            as: "organization"
          }
        ]
      })
        .then(projs => {
          logger.info(
            `${callerType} list -> successful, count: ${projs.length}`
          );
          res.status(200).send(projs);
        })
        .catch(error => {
          logger.error(`${callerType} findById -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  saveProjectComment(req, res) {
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} create -> request: ${_obj}`);
    return ProjectComment.create({
      personName: req.body.personName,
      personId: parseInt(req.body.personId),
      createdAt: req.body.createdAt,
      description: req.body.description,
      projId: parseInt(req.body.projId)
    })
      .then(p => {
        logger.info(`${callerType} saveProjectComment -> successful, id: ${p.id}`);
        res.status(201).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} saveProjectComment -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  getProjectRecentComments(req, res){
    const where = [
      {
        projId: req.params.projId,
        disabled: 0
      }
    ]
    logger.info(`${callerType} ProjectComment, findAll where ${JSON.stringify(where)}`);
    return models.ProjectComment.findAll({

      include: [
        {
          model: models.Person,
          as: "person",

        },
      ],
      where,
      limit: 1,
      order: [["createdAt","DESC"]]
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
  }
  ,
  getProjectComments(req, res) {
    
   
    
    const sql = "select * from ProjectComments where projId = " + req.params.projId+" and disabled = 0 order by createdAt desc";

    logger.debug(`${callerType} ProjectComment, findAll where ${sql}`);

    return models.sequelize.query(
      sql, {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(comments => {
        logger.debug(`${callerType} getProjectComments -> successful, count: ${comments.length}`);
        res.status(201).send(comments);
      })
      .catch(error => {
        logger.error(`${callerType} getProjectComments -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  async deactivateProjectComments(req, res) {
    const id = req.params.id;
    logger.debug(`${callerType} Deactivate -> deactivate ProjectComments  for id : ${id}`);
 
      return models.ProjectComment.update({
        disabled: true,
        disabledAt:new Date()
      },
      {
        returning: true,
        where: {
          id: id
        }
      })
        .then(ProjectComment => {
         logger.debug(`${callerType} Deactivate ProjectComment ${ProjectComment}`);
         
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "Comment deactivated successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} deactivate -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    
  },

  orgnizationProjects(req, res) {
   
    const sql = `SELECT d.name as department,ps.label as status,p.*  
                 FROM Projects p
                left join Departments d on d.id=p.deptId
                left join ProjectStatuses ps on ps.id=p.statusId
                where p.orgId=${req.params.id} and p.active=1`;

    return models.sequelize.query(
      sql, {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(result => {
        logger.debug(`${callerType} orgnizationProjects successful, count: ${result.length}`);
        res.status(201).send(result);
      })
      .catch(error => {
        logger.error(`${callerType} orgnizationProjects error: ${error.stack}`);
        res.status(400).send(error);
      });
  }

};
