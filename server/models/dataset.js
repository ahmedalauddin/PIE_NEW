/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/dataset.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:20:42
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} DataSource start definition`);
  var DataSet = sequelize.define(
    "DataSet",
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
      sourceFile: {
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
      tableName: "DataSets"
    }
  );
  logger.debug(`${callerType} DataSet end definition`);

  DataSet.associate = models => {
    logger.debug(`${callerType} DataSet belongsTo Project`);
    DataSet.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} DataSet belongsTo DataSource`);
    DataSet.belongsTo(models.DataSource, {
      as: "dataSource",
      foreignKey: "dataSourceId",
      onDelete: "cascade"
    });
  };

  return DataSet;
};
