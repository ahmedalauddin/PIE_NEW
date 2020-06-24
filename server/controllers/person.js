/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/person.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * Modified: 2020-02-29
 * Editor:   Brad Kaufman
 * Changes:  Cleanup and reformat SQL.
 */
"use strict";

// declarations
const models = require("../models");
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const Task = require("../models").Task;
const bCrypt = require("bcrypt");
const util = require("util");
const logger = require("../util/logger")(__filename);
const mailer = require("./mailer");
const callerType = "controller";
// construct a hash
/** eslint no-unused vars */

function randomString(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getHash(value) {
  var hashedValue = bCrypt.hashSync(value, 12);
  logger.debug(`${callerType} getHash -> hash: ${hashedValue}`);
  return hashedValue;
}
async function removePersonFromAllProjectsOfOrg(personid,orgid) {
  // logger.debug(`============================================================In this functon===================================`);
  // var personid = 254;
  // var orgid = 10;
  var arrayOfProjIds = [];
  logger.debug(`${callerType} Find all Project IDS associated with Org ID ${orgid}`);
  var user = await Project.findAll({
    attributes: ['id'],
    where: {
      orgId: orgid
    },
    raw: true
  }).then(users => {

    users.map(user => {
      arrayOfProjIds.push(user.id);
    });

    logger.debug(`${callerType} Destory all entries from ProjectPerson where ProjectIDS(${arrayOfProjIds}) and ORG (${orgid}) ids matched `);
    models.ProjectPerson.destroy(
      {
        where: {
          personId: personid,
          projectId: {in:arrayOfProjIds}
        }
      }
    )

  })   
  
    return true;
  }

module.exports = {
  async create(req, res) {
    let password = randomString(8);
    let hashedValue = getHash(password);
    logger.debug(`${callerType} create -> after hash, hash: ${hashedValue}`);

    var user = await models.Person.findAll(
      {
        limit: 1,
        where: {
          email: req.body.email
        },
        raw: true
      })
      .then(p => {

        if (p.length === 0) {
          return models.Person.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            orgId: req.body.orgId,
            role: req.body.role,
            deptId: req.body.deptId,
            pwdhash: hashedValue,
            email: req.body.email,
            isCustomerAdmin: req.body.isCustomerAdmin
          })
            .then(padd => {
              logger.debug(`${callerType} create -> added person, id: ${padd.id}`);
              // res.status(201).send(p);
              res.status(201).send({
                success: false,
                message: "Person added successfully."
              });

                const to = req.body.email;
                const subject = "PIE Account details.";
                let text = "Hi "+req.body.firstName+",";
                    text+= "<br/><br/>"; 
                    text+= "Your account with PIE has been created successfully. Your account details are as follow:" ;
                    text+= "<br/><br/>"; 
                    text+= "User Name : "+req.body.email; 
                    text+= "<br/>"; 
                    text+= "Password : "+password; 
                    text+= "<br/><br/>"; 
                    text+= "To sign in to your account please visit - <a href='http://pie.value-infinity.com' target='_blank' >http://pie.value-infinity.com</a>"; 
                    text+= "<br/><br/>"; 
                    text+= "Teams"; 
                    text+= "<br/>";
                    text+= "Value-Infinity.";  
                mailer.sendMail(to,subject,text);
            })
            .catch(error => {
              logger.error(`${callerType} create -> error: ${error.stack}`);
              res.status(400).send({
                success: false,
                message: "Something went wrong while created person."
              });
            });
        } else {

          if (p[0].orgId === 1) {
            if (p[0].disabled === 0) {

              return models.OrganizationPerson.create({
                personId: parseInt(p[0].id),
                organizationId: parseInt(req.body.orgId)

              })
                .then(pass => {
                  logger.debug(`${callerType} create -> added person, id: ${pass.id}`);
                  res.status(201).send({
                    success: true,
                    message: "An administrator person is associated with your organisation successfully."
                  });
                })
                .catch(error => {
                  logger.error(`${callerType} create -> error: ${error.stack}`);
                  res.status(400).send({
                    success: false,
                    message: "Something went wrong while assing administrator user to your organization."
                  });
                });

            } else {
              res.status(400).send({
                success: false,
                message: "You can't add a Disabled person."
              });
            }
          } else {
            res.status(400).send({
              success: false,
              message: "Person already exist."
            });
          }
        }

      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send({
          success: false,
          message: "Something went wrong when search for existing user."
        });
      });


  },

  update(req, res) {
    const id = req.params.id;
    logger.debug("Calling Person update");
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Person.update(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        deptId: req.body.deptId,
        pwdhash: req.body.pwdhash,
        orgId: req.body.orgId
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(([d, p]) => {
        logger.debug(`${callerType} update -> successful`);
        if (p === 1) {
          res.status(200).send({
            success: true,
            message: "Person Updated successfully"
          });
        } else {
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

  disable(req, res) {
    const id = req.params.id;
    logger.debug("Calling Person disable");
    logger.debug(
      `${callerType} disable>>> -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Person.update(
      {
        disabled: true,
        disabledAt: new Date()
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update -> successful`);
        res.status(200).send({
          success: true,
          message: "Person deleted successfully"
        });
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send({
          success: true,
          message: "Error occured while deleting"
        });
      });
  },

  disable_from_org(req, res) {
    const personid = req.params.personid;
    const orgid = req.params.orgid;
    logger.debug("Calling Person disable from Organization");
    logger.debug(
      `${callerType} disable Person disable from Organization>>> -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.OrganizationPerson.destroy(
      {
        where: {
          personId: personid,
          organizationId: orgid
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} Destroy -> successful`);
        
        // logger.debug(`============================================================Start Using Function===================================`);
        var testresult = removePersonFromAllProjectsOfOrg(personid,orgid);
        // logger.debug(`============================================================Start Using Function===================================`);
        res.status(200).send({
          success: true,
          message: "Person deleted successfully"
        });
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send({
          success: true,
          message: "Error occured while deleting"
        });
      });
  },

  // disable_from_proj(req, res) {
  //   const personid = req.params.personid;
  //   const projectid = req.params.projectid;
  //   logger.debug("Calling Person disable");
  //   logger.debug(
  //     `${callerType} disable>>> -> body: ${util.inspect(req.body, {
  //       showHidden: false,
  //       depth: null
  //     })}`
  //   );
  //   return models.ProjectPerson.update(
  //     {
  //       inProject: 0,
  //       owner: 0
  //     },
  //     {
  //       returning: true,
  //       where: {
  //         personId: personid,
  //         projectId: projectid
  //       }
  //     }
  //   )
  //     .then(p => {
  //       logger.debug(`${callerType} update -> successful`);
  //       res.status(200).send({
  //         success: true,
  //         message: "Person deleted successfully"
  //       });
  //     })
  //     .catch(error => {
  //       logger.error(`${callerType} update -> error: ${error.stack}`);
  //       res.status(400).send({
  //         success: true,
  //         message: "Error occured while deleting"
  //       });
  //     });
  // },

  // Find a person by Id
  findById(req, res) {
    return models.Person.findById(req.params.id, {
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: Project,
          as: "projects"
        },
        {
          model: Task,
          as: "tasks"
        }
      ]
    })
      .then(p => {
        logger.debug(`${callerType} findById -> username: ${p.username}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a list of persons by project, including those with the organization bu not assigned
  // to the project.
  findByProject(req, res) {
    // let sql = "select O.id, O.name, Pr.id,  P.id as projectId, P.title, PP.inProject, PP.owner, Pr.firstName, Pr.lastName, Pr.email, " +
    //   "concat('assigned-', Pr.id) as checkname " +
    //   "from Persons Pr inner join Organizations O " +
    //   "on O.id = Pr.orgId and Pr.disabled = false " +
    //   "inner join Projects P on O.id = P.orgId and P.id = " + req.params.projectId + " " +
    //   "left outer join ProjectPersons PP " +
    //   "on PP.personId = Pr.id and PP.projectId = P.id " +
    //   "order by Pr.lastName, Pr.firstName;";
    let sql = "select O.id, O.name, Pr.id, Pr.orgId, PP.projectId as projectId, P.title, " +
      "(case when (PP.inProject = 1 and PP.projectId = " + req.params.projectId + ") THEN 1 ELSE 0 END) as inProject," +
      "(case when (PP.owner = 1 and PP.projectId = " + req.params.projectId + ") THEN 1 ELSE 0 END) as owner," +
      "Pr.firstName, Pr.lastName, Pr.email, concat('assigned-', Pr.id) as checkname  from Persons as Pr " +
      "left join Organizations as O " +
      "on Pr.orgId = O.id " +
      "left join Projects as P " +
      "on P.orgId = O.id " +
      "left join ProjectPersons as PP " +
      "on PP.personId = Pr.id " +
      "where ((PP.projectId=" + req.params.projectId + " OR P.id=" + req.params.projectId + " OR (Pr.disabled = false and Pr.id in " +
      "  (select personId from OrganizationPersons OP where OP.organizationId = " + req.params.orgId + ")) ) " +
      "   AND ((Pr.orgId = " + req.params.orgId + " and Pr.disabled=false) OR (PP.projectId = " + req.params.projectId + " and Pr.disabled=false) " +
      "   OR (Pr.disabled = false and Pr.id in (select personId from OrganizationPersons OP where OP.organizationId = " + req.params.orgId + ")))) \ " +
      "group by Pr.email order by Pr.lastName, Pr.firstName";


    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} findByProject -> sql: ${req.params.projectId}`);
        logger.debug(`${callerType} findByProject -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a list of persons assigned to a  project.  We can use this to populate our dropdown list of assigned
  // people for tasks on the Gantt chart component.
  getPersonsOwnedToProject(req, res) {
    let sql = "select per.id, pp.owner, per.fullName from ProjectPersons pp, Persons per " +
      "where pp.personId = per.id and pp.owner = 1 and projectId = " + req.params.projectId + " " +
      "order by per.fullName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} getPersonsOwnedToProject -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} getPersonsOwnedToProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  getPersonsAssignedAndOwnedToProject(req, res) {
    let sql = "select per.id, pp.inProject, pp.owner, per.fullName from ProjectPersons pp, Persons per " +
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
        logger.debug(`${callerType} getPersonsAssignedToProject -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} getPersonsAssignedToProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  getPersonsAssignedToProject(req, res) {
    let sql = "select per.id, pp.inProject, per.fullName from ProjectPersons pp, Persons per " +
      "where per.disabled = 0 and pp.personId = per.id and pp.inProject = 1 and projectId = " + req.params.projectId + " " +
      "order by per.fullName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} getPersonsAssignedToProject -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} getPersonsAssignedToProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  findByOrganization(req, res) {
    let orgId = req.params.orgId;
    // let sql = "select P.id, P.fullName, P.email, P.role, P.orgId, D.name as department, \
    //   (select group_concat(title) from Projects Pr, ProjectPersons PP \
    //   where Pr.id = PP.projectId and PP.personId = P.id order by Pr.title) as projects \
    //   from Persons P left outer join Departments D on P.deptId = D.id \
    //   where P.orgId = " + orgId + " and P.disabled = false  \
    //   order by P.fullName";
    var onlyForOrg = req.params.onlyForOrg;
    var sqlFunction = "getProjectListForPerson(P.id)";
    if(onlyForOrg === 'true'){
      sqlFunction = "getProjectListForPersonWithOrgId(P.id," + orgId + ")";
    }
    
    let sql = "select P.id, P.fullName, P.email, P.role, P.orgId, \
              D.name as department, "+sqlFunction+" as projects, P.isCustomerAdmin \
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

  // Find a person by Id
  findByEmail(req, res) {
    return models.Person.findOne(req.params.email, {
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: Project,
          as: "project"
        }
      ]
    })
      .then(p => {
        logger.debug(`${callerType} findByEmail -> username: ${p.username}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByEmail -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all persons
  list(req, res) {
    if (req.query.email) {
      logger.debug(`${callerType} list -> email: ${req.query.email}`);
      return models.Person.findOne({
        where: {
          email: req.params.email
        }
      })
        .then(p => {
          logger.debug(`${callerType} list -> id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} list -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      logger.debug(`${callerType} list -> start`);
      return models.Person.findAll({
        include: [
          {
            model: models.Organization,
            as: "organization"
          }
        ],
        order: [["username", "ASC"]]
      })
        .then(people => {
          logger.debug(`${callerType} list -> count: ${people.length}`);
          res.status(200).send(people);
        })
        .catch(error => {
          logger.error(`${callerType} list -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  }
};
