/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/milestone.js
 * Descr:    Sequelize model for Milestones
 * Created:  2019-05-14
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

function checkTargetDate(milestone) {
  // TODO - need to validate against project start and end dates.
  let projectStart = new Date(milestone.projectStartAt);
  let projectEnd = new Date(milestone.projectEndAt);
  let success = true;
  if (projectStart != null) {
    if (milestone.targetDate < projectStart) {
      throw new Error("Milestone target date is prior to the start of the project.");
    }
  }
  if (projectEnd != null) {
    if (milestone.targetDate > projectEnd) {
      throw new Error("Milestone target date is after the end of the project.");
    }
  }
  return success;
};

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Milestone start definition`);
  var Milestone = sequelize.define(
    "Milestone",
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
      targetDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      projectStartAt: {
        type: DataTypes.VIRTUAL
      },
      projectEndAt: {
        type: DataTypes.VIRTUAL
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "1",
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
      tableName: "Milestones",
      hooks: {
        beforeValidate: (milestone, options, callback) => {

        },
        afterValidate: () => {
        },
        beforeCreate: (milestone, options, callback) => {
          if (milestone.statusId == 0) {
            milestone.statusId = 1;
          }
          if (milestone.targetDate) {
            return checkTargetDate(milestone, options, callback);
          } else {
            return callback(null, options);
          }

        },
        afterCreate: (res) => {
        },
        beforeUpdate: () => {
        },
        afterUpdate: () => {
        }
      }
    }
  );
  logger.debug(`${callerType} Milestone end definition`);

  logger.debug(`${callerType} Milestone start associations`);
  Milestone.associate = models => {
    logger.debug(`${callerType} Milestone belongsTo Project`);
    Milestone.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Milestone belongsTo TaskStatus`);
    Milestone.belongsTo(models.TaskStatus, {
      as: "status",
      foreignKey: "statusId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Milestone hasMany Task`);
    Milestone.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "milestoneId"
    });
  };
  logger.debug(`${callerType} Milestone end associations`);

  return Milestone;
};
