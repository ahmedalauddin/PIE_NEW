/**
 * Project: valueinfinity-mvp
 * File:    /server/config/config.js
 * Created: 2019-02-16 18:02:01
 * Author:  Darrin Tisdale
 * -----
 * Modified: 2019-02-20 23:05:36
 * Editor:   Darrin Tisdale
 */
/* eslint-disable no-console */
"use strict";

// declarations
const convict = require("convict");
const path = require("path");
const dotenv = require("dotenv");

// schema structure
const configSchema = {
  env: {
    doc: "defines the node environment",
    format: ["prod", "dev", "test", "host", "local"],
    default: "dev",
    arg: "nodeEnv",
    env: "NODE_ENV"
  },
  security: {
    jwtSecret: {
      doc: "secret used for web tokens",
      format: "String",
      default: "quid-pro-quo",
      arg: "jwtSecret",
      env: "JWT_SECRET"
    }
  },
  server: {
    host: {
      doc: "server server host",
      format: "String",
      default: "localhost",
      arg: "serverHost",
      env: "SERVER_HOST"
    },
    port: {
      doc: "server server port",
      format: "port",
      default: 3001,
      arg: "serverPort",
      env: "SERVER_PORT"
    }
  },
  db: {
    user: {
      doc: "login user for database",
      format: "String",
      default: "root",
      arg: "dbUser",
      env: "DB_USER"
    },
    password: {
      doc: "password for db.user",
      format: "*",
      default: "",
      arg: "dbPassword",
      env: "DB_PASSWORD",
      sensitive: true
    },
    name: {
      doc: "database/schema name",
      format: "String",
      default: "mvp2",
      arg: "dbName",
      env: "DB_NAME"
    },
    host: {
      doc: "database server host",
      format: "*",
      default: "localhost",
      arg: "dbHost",
      env: "DB_HOST"
    },
    dialect: {
      doc: "dialect of the connector to be used",
      format: ["mysql", "sqlite", "postgres", "mssql"],
      default: "mysql",
      arg: "dbDialect",
      env: "DB_DIALECT"
    },
    port: {
      doc: "port for connection to db server",
      format: Number,
      default: 3306,
      arg: "dbPort",
      env: "DB_PORT"
    }
  },
  log: {
    level: {
      doc: "logging level for non-development logs",
      format: ["error", "warn", "info", "verbose", "debug", "silly"],
      default: "info",
      arg: "logLevel",
      env: "LOG_LEVEL"
    },
    debugNamespaces: {
      doc: "Namespaces to expose for use with the debugging library",
      format: "String",
      default: "",
      arg: "debugNamespaces",
      env: "DEBUG"
    },
    outputs: {
      std: {
        active: {
          doc: "use file based logging for the application",
          format: "Boolean",
          default: true,
          arg: "logStdActive",
          env: "LOG_STD_ACTIVE"
        },
        path: {
          doc: "path to standard log file",
          format: "String",
          default: "./valueinfinity-mvp.log",
          arg: "logStdPath",
          env: "LOG_STD_PATH"
        },
        format: {
          doc: "output format",
          format: ["text", "json"],
          default: "json",
          arg: "logStdFormat",
          env: "LOG_FILE_FORMAT"
        },
        maxSize: {
          doc: "maximum file size for standard log files",
          format: "Number",
          default: 52428800,
          arg: "logFileMaxSize",
          env: "LOG_FILE_MAX_SIZE"
        },
        count: {
          doc: "maximum number of standard log files",
          format: "Number",
          default: 5,
          arg: "logFileMaxCount",
          env: "LOG_FILE_MAX_COUNT"
        }
      },
      error: {
        active: {
          doc: "use file based logging for errors",
          format: "Boolean",
          default: true,
          arg: "logErrorActive",
          env: "LOG_ERROR_Active"
        },
        path: {
          doc: "path to error log file",
          format: "String",
          default: "./valueinfinity-mvp.err",
          arg: "logErrorPath",
          env: "LOG_ERROR_PATH"
        },
        maxSize: {
          doc: "maximum file size",
          format: "Number",
          default: 5242880,
          arg: "logERRORMaxSize",
          env: "LOG_ERROR_MAX_SIZE"
        },
        count: {
          doc: "maximum number of log files",
          format: "Number",
          default: 5,
          arg: "logErrorMaxCount",
          env: "LOG_ERROR_MAX_COUNT"
        }
      },
      console: {
        active: {
          doc: "enable console logging",
          format: "Boolean",
          default: true,
          arg: "logConsoleActive",
          env: "LOG_CONSOLE_ACTIVE"
        },
        handleExceptions: {
          doc: "include error information in console log",
          format: "Boolean",
          default: false,
          arg: "logConsoleError",
          env: "LOG_CONSOLE_ERROR"
        }
      }
    }
  }
};

// read in the environment variables
dotenv.config();

// structure the variables to be read in
const config = convict(configSchema);

// load the proper config variables, if they are in the json file
const env = config.get("env");
config.loadFile(path.join(__dirname, `${env}.json`));

// throws error if config does not conform to schema
config.validate({ allowed: "strict" });

// eslint-disable-next-line prettier/prettier
console.debug(
  `env: ${config.get("env")}, log level: ${config.get("log.level")}`
);


config.isHosted = ()=> {
  return config.get("env") === "host" || config.get("env") === "prod";
}
module.exports = config;
