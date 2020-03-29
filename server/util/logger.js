/**
 * Project:  valueinfinity-mvp
 * File:     /server/util/log.js
 * Created:  2019-02-17 16:20:48
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-08 10:10:23
 * Editor:   Darrin Tisdale
 */
/* eslint no-console: "off" */
"use strict";

// declarations
const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const config = require("../config/config");

/* ONE TIME SETUP
We set up the winston logger configuration when the
module is first invoked.On subsequent invocations,
we use the existing logger, with the specific
formats defined in the class instance */

/**
 * default transport configurations
 */
const _transports = {
  std: {
    active: isStdActive(),
    transport: new winston.transports.DailyRotateFile({
      name: "std",
      filename: config.get("log.outputs.std.path"),
      format: winston.format.json(),
      maxSize: config.get("log.outputs.std.maxSize"),
      maxFiles: config.get("log.outputs.std.count"),
      zippedArchive: true
    })
  },
  error: {
    active: isErrorActive(),
    transport: new winston.transports.DailyRotateFile({
      name: "error",
      filename: config.get("log.outputs.error.path"),
      format: winston.format.json(),
      maxSize: config.get("log.outputs.std.maxSize"),
      maxFiles: config.get("log.outputs.std.count"),
      zippedArchive: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  },
  console: {
    active: isConsoleActive() || (!isStdActive() && !isErrorActive()),
    transport: new winston.transports.Console({
      name: "console",
      level: getConsoleLogLevel(),
      format: winston.format.json()
    })
  }
};

/**
 * utility to define the json winston formatter
 * based on information provided in the config
 *
 * @param {string} label text to be inserted as a label
 * @returns winston.format for winston.logger
 */
function createJsonFormat(label = "") {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  );
}

/**
 * utility to define the console winston formatter
 * based on information provided in the config
 *
 * @param {string} label text to be inserted as a label
 * @returns winston.format for winston.logger
 */
function createConsoleFormat(label = "") {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  );
}

/**
 * utility to determine console level of logging
 * based on the request for logging exceptions
 *
 * @returns console logging level
 */
function getConsoleLogLevel() {
  return config.get("log.outputs.console.handleExceptions")
    ? "debug"
    : config.get("log.level");
}

/**
 * utility function to determine if console logging is active
 *
 * @returns true if console logging is active
 */
function isConsoleActive() {
  return config.get("log.outputs.console.active") === true;
}

/**
 * utility function to determine if error logging is active
 *
 * @returns true if error logging is active
 */
function isErrorActive() {
  return config.get("log.outputs.error.active") === true;
}

/**
 * utility function to determine if std logging is active
 *
 * @returns true if standard logging is active
 */
function isStdActive() {
  return config.get("log.outputs.std.active") === true;
}

function getTransports(label = "") {
  let _t = [];
  if (_transports.std.active) {
    _transports.std.transport.format = createJsonFormat(label);
    _t.push(_transports.std.transport);
  }
  if (_transports.error.active) {
    _transports.error.transport.format = createJsonFormat(label);
    _t.push(_transports.error.transport);
  }
  if (_transports.console.active) {
    _transports.console.transport.format = createConsoleFormat(label);
    _t.push(_transports.console.transport);
  }
  return _t;
}

// create and configure master logger instance
const logger = winston.createLogger({
  level: config.get("log.level"),
  format: winston.format.json(), // overridden by each logger
  transports: getTransports(),
  exitOnError: false
});
logger.debug("winston logger default instance created");

/**
 * defines the export of the module to be
 * a category based on one defined for the file
 *
 * @param { string } module the file path of the module calling
 * @returns {winston.logger} instance of the winston logger
 */
module.exports = module => {
  // extract the information we want
  var _file, _folder, _fo, _namespace;
  if (module) {
    _file = path.basename(module);
    _fo = path
      .dirname(module)
      .split(path.sep)
      .pop();
    _folder = _fo === "valueinfinity-mvp" ? "(root)" : _fo;
  } else {
    _file = "*";
    _folder = "*";
  }
  _namespace = `${_folder}::${_file}`;

  // create a new category using the module
  winston.loggers.add(module, {
    // overridden by each logger
    transports: getTransports(_namespace)
  });

  // return the instance to the caller
  return winston.loggers.get(module);
};
