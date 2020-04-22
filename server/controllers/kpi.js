/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/kpi.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-12-06
 * Changes:  Updated insert statement on saveAsNew to use `id` instead of `KpiId`.
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
const util = require("util");

module.exports = {
  // Creates only a KPI.
  async create(req, res) {
    const projectId = req.body.projectId;
    logger.debug(`${callerType} create -> projectId: ${projectId}`);
    // logger.debug(`${callerType} create -> JSON: req.body: ${JSON.stringify(req.body)}`);
    let nodeId = "";
    if (req.body.mindmapNodeId) {
      nodeId = req.body.mindmapNodeId;
    } else {
      nodeId = "";
    }
    let ifExist = 0
    if (req.body.mindmapNodeId || req.body.projectId) {
      ifExist = await models.Kpi.count({
        where: {
          [models.Sequelize.Op.and]:
            [
              { title: req.body.title },
              {
                [models.Sequelize.Op.or]: [
                  {
                    mindmapNodeId: req.body.mindmapNodeId
                  },
                  {
                    projectId: req.body.projectId
                  },
                  {
                    orgId: req.body.orgId
                  }
                ]
              }
            ]
        },
        raw: true
      })
      logger.error(`${callerType} create -> error: KPI ${req.body.title} Entry already exist.>>>>>>>>>>>>>>>>>> ${ifExist}`);
    }
    if (ifExist > 0) {
      logger.error(`${callerType} create -> error: KPI ${req.body.title} Entry already exist.`);
      res.status(400).send({
        success: false,
        message: "KPI" + " " + req.body.title + " " + "Entry already exist."
      });
      return;
    }
    else {
      return models.Kpi.create({
        title: req.body.title,
        description: req.body.description,
        formulaDescription: req.body.formula,
        type: req.body.type,
        active: 1,
        projectId: req.body.projectId,
        mindmapNodeId: nodeId,
        level: req.body.level,
        status: req.body.taskstatus,
        orgId: req.body.orgId,
        deptId: req.body.deptId
      })
        .then(kpi => {
          
          if(req.body.projectId){
            models.ProjectKpi.create({
              projId: req.body.projectId,
              kpiId: kpi.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
          
          
          // SQL to insert all tags.  Need to loop through the array of tags to build the strings of values
          // we'll insert.
          let tags = req.body.tags;
          let kpiId = kpi.id;
          logger.debug(`${callerType} create Kpi -> tags: ${JSON.stringify(req.body.tags)}`);
          let tag = "";
          if (tags != undefined && tags.length > 0) {
            let valueStr = "";
            for (let i = 0; i < tags.length; i++) {
              tag = tags[i].text;
              if (tag !== "") {
                valueStr += "(" + kpiId.toString() + ", '" + tag + "')";
                if (i < (tags.length - 1)) {
                  valueStr += ",";
                }
              }
            }
            if (valueStr !== "") {
              let sql =
                "INSERT into `KpiTags` (kpiId, tag) " +
                "values " + valueStr + " " +
                "ON DUPLICATE KEY UPDATE kpiId=" + kpiId;
              logger.debug(`${callerType} insert KpiTags -> sql: ${sql}`);
              return models.sequelize.query(sql);
            }
          }
        })
        .then(() => {
          res.status(201).send({
            success: true,
            message: "KPI " + req.body.title + " created successfully"
          });
        })
        .catch(error => {
          logger.error(`${callerType} create -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  /*
  createWithProject(req, res) {
    const projectId = req.body.projectId;
    logger.debug(`kpi createWithProject -> projectId: ${projectId}`);
    logger.debug(`kpi createWithProject -> JSON: req.body: ${JSON.stringify(req.body)}`);
    let nodeId = "";
    if (req.body.mindmapNodeId) {
      nodeId = req.body.mindmapNodeId;
    } else {
      nodeId = "";
    }
    let kpiTitle = req.body.title;
    let kpiDescription = req.body.description;
    let formulaDescription = req.body.formula;
    let project = req.body.project;
    let projectDescription = req.body.projectDescription;
    let mindmapNodeId = req.body.mindmapNodeId;
    let orgId = req.body.orgId;
    // TODO - test this.
    // SQL to call stored procedure with its input parameters.
    let sql = "CALL insert_kpi_with_project (" + orgId + ", '" + kpiTitle + "', '" + kpiDescription + "', '" +
      formulaDescription + "', '" + mindmapNodeId + "', '" + project + "', '" + projectDescription + "')";

    return models.sequelize
      .query(sql)
      .then(([results, metadata]) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log("Kpi createWithProject -> metadata: " + metadata);
        console.log("Kpi createWithProject -> create: successful");
      })
      .catch(error => {
        logger.error(`${callerType} Kpi createWithProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },
  */

  // Update a Kpi
  update(req, res) {
    const id = req.params.id;
    return models.Kpi.update(
      {
        title: req.body.title,
        description: req.body.description,
        formulaDescription: req.body.formula,
        type: req.body.type,
        level: req.body.level,
        status: req.body.taskstatus,
        orgId: req.body.orgId,
        deptId: req.body.deptId
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(([d,p]) => {
        logger.debug(`${callerType} update -> successful`);
        // logger.debug(`==========================================================`);
        // // console.log(p.split(','));
        // logger.debug(`${p} ============================================`);
        // res.status(200).send(p);
        if(p === 1){
          res.status(200).send({
            success: true,
            message: "KPI Updated successfully"
          });
        }else{
          res.status(200).send({
            success: true,
            message: "Something went wrong"
          });
        }
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  savePriorityOrder(req, res) {
    /* Use a bulk update statement similar to this:
        UPDATE students s
        JOIN (
            SELECT 1 as id, 5 as new_score1, 8 as new_score2
            UNION ALL
            SELECT 2, 10, 8
            UNION ALL
            SELECT 3, 8, 3
            UNION ALL
            SELECT 4, 10, 7
        ) vals ON s.id = vals.id
        SET score1 = new_score1, score2 = new_score2;
     */
    console.log("kpi -> savePriorityOrder");
    const orgid = req.params.orgid;
    const kpis = req.body.kpis;
    let sql = "Update Kpis k join (";
    let first = true;

    for (var i = 0; i < kpis.length; i++) {
      if (first === true) {
        sql += "select " + kpis[i].id + " as id, " + (i+1) + " as newPriority ";
        first = false;
      } else {
        sql += "union all select " + kpis[i].id + ", " + (i+1) + " ";
      }
      console.log("i = " + i + ", kpi id = " + kpis[i].id + ", kpi title = " + kpis[i].title);
    }
    sql += ") vals on k.id = vals.id set orgPriority = newPriority " +
      "where orgId = " + orgid;
    console.log("Update SQL: " + sql);
    return models.sequelize
      .query(sql)
      .then(([results, metadata]) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log("KPI savePriorityOrder -> update: successful");
      })
      .catch(error => {
        logger.error(`${callerType} KPI savePriorityOrder -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Deactivate a Kpi
  deactivate(req, res) {
    const id = req.params.id;
    return models.Kpi.update(
      {
        active: 0
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(_k => {
        var removefromMainkpi = models.Project.update(
          {
            mainKpiId: null
          },
          {
            returning: true,
            where: {
              mainKpiId: id
            }
          }
        )
        logger.debug(`${callerType} KPI deactivate, id ${id} -> successful`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} KPI deactivate, id ${id} -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },
/*
  removeFromProject(req, res) {
    const id = req.params.id;
    return models.Kpi.update(
      {
        projectId: null
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(_k => {
        var removefromMainkpi = models.Project.update(
          {
            mainKpiId: null
          },
          {
            returning: true,
            where: {
              mainKpiId: id,
              id: req.body.data[0].projectId
            }
          }
        )
        logger.debug(`${callerType} KPI deactivate, id ${id} -> successful`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} KPI deactivate, id ${id} -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },*/

  // For KPI search, assign KPIs to the project.
  // TODO: change this so it's a save as new instead of just using the KpiProjects table.
  /*
    This will need to insert records into the KPI table, just copying the KPIs from other projects.
    Not too many changes: the main diff is we'll insert into the Kpis table instead of KpiProjects.
   */
  /*
  saveAsNew(req, res) {
    logger.debug(`${callerType} KPI assignToProject -> reg: ${JSON.stringify(req.body)}`);
   

    var jsonData = req.body.data;
    let sqlArrays = "";
    let sql = "";
    let doInsert = false;
    let projectId = req.body.projectId;
    let orgnId = req.params.orgnId;

    if (jsonData) {
      // Convert the JSON into some arrays for a SQL statement.
      // Break the input json down into an array and we can update with one SQL statement.
      // Use JSON.parse.
      for (var i = 0; i < jsonData.length; i++) {
        // Only add items where selected is true
        if (jsonData[i].selected === true) {
          if (doInsert === true) {
            sqlArrays += ", ";
          }
          sqlArrays += "('" + orgnId + "', '" + projectId + "', '" + jsonData[i].title + "', '" + jsonData[i].description + "', '" + jsonData[i].level + "', '" + jsonData[i].type + "', " + jsonData[i].orgPriority + ", '" + jsonData[i].active + "', '" + jsonData[i].status + "', '" + jsonData[i].formulaDescription + "', " + jsonData[i].departmentId + ") ";
          doInsert = true;
        }
      }
      // Changed insert statement, 12/5/19.
      if (doInsert === true) {
        sql = "INSERT into `Kpis` " +
          "(orgId, projectId, title, description, level, type, orgPriority, active, status, formulaDescription, departmentId) " +
          "VALUES " + sqlArrays +
          "ON DUPLICATE KEY " +
          "UPDATE projectId = projectId, id = id;"

        let _obj = util.inspect(req, { showHidden: false, depth: null });
        logger.debug(`${callerType} KPI assignToProject -> request: ${_obj}`);
        logger.debug(`${callerType} KPI assignToProject -> sql: ${sql}`);

        return models.sequelize
          .query(sql)
          .then(([results, metadata]) => {
            // Results will be an empty array and metadata will contain the number of affected rows.
            console.log("KPI assignToProject -> update: successful");
            if(results > 0){
              res.status(201).send({
                success: true,
                message: "KPI Updated successfully"
              });
            }else{
              res.status(201).send({
                success: true,
                message: "Something went wrong."
              });
            }
          })
          .catch(error => {
            logger.error(`${callerType} KPI saveAsNew -> error: ${error.stack}`);
            res.status(400).send(error);
          });
      } else {
        logger.debug(`${callerType} KPI saveAsNew -> no JSON data in request`);
        return "error - no JSON";
      }
    }
  },*/

  // For KPI search, assign KPIs to the project.
  /*
  assignToProject(req, res) {
    logger.debug(`${callerType} KPI assignToProject -> reg: ${JSON.stringify(req.body)}`);
    /*
    Need something like this:
      INSERT into `KpiProjects`
      (kpiId, projectId)
      VALUES
        ('69', '118'), ('67', '118'), ('66', '118')
      ON DUPLICATE KEY
      UPDATE projectId=projectId, kpiId=kpiId;


    var jsonData = req.body.data;
    let sqlArrays = "";
    let sql = "";
    let doInsert = false;
    let projectId = req.body.projectId;

    if (jsonData) {
      // Convert the JSON into some arrays for a SQL statement.
      // Break the input json down into an array and we can update with one SQL statement.
      // Use JSON.parse.
      for (var i = 0; i < jsonData.length; i++) {
        // Only add items where selected is true
        if (jsonData[i].selected === true) {
          if (doInsert === true) {
            sqlArrays += ", ";
          }
          sqlArrays += "('" + jsonData[i].id + "', '" + projectId + "') ";
          doInsert = true;
        }
      }
      if (doInsert === true) {
        sql = "INSERT into `KpiProjects` " +
          "(kpiId, projectId) " +
          "VALUES " + sqlArrays +
          "ON DUPLICATE KEY " +
          "UPDATE projectId=projectId, kpiId=kpiId;"

        let _obj = util.inspect(req, { showHidden: false, depth: null });
        logger.debug(`${callerType} KPI assignToProject -> request: ${_obj}`);
        logger.debug(`${callerType} KPI assignToProject -> sql: ${sql}`);

        return models.sequelize
          .query(sql)
          .then(([results, metadata]) => {
            // Results will be an empty array and metadata will contain the number of affected rows.
            console.log("KPI assignToProject -> update: successful");
          })
          .catch(error => {
            logger.error(`${callerType} KPI assignToProject -> error: ${error.stack}`);
            res.status(400).send(error);
          });
      } else {
        logger.debug(`${callerType} KPI assignToProject -> no JSON data in request`);
        return "error - no JSON";
      }
    }
  },
   */

  // Find a Kpi by Id
  findById(req, res) {
    logger.error(`${callerType} KPI, findById `);
    return models.Kpi.findByPk(req.params.id, {
      include: [
        {
          model: models.Organization,
          as: "organization"
        },
        {
          model: models.Department,
          as: "department"
        },
        {
          model: models.KpiTag,
          as: "tags"
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

  // Search KPIs
  search(req, res) {
    // Note that we created a view to make it easier to search.
    logger.debug(`${callerType} KPI, search `);
    logger.debug(`${callerType} KPI, search, headers: ` + JSON.stringify(req.headers));
    let searchText = req.headers.searchstring;
    let projectId = req.headers.projectid;
    let orgId = req.headers.orgid;
    let searchOrgOnly = req.headers.searchorgonly;
    logger.debug(`${callerType} search Kpi -> searchOrgOnly: ${searchOrgOnly}`);
    /*
    let sql = "select * from vw_GetKpis " +
      "where (tags like '%" + searchText + "%' or title like '%" + searchText + "%' " +
      "or description like '%" + searchText + "%') and active = 1"; 
      "and (projectId <> " + projectId + " or projectId is null) ";  */
     
      let orgClause="";
      if (searchOrgOnly == "true") {
        orgClause= " and (o.id = "+orgId+" or o.id = 1 or o.id is null)";
      }
      let projClause="";
      if (projectId > 0) {
        projClause=" and k.id not in (select kpiId from ProjectKpis where projId=" + projectId + ") ";
      }
      let sql = "select * from ( "+
        " SELECT pk.id as pkid,p.title as projectTitle, o.name as orgName,"+
        " GROUP_CONCAT(p.title separator '\n') as projectTitles ," +
        " (select group_concat(kt.tag separator ',') from KpiTags kt where (kt.kpiId = k.id)) AS tags,"+
        "  k.*"+
        " FROM Kpis k"+
        " left join ProjectKpis pk on pk.kpiId=k.id"+
        " left join Projects p on pk.projId=p.id"+
        " left join Organizations o on k.orgId = o.id"+
        " where k.active = 1 "+projClause+" and (k.projectId is null or k.projectId = 0) "+orgClause+
        " GROUP BY k.id) as viewT";

        sql += " where  (tags like '%" + searchText + "%' or title like '%" + searchText + "%' " +
               "or description like '%" + searchText + "%')"; 
       
       
   /*if (searchOrgOnly == "true") {
      sql += " and (orgId = " + orgId + " or orgId = 1 or orgId is null)";
    }*/
    logger.debug(`${callerType} create KpiProject -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(
          `${callerType} KPI search -> successful, title: ${_k.title}`
        );
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} KPI search -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all KPIs for a single project
  listByProject(req, res) {
    //let sql = "select * from vw_Kpis  where projectId = " + req.params.projid + " and active = 1";

    let sql = "SELECT pk.id as pkid,p.id as projectId,p.title as projectTitle, o.name as orgName,"+
              "(select group_concat(kt.tag separator ',') from KpiTags kt where (kt.kpiId = k.id)) AS tags,"+
              " k.* "+
              "FROM ProjectKpis pk,Projects p,Kpis k,Organizations o "+
              "where pk.projId=p.id and  pk.kpiId=k.id and k.orgId = o.id and p.id="+req.params.projid;

    logger.debug(`${callerType} create Kpi -> sql: ${sql}`);

    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} listByProject -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Get KPI by matching its mindmap node ID.
  getByMindmapNode(req, res) {
   

      let sql = " SELECT pk.id as pkid,p.title as projectTitle, o.name as orgName,"+
                " (select group_concat(kt.tag separator ',') from KpiTags kt where (kt.kpiId = k.id)) AS tags,"+
                "  k.*"+
                " FROM Kpis k"+
                " left join ProjectKpis pk on pk.kpiId=k.id"+
                " left join Projects p on pk.projId=p.id"+
                " left join Organizations o on k.orgId = o.id"+
                " where k.active = 1 and k.mindmapNodeId = '" + req.params.mindmapNodeId + "' limit 1;";
      
    
    logger.debug(`${callerType} getByMindmapNode -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} getByMindmapNode -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} getByMindmapNode -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all KPIs for a single organization
  listByOrganization(req, res) {
    // May need to change the view.
    //let sql = "select * from vw_GetKpis  where orgId = " + req.params.orgid + " and active = 1";

    let sql = " SELECT o.name as orgName,"+
              " (select group_concat(kt.tag separator ',') from KpiTags kt where (kt.kpiId = k.id)) AS tags,"+
              " (select group_concat(p.title separator '\n') from Projects p inner join ProjectKpis pk on pk.projId=p.id where (pk.kpiId=k.id)) AS projectTitles,"+
              "  k.*"+
              " FROM Kpis k"+
              " left join Organizations o on k.orgId = o.id"+
              " where k.active = 1 and (k.projectId is null or k.projectId=0) and k.orgId="+req.params.orgid;

    logger.debug(`${callerType} create Kpi -> sql: ${sql}`);
   
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} listByOrganization -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} listByOrganization -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all KPIs for a single organization by priority for the mind map screen.
  listByOrganizationAndPriority(req, res) {
    const orgId = req.params.orgid;
    const sql = "select K.id, K.title, K.orgPriority, P.id as projId, P.title as projTitle, P.description as projDescription " +
      "from Kpis K left outer join Projects P on K.id = P.mainKpiId and K.orgId = P.orgId " +
      "where K.orgId = '" + orgId + "' and K.active = 1 and P.mainKpiId is not null " +
      "order by orgPriority asc";
     /* let sql = " SELECT o.name as orgName,"+
      " (select group_concat(kt.tag separator ',') from KpiTags kt where (kt.kpiId = k.id)) AS tags,"+
      " (select group_concat(p.title separator '\n') from Projects p inner join ProjectKpis pk on pk.projId=p.id where (pk.kpiId=k.id)) AS projectTitles,"+
      "  k.*"+
      " FROM Kpis k"+
      " left join Organizations o on k.orgId = o.id"+
      " where k.active = 1 and (k.projectId is null or k.projectId=0) and k.orgId="+orgId +"  order by k.orgPriority asc";;*/
   

    logger.debug(`${callerType} create Kpi -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(`${callerType} listByOrganizationAndPriority -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} listByOrganizationAndPriority -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all KPIs
  list(req, res) {
    return models.Kpi.findAll({
      include: [
        {
          model: models.Organization,
          as: "organization"
        }
      ],
      where: {
        active: 1
      }
    })
      .then(_k => {
        logger.debug(`${callerType} list -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

   removeFromProject(req, res) {

    logger.debug(`${callerType} removeFromProject-> : ${req.params.id}`);

    let sql = "SELECT k.projectId,k.id,pk.projId as relationProjectId FROM ProjectKpis pk,Kpis k "+
              " where pk.kpiId = k.id and pk.id="+req.params.id;

    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(async _k => {
       
        if(_k.length && _k.length>0){
          
          if(_k[0].projectId>0){
            logger.debug(`${callerType} removeFromProject own kpi -> kpiid: ${_k[0].id}`);
            await models.Kpi.update( { active: 0 }, { where: { id: _k[0].id } } )
          }
         
          logger.debug(`${callerType} removeFromProject main kpi -> kpiid: ${_k[0].relationProjectId}`);
          await models.Project.update(  { mainKpiId: null }, { where: { id: _k[0].relationProjectId ,mainKpiId:_k[0].id }} )
          
        }

        models.ProjectKpi.destroy({
          where: {
            id: req.params.id
          }
        }).then(_k => {
          logger.debug(`${callerType} removeFromProject successful: ${_k}`);
          res.status(201).send(req.params);
        })
        .catch(error => {
          logger.error(`${callerType} removeFromProject error: ${error.stack}`);
          res.status(400).send(error);
        });


      })
      .catch(error => {
        logger.error(`${callerType} listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });



  },

  kpisAssign(req, res) {

    var jsonData = req.body.data;
    let sqlArrays = "";
    let sql = "";
    let doInsert = false;
    let projectId = req.body.projectId;
    let orgnId = req.params.orgnId;
    const records=[];

    if (jsonData) {
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].selected === true) {
          records.push({
            projId:  projectId,
            kpiId: jsonData[i].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      }
    }

    if(records.length==0){
      return res.status(201).send({
        success: true,
        message: "KPI not selected"
      });
    }

    models.ProjectKpi.bulkCreate(records).then(([results, metadata]) => {
      console.log("KPI assignToProject -> update: successful");
      if(results > 0){
        res.status(201).send({
          success: true,
          message: "KPI Assigned successfully"
        });
      }else{
        res.status(201).send({
          success: true,
          message: "Something went wrong."
        });
      }
    })
    .catch(error => {
      logger.error(`${callerType} KPI kpisAssign -> error: ${error.stack}`);
      res.status(400).send(error);
    });
  },

  exportKpiToOrg(req, res) {
    const id = req.params.id;
    return models.Kpi.update(
      {
        projectId: 0
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(_k => {
       
        logger.debug(`${callerType} KPI exportKpiToOrg, id ${id} -> successful`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} KPI exportKpiToOrg, id ${id} -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }

};
