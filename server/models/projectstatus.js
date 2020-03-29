/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/projectstatus.js
 * Created:  2019-05-27
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} ProjectStatus start definition`);
  var ProjectStatus = sequelize.define(
    "ProjectStatus",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true
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
      tableName: "ProjectStatuses"
    }
  );
  logger.debug(`${callerType} ProjectStatus end definition`);

  ProjectStatus.associate = models => {
    logger.debug(`${callerType} ProjectStatus hasMany Project`);
    ProjectStatus.hasMany(models.Task, {
      as: "projects",
      foreignKey: "statusId"
    });

  };

  return ProjectStatus;
};
