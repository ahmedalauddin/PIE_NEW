/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/ProjectActionPerson.js
 * Created:  2019-04-23
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} ProjectActionPerson start definition`);
  var ProjectActionPerson = sequelize.define(
    "ProjectActionPerson",
    {
      projectActionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assigneeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
      }
    },
    {
      tableName: "ProjectActionPersons"
    }
  );
  logger.debug(`${callerType} ProjectActionPerson end definition`);


  return ProjectActionPerson;
};
