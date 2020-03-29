/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/taskpriority.js
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
  logger.debug(`${callerType} TaskPriority start definition`);
  var TaskPriority = sequelize.define(
    "TaskPriority",
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
      priority: {
        type: DataTypes.INTEGER,
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
      tableName: "TaskPriorities"
    }
  );
  logger.debug(`${callerType} TaskPriority end definition`);

  TaskPriority.associate = models => {
    logger.debug(`${callerType} TaskPriority hasMany Task`);
    TaskPriority.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "priorityId"
    });
  };

  return TaskPriority;
};
