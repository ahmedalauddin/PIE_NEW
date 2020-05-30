/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/project.js
 * Created:  2019-01-30 11:33:14
 * Author:   Brad Kaufman
 * Descr:    Sequelize model for projects.
 * -----
 * Modified: 2019-02-24 22:21:54
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Project start definition`);
  var Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessGoal: {
        type: DataTypes.STRING,
        allowNull: true
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mindmapId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nodeId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mainKpiId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      currentTaskId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endAt: {
        type: DataTypes.DATE,
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
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
      },
      completedAt: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      deptId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: "Projects"
    }
  );
  logger.debug(`${callerType} Project end definition`);

  Project.associate = models => {
    logger.debug(`${callerType} Project belongsTo Organization`);
    Project.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });


    logger.debug(`${callerType} Project belongsTo ProjectStatus`);
    Project.belongsTo(models.ProjectStatus, {
      as: "status",
      foreignKey: "statusId"
    });

    /*
    logger.debug(`${callerType} Project hasMany KPI`);
    Project.hasMany(models.Kpi, {
      as: "kpis",
      foreignKey: "projectId"
    });*/

    logger.debug(`${callerType} Project hasMany Task`);
    Project.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "projectId"
    });

    logger.debug(`${callerType} Project hasMany Milestone`);
    Project.hasMany(models.Milestone, {
      as: "milestones",
      foreignKey: "projectId"
    });

    logger.debug(`${callerType} Project belongsToMany Person`);
    Project.belongsToMany(models.Person, {
      through: "ProjectPersons",
      as: "team",
      foreignKey: "projectId",
      otherKey: "personId"
    });

    Project.hasMany(models.ProjectAction, {
      foreignKey: "projId",
      as: "projectaction"
    });

    Project.hasMany(models.ProjectDocument, {
      foreignKey: "projId",
      as: "ProjectDocument"
    });
  };

  return Project;
};
