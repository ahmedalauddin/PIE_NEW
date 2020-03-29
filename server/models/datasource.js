/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/datasource.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:20:23
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} DataSource start definition`);
  var DataSource = sequelize.define(
    "DataSource",
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
      tableName: "DataSources"
    }
  );
  logger.debug(`${callerType} DataSource end definition`);

  DataSource.associate = models => {
    logger.debug(`${callerType} DataSource belongsTo Organization`);
    DataSource.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} DataSource hasMany DataSet`);
    DataSource.hasMany(models.DataSet, {
      as: "datasets",
      foreignKey: "dataSourceId"
    });
  };

  return DataSource;
};
