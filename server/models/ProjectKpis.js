/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/ProjectKpi.js
 * Created:  2020-04-06
 * Author:   Pawan
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} ProjectKpi start definition`);
  var ProjectKpi = sequelize.define(
    "ProjectKpi",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      kpiId: {
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
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      }
    },
    {
      tableName: "ProjectKpis"
    }
  );
  logger.debug(`${callerType} ProjectKpi end definition`);

  // now prepare the associations
  ProjectKpi.associate = models => {
    logger.debug(`${callerType} ProjectKpi belongsTo project`);
    ProjectKpi.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} ProjectKpi belongsTo Kpi`);
    ProjectKpi.belongsTo(models.Kpi, {
      as: "kpi",
      foreignKey: "kpiId",
      onDelete: "cascade"
    });
  };

  return ProjectKpi;
};
