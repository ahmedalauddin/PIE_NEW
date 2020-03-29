/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/task.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-04-18
 * Editor:   Brad Kaufman
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Task start definition`);
  var Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      milestoneId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      priorityId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      assignedTo: {
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
      tableName: "Tasks"
    }
  );
  logger.debug(`${callerType} Task end definition`);

  Task.associate = models => {
    logger.debug(`${callerType} Task belongsTo Project`);
    Task.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Task belongsTo Person`);
    Task.belongsTo(models.Person, {
      as: "assigned",
      foreignKey: "assignedTo",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Task belongsTo Milestone`);
    Task.belongsTo(models.Milestone, {
      as: "milestone",
      foreignKey: "milestoneId"
    });

    logger.debug(`${callerType} Task belongsTo TaskPriority`);
    Task.belongsTo(models.TaskPriority, {
      as: "priority",
      foreignKey: "priorityId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Task belongsTo TaskStatus`);
    Task.belongsTo(models.TaskStatus, {
      as: "status",
      foreignKey: "statusId",
      onDelete: "cascade"
    });
  };

  return Task;
};
