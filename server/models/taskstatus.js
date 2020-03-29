/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/taskstatus.js
 * Created:  2019-04-19
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} TaskStatus start definition`);
  var TaskStatus = sequelize.define(
    "TaskStatus",
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
      tableName: "TaskStatuses"
    }
  );
  logger.debug(`${callerType} TaskStatus end definition`);

  TaskStatus.associate = models => {
    logger.debug(`${callerType} TaskStatus hasMany Task`);
    TaskStatus.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "statusId"
    });

  };

  return TaskStatus;
};
