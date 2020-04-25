/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/auth.js
 * Created:  2019-03-01 04:37:25
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-17
 * Editor:   Brad Kaufman
 */
const Person = require("../models").Person;
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../util/logger")(__filename);
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const Task = require("../models").Task;
const mvcType = "controller";
const cookieName = "token";
const models = require("../models");
const mailer = require("./mailer");

function writeJwt(email, organization) {
  let token = jwt.sign(
    { email: email, organization: organization},
    config.get("security.jwtSecret"),
    {
      expiresIn: "24h" // expires in 24 hours
    }
  );
  return token;
};

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
  logger.debug(`${mvcType} getHash -> hash: ${hashedValue}`);
  return hashedValue;
}

module.exports = {
  authenticate(req, res) {
    logger.debug(`${mvcType} authenticate -> start`);
    // Find a person by email.
    logger.debug(`${mvcType} authenticate -> email: ${req.body.email}`);
    return Person.findOne({
      where: {
        email: req.body.email,
        disabled: 0
      },
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
        logger.debug(
          `${mvcType} authenticate -> 
            Success, found person, pwdhash: ${p.pwdhash}, personId: ${p.id}`
        );

        bCrypt.compare(req.body.password, p.pwdhash, function(err, result) {
          if (result === true) {
            // Logged in successfully.
            logger.debug(`${mvcType} authenticate -> successful`);
            let token = writeJwt(p.email, p.organization);

            // return the JWT token for the future API calls
            logger.debug(
              `${mvcType} authenticate -> returning token ${token} as cookie`
            );

            let sql = "update Persons set lastLogin = CURRENT_TIMESTAMP where id = " + p.id;
            logger.debug(`auth.js, setLastLogin -> sql: ${sql}`);
            models.sequelize.query(sql);

            const orgId = req.params.orgId;

            const aclsQuery = "select * from Acls where orgId = " + p.orgId;

            models.sequelize.query(
              aclsQuery, 
            {
              type: models.sequelize.QueryTypes.SELECT
            })
            .then(data => {
              logger.debug(`${mvcType} getAcl: ${data}`);
              if(data && data.length>0){
                p.dataValues.acls=data[0].jsonData[p.role];
              }
              res.cookie(cookieName, token, { httpOnly: true }).status(200).json(p);
            })
            .catch(error => {
              logger.error(`${mvcType} getAcl -> error: ${error.stack}`);
              res.status(400).send(error);
            });

            
          } else {
            // Login failed
            let _m = "Username or password is incorrect";
            logger.debug(`${mvcType} authenticate -> ${_m}`);
            res.status(401).json({
              auth: false,
              success: false,
              token: null,
              err: _m
            });
          }
        });
      })
      .catch(error => {
        logger.error(`${mvcType} authenticate -> error: ${error.stack}`);
        res.status(400).send({
          auth: false,
          success: false,
          token: null,
          message: "Unknown error occurred"
        });
      });
  },

  logout(req, res) {
    logger.debug(`${mvcType} logout -> clearing cookie ${cookieName}`);
    res.clearCookie(cookieName, { httpOnly: true }).sendStatus(200);
  },

  validateToken(req, res) {
    // check header or url parameters or post parameters for token
    logger.debug(`${mvcType} validateToken -> enter`);

    const token =
        req.cookies.token ||
        req.body.token ||
        req.params.token ||
        req.headers["X-Access-Token"] ||
        req.headers["Authorization"];

    logger.debug(`${mvcType} validateToken -> token = ${token}`);

    var _code = 403;
    var _body = {};

    // decode token
    if (token !== undefined && token) {
      logger.debug(`${mvcType} validateToken -> before jwt.verify`);
      // verifies secret and checks exp
      jwt.verify(token, config.get("security.jwtSecret"), function(
        err,
        decoded
      ) {
        if (err) {
          logger.error(
            `${mvcType} validateToken -> error, failed to authenticate token`
          );
          _code = 401;
          _body = {
            success: false,
            message: "Failed to authenticate token"
          };
        } else {
          // if everything is good, save to request for use in other routes
          logger.debug(`${mvcType} validateToken -> success`);
          res.decoded = decoded;
          logger.debug(`${mvcType} validateToken -> decoded token is: ${decoded}`);
          _code = 200;
        }
      });
    } else {
      // if there is no token
      // return an error
      logger.error(`${mvcType} validateToken -> error: no token`);
      _body = {
        success: false,
        message: "No token provided."
      };
    }

    // send the result
    return res.status(_code).json(_body);
  },

  reset(req, res) {
    logger.debug(`${mvcType} reset -> start`);
    // Find a person by email.
    logger.debug(`${mvcType} reset -> email: ${req.body.email}`);
    return Person.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(p => {

            let password = randomString(8);
            let hashedValue = getHash(password);
            logger.debug(`${mvcType} create -> after hash, hash: ${hashedValue} pid ${p}`);
            

            models.Person.update(
              {
                pwdhash: hashedValue
              },
              {
                returning: true,
                where: {
                  id: p.id
                }
              }
            ) .then(([d, updatestatus]) => {
              logger.debug(`${mvcType} update -> successful`);
              if (updatestatus === 1) {
                res.status(200).send({
                  success: true,
                  message: "New password email sent."
                });

                const to = req.body.email;
                const subject = "PIE Account details.";
                let text = "Hi "+p.firstName+",";
                    text+= "<br/><br/>"; 
                    text+= "Your password has been reset successfully. Your account details are as follow:" ;
                    text+= "<br/><br/>"; 
                    text+= "User Name : "+p.email; 
                    text+= "<br/>"; 
                    text+= "Password : "+password; 
                    text+= "<br/><br/>"; 
                    text+= "To sign in to your account please visit - <a href='http://pie.value-infinity.com' target='_blank' >http://pie.value-infinity.com</a>"; 
                    text+= "<br/><br/>"; 
                    text+= "Teams"; 
                    text+= "<br/>";
                    text+= "Value-Infinity.";  
                mailer.sendMail(to,subject,text);

              } else {
                res.status(200).send({
                  success: true,
                  message: "Something went wrong"
                });
              }
            })
            .catch(error => {
              logger.error(`${mvcType} update -> error: ${error.stack}`);
              res.status(400).send(error);
            });

           
          
      })
      .catch(error => {
        logger.error(`${mvcType} authenticate -> error: ${error.stack}`);
        res.status(400).send({
          auth: false,
          success: false,
          token: null,
          message: "Unknown error occurred"
        });
      });
  },

  async saveAcl(req, res){
    const orgId = req.body.orgId;
    const jsonData = req.body.roleAcls;
    const query = "select * from Acls where orgId = " + orgId;

    return models.sequelize.query(
      query, 
      {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(data => {
        let sql =null;
        if(data.length > 0){
          sql = "update Acls set jsonData = '" + jsonData + "',updatedAt=now() where orgId = " + orgId + ";";
        }else{
          sql = "insert into Acls (orgId, jsonData,createdAt,updatedAt) values (" + orgId + ",'"+ jsonData + "',now(),now())";
        }

        models.sequelize.query(sql, {
          type: models.sequelize.QueryTypes.RAW
        }).then(gantt => {
          logger.debug(`${mvcType}  saveAcl -> successful`);
          res.status(201).send(gantt);
        })
        .catch(error => {
          logger.error(`${mvcType}  saveAcl -> error: ${error.stack}`);
          res.status(400).send(error);
        });

      })
      .catch(error => {
        logger.error(`${mvcType} saveAcl -> error: ${error.stack}`);
        res.status(400).send(error);
      });


    

  },
  getAcl(req, res){
    const orgId = req.params.orgId;

    const query = "select * from Acls where orgId = " + orgId;

    return models.sequelize.query(
      query, 
      {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(data => {
        logger.debug(`${mvcType} getAcl: ${data}`);
        res.status(201).send(data);
      })
      .catch(error => {
        logger.error(`${mvcType} getAcl -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  changePassword(req, res) {
    logger.debug(`${mvcType} changePassword -> email: ${req.body.email}`);
    return Person.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(async p => {
        const result = await bCrypt.compare(req.body.oldpassword, p.pwdhash);
        if (result === true) {
          let hashedValue = getHash(req.body.password);
          models.Person.update(
            {
              pwdhash: hashedValue
            },
            {
              returning: true,
              where: {
                id: p.id
              }
            }
          ) .then(([d, updatestatus]) => {
            logger.debug(`${mvcType} update -> successful`);
            if (updatestatus === 1) {
              res.status(200).send({
                success: true,
                message: "Password Changed."
              });

            } else {
              res.status(200).send({
                success: false,
                message: "Something went wrong"
              });
            }
          })
          .catch(error => {
            logger.error(`${mvcType} update -> error: ${error.stack}`);
            res.status(400).send(error);
          });

        } else {
          res.status(200).send({
            success: false,
            message: "incorrect password"
          });
        }
           

      })
      .catch(error => {
        logger.error(`${mvcType} authenticate -> error: ${error.stack}`);
        res.status(400).send({
          auth: false,
          success: false,
          token: null,
          message: "Unknown error occurred"
        });
      });
  },

  getRoletypes(req, res){
    const orgId = req.params.orgId;

    const query = "select description from Roles where orgId = " + orgId;

    return models.sequelize.query(
      query, 
      {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(data => {
        logger.debug(`${mvcType} getAcl: ${data}`);
        res.status(201).send(data);
      })
      .catch(error => {
        logger.error(`${mvcType} getAcl -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  index(req, res) {
    res.json({
      success: true,
      message: "/"
    });
  }
};
