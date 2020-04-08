/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpi.js
 * Created:  2019-01-27 13:44:17
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24 22:19:23
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Kpi start definition`);
  var Kpi = sequelize.define(
    "Kpi",
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
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      deptId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      orgPriority: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mindmapNodeId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      formulaDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      active: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
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
      tableName: "Kpis"
    }
  );
  logger.debug(`${callerType} Kpi end definition`);

  Kpi.associate = models => {
    logger.debug(`${callerType} Kpi hasMany KpiTag`);
    Kpi.hasMany(models.KpiTag, {
      as: "tags",
      foreignKey: "kpiId",
      targetKey: "kpiId"
    });

    logger.debug(`${callerType} Kpi belongsTo Organization`);
    Kpi.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Kpi belongsTo Department`);
    Kpi.belongsTo(models.Department, {
      as: "department",
      foreignKey: "deptId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Kpi belongsTo Project`);
    Kpi.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId"
    });
  }
  return Kpi;
};
