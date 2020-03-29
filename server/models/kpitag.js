/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpitag.js
 * Created:  2019-05-04
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} KpiTag start definition`);
  var KpiTag = sequelize.define(
    "KpiTag",
    {
      kpiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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
      tableName: "KpiTags"
    }
  );
  logger.debug(`${callerType} KpiTag end definition`);



  return KpiTag;
};
