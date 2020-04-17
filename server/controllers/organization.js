/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-26 17:45:06
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const models = require("../models");
const logger = require("../util/logger")(__filename);
const mvcType = "controller";
const util = require("util");
const callerType = "controller";

// create an organization
module.exports = {
  create(req, res) {
    logger.debug(`${mvcType} create --> name = ${req.params.name}`);
    return models.Organization.create({
      name: req.body.name,
      owningOrg: req.body.owningOrg
    })
      .then(org => {
        logger.info(`${mvcType} create-> new org, id = ${org.id}`);
        res.status(201).send(org);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },


  // deactivate a org by id
  deactivate(req, res) {
    
    let _obj = util.inspect(req.body, { showHidden: false, depth: null });
    logger.debug(`${callerType} deactivate -> request: ${_obj}`);
    return models.Organization.update({
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
            message: "Organization deactivated"
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


  dashboardList(req, res) {
    logger.debug(`organizations dashboardList`);
    let sql = " Select O.*,  \
      (select group_concat(title order by title SEPARATOR ', ') from Projects P where P.orgId = O.id and P.active = 1) as projects,  \
      (select group_concat(CONCAT(firstName,' ' ,lastName)  order by lastName SEPARATOR '; ' ) from Persons Pe where (Pe.orgId = O.id or Pe.id in (select personId from OrganizationPersons OP where OP.organizationId = O.id)) and Pe.disabled = 0) as people,\
      (select group_concat(name order by name SEPARATOR ', ' ) from Departments D where D.orgId = O.id and D.disabled = 0 \
       ) as departments, \
      (select group_concat(title order by title SEPARATOR ', ' ) from Kpis K where (K.projectId is null or K.projectId=0) and K.active=1 and K.orgId = O.id \
       ) as kpis \
       from Organizations O \
       where O.active = 1 \
      order by name";
 
    return models.sequelize.query(
      sql,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    )
      .then(orgs => {
        logger.info(`${mvcType} selectList -> ${orgs.length} orgs`);
        res.status(200).send(orgs);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // fulltext search by organization against the SearchData table.
  async fulltextSearch(req, res) {
    let searchTerm = req.headers.term;
    let orgId = req.headers.orgid;
    logger.debug(`Organization fulltextSearch, params: ` + JSON.stringify(req.headers));
    logger.debug(`Organization fulltextSearch -> orgId: ${orgId}`);

    let sql = "SELECT S.id, S.orgId, S.foreignId, O.name as OrgName, S.title, S.description, S.project, S.source, " +
      "MATCH(title, description, summary) AGAINST ('" + searchTerm + "' IN NATURAL LANGUAGE MODE) AS score " +
      "FROM SearchData S, Organizations O " +
      "where MATCH(title, description, summary) AGAINST ('" + searchTerm + "' IN NATURAL LANGUAGE MODE) > 0.0 " +
      "and O.id = S.orgId " +
      "and S.active = 1 " +
      "and orgId = " + orgId + " " +
      "order by score desc";

    return await models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(s => {
        res.status(200).send(s);
      })
      .catch(error => {
        logger.error(`Organization fulltextSearch -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  checkKpiPrioritizationLock(req, res) {
    let orgId = req.params.id;
    let sql = "SELECT * from Organizations O where id = " + orgId + " ";
    logger.debug(`Organization checkKpiPrioritizationLock -> sql: ${sql}`);
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(s => {
        res.status(200).send(s);
      })
      .catch(error => {
        logger.error(`Organization checkKpiPrioritizationLock -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  saveKpiPrioritizationLock(req, res) {
    const id = req.params.id;
    logger.debug("Calling Organizations update");
    logger.debug(`Organizations saveKpiPrioritizationLock --> name = ${req.params.name}`);
    return models.Organization.update(
      {
        lockPrioritization: !req.body.orgKpiPriorityLock,
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`Organizations saveKpiPrioritizationLock -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`Organizations saveKpiPrioritizationLock -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },


  updateOrganizationName(req, res) {
    const id = req.params.id;
    logger.debug("Calling Organizations Name update");
    // logger.debug(`Organizations saveKpiPrioritizationLock --> name = ${req.params.name}`);
    return models.Organization.update(
      {
        name: req.body.name,
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`Organizations Name Update -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`Organizations Name Update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // select all organizations
  list(req, res) {
    if (req.query.format === "select") {
      logger.debug(`${mvcType} selectList -> called`);
      return models.Organization.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        where: {active : 1}
      })
        .then(orgs => {
          logger.info(`${mvcType} selectList -> ${orgs.length} orgs`);
          res.status(200).send(orgs);
        })
        .catch(error => {
          logger.error(error.stack);
          res.status(400).send(error);
        });
    } else if (req.query.name) {
      logger.debug(`${mvcType} findByName -> name = ${req.query.name}`);
      return models.Organization.findOne({
        where: {
          name: req.query.name,
          active : 1
        }
      })
        .then(org => {
          logger.info(`${mvcType} findByName -> id = ${org.id}`);
          res.status(200).send(org);
        })
        .catch(error => {
          logger.error(error.stack);
          res.status(400).send(error);
        });
    } else {
      logger.debug(`${mvcType} list -> called`);
      return models.Organization.findAll({
        include: [
          {
            model: models.Person,
            as: "persons"
          },
          {
            model: models.Project,
            as: "projects"
          },
          {
            model: models.Department,
            as: "departments"
          },
          {
            model: models.Kpi,
            as: "kpis"
          }
        ],
        where: {active : 1},
        order: [["name", "ASC"]]
      })
        .then(orgs => {
          logger.info(`${mvcType} list -> ${orgs.length} orgs`);
          res.status(200).send(orgs);
        })
        .catch(error => {
          logger.error(error.stack);
          res.status(400).send(error);
        });
    }
  },

  // formal list for selects
  selectList(req, res) {
    logger.debug(`${mvcType} selectList -> called`);
    return models.Organization.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]]
    })
      .then(orgs => {
        logger.info(`${mvcType} selectList -> ${orgs.length} orgs`);
        res.status(200).send(orgs);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // Find an org by Id
  findById(req, res) {
    logger.debug(`${mvcType} findById -> id = ${req.params.id}`);
    return models.Organization.findById(req.params.id, {
      // Removed these joins because this query leads to a query that made SQL down and there was an response of Fetching error. As of 17-03-2020 this /API-Function is used by only two screens organization(Single details page for ORG) and clientorg(Client filter). And after remove these includes(Joins) there is not issue on both pages.
      // include: [
      //   {
      //     model: models.Person,
      //     as: "persons"
      //   },
      //   {
      //     model: models.Project,
      //     as: "projects"
      //   },
      //   {
      //     model: models.Department,
      //     as: "departments"
      //   },
      //   {
      //     model: models.Kpi,
      //     as: "kpis"
      //   }
      // ]
    })
      .then(org => {
        logger.info(`${mvcType} findById -> org = ${org.name}`);
        res.status(200).send(org);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // find an org by Name
  findByName(req, res) {
    logger.debug(`${mvcType} findByName -> name = ${req.params.name}`);
    return models.Organization.findOne({
      where: {
        name: req.params.name
      }
    })
      .then(org => {
        logger.info(`${mvcType} findByName -> id = ${org.id}`);
        res.status(200).send(org);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  }
};
