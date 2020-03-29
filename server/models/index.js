/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/index.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 10:21:48
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const config = require("../config/config");
const fs = require("fs");
const Sequelize = require("sequelize");
var logger = require("../util/logger")(__filename);
const path = require("path");
var db = {};
const callerType = "model";

// get configuration variables
let _d = config.get("db.name");
let _u = config.get("db.user");
let _p = config.get("db.password");
let _h = config.get("db.host");
let _l = config.get("db.dialect");
let _r = config.get("db.port");

// log configuration
// eslint-disable-next-line prettier/prettier
logger.debug(`${_l}://${_u}:${_p}@${_h}:${_r}/${_d}`);

// connect to the db
//let sequelize = new Sequelize(_d, _u, _p, { port: _r, host: _h, dialect: _l });
let sequelize = new Sequelize(`${_l}://${_u}:${_p}@${_h}:${_r}/${_d}`, {
  dialect: `${_l}`,
  pool: { maxConnections: 5, maxIdleTime: 30 }
});

logger.info(`${callerType} -> loading the models`);

// read the models into sequelize
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      path.extname(file) === ".js"
    );
  })
  .forEach(file => {
    let _m = path.join(__dirname, file);
    logger.debug(`${callerType} -> importing from ${file}`);
    let model = sequelize.import(_m);
    logger = require("../util/logger")(__filename);
    logger.debug(`${callerType} -> found ${model.name} model`);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    logger = require("../util/logger")(__filename);
    logger.debug(`${callerType} -> associations for ${modelName} complete`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

logger.debug(`${callerType} -> exporting sequelize and models`);

module.exports = db;
