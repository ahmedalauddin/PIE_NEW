/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpiproject.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:19:02
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} KpiProjects start definition`);
  var KpiProject = sequelize.define(
    "KpiProject",
    {
      projectId: {
        type: DataTypes.INTEGER,
      },
      kpiId: {
        type: DataTypes.INTEGER,
      },
      active: {
        type: DataTypes.TINYINT,
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
      tableName: "KpiProjects"
    }
  );
  logger.debug(`${callerType} KpiProjects end definition`);

  return KpiProject;
};
