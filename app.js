/**
 * Project:  valueinfinity-mvp
 * File:     /app.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-04-24
 * Editor:   Brad Kaufman
 */
"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var expressWinston = require("express-winston");
var cookieParser = require("cookie-parser");
var config = require("./server/config/config");
const models = require("./server/models");
const logger = require("./server/util/logger")(__filename);

// function to determine environment
// const isHosted = () => {
//   return config.get("env") === "host" || config.get("env") === "prod";
// };

// create the instance of express
logger.debug(`constructing express app`);
var app = express();

// Parse incoming requests data (https://github.com/expressjs/body-parser)
logger.debug(`adding parsers`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// add support for static files and the built react app
if(config.isHosted()){
  let serverPath =  path.join(__dirname, "client/build")
  app.use(express.static(serverPath));
}
 


// create a router
var router = express.Router();

// set the home path
/* logger.debug(`router GET -> path: /*`);
 router.get("/*", (req, res) => {
   if (isHosted()) {
     res.sendFile(join(serverPath, "/index.html"));
   } else {
     res.status(200).send({
       message: "Welcome to the Value Infinity MVP API"
     });
   }
 });
 */

// priot to adding the routes, let's add the models
// connect
logger.info(`connecting to database`);
models.sequelize
  .sync()
  .then(() => {
    logger.info(`connection to database successful, loading routes`);
    require("./server/routes/index")(router);
    require("./server/routes/organization")(router);
    require("./server/routes/person")(router);
    require("./server/routes/department")(router);
    require("./server/routes/project")(router);
    require("./server/routes/kpi")(router);
    require("./server/routes/projectperson")(router);
    require("./server/routes/projectstatus")(router);
    require("./server/routes/mindmap")(router);
    require("./server/routes/milestone")(router);
    require("./server/routes/task")(router);
    require("./server/routes/taskpriority")(router);
    require("./server/routes/taskstatus")(router);
    require("./server/routes/idea")(router);
    require("./server/routes/kpitag")(router);
    require("./server/routes/auth")(router);
    require("./server/routes/projectaction")(router);
    require("./server/routes/organizationaction")(router);
    require("./server/routes/projectdocument")(router);
    require("./server/routes/organizationdocument")(router);
  })
  .catch(error => {
    logger.error(`db/routing error: ${error.stack}`);
  });

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.taskstatus || 500);
  res.render("error");
});

// set an expressWinston router for the application
logger.debug(`adding in express logger`);
app.use(
  expressWinston.logger({
    transports: logger.transports,
    format: logger.format,
    statusLevels: false,
    level: function(req, res) {
      var level = "";
      if (res.statusCode >= 100) {
        level = "info";
      }
      if (res.statusCode >= 400) {
        level = "warn";
      }
      if (res.statusCode >= 500) {
        level = "error";
      }
      // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
      if (res.statusCode == 401 || res.statusCode == 403) {
        level = "critical";
      }
      // No one should be using the old path, so always warn for those
      if (req.path === "/api" && level === "info") {
        level = "warn";
      }
      return level;
    }
  })
);

// now set the routes for the app
app.use(router);

if(config.isHosted()){
  let serverPath =  path.join(__dirname, "client/build");
  app.all('/*', function(req, res) { 
    res.sendfile(serverPath+'/index.html'); 
  });
}
// now add in the error logger
// note that the formats defined by the logger should
// handle the formatting of the logs properly
if (
  config.get("log.outputs.console.handleExceptions") &&
  config.get("log.outputs.console.active")
) {
  logger.debug(`adding in express error logger`);
  app.use(
    expressWinston.errorLogger({
      transports: logger.transports,
      format: logger.format,
      dumpExceptions: true,
      showStack: true
    })
  );
}

// export the application object
logger.debug(`exporting app`);
module.exports = app;
