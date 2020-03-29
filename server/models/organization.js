/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/organization.js
 * Created:  2019-01-27 17:42:16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 23:38:59
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Organization start definition`);
  var Organization = sequelize.define(
    "Organization",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      owningOrg: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      lockPrioritization: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }
    },
    {
      tableName: "Organizations",
      freezeTableName: true
    }
  );
  logger.debug(`${callerType} Organization end definition`);

  logger.debug(`${callerType} Organization start associations`);
  Organization.associate = models => {
    logger.debug(`${callerType} Organization hasMany Person`);
    Organization.hasMany(models.Person, {
      foreignKey: "orgId",
      as: "persons"
    });
    logger.debug(`${callerType} Organization hasMany Project`);
    Organization.hasMany(models.Project, {
      foreignKey: "orgId",
      as: "projects"
    });
    logger.debug(`${callerType} Organization hasMany Kpi`);
    Organization.hasMany(models.Kpi, {
      foreignKey: "orgId",
      as: "kpis"
    });
    logger.debug(`${callerType} Organization hasMany Department`);
    Organization.hasMany(models.Department, {
      foreignKey: "orgId",
      as: "departments"
    });
    logger.debug(`${callerType} Organization hasOne Mindmap`);
    Organization.hasOne(models.Mindmap, {
      foreignKey: "orgId",
      as: "mindmap"
    });
    Organization.hasMany(models.OrganizationAction, {
      foreignKey: "orgId",
      as: "organizationaction"
    });
    Organization.hasMany(models.OrganizationDocument, {
      foreignKey: "orgId",
      as: "Organizationdocument"
    });
  };
  logger.debug(`${callerType} Organization end associations`);

  return Organization;
};
