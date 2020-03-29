/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/projectperson.js
 * Created:  2019-04-23
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} ProjectPerson start definition`);
  var ProjectPerson = sequelize.define(
    "ProjectPerson",
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      personId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inProject: {
        type: DataTypes.TINYINT,
        defaultValue: true,
        allowNull: true
      },
      owner: {
        type: DataTypes.TINYINT,
        defaultValue: true,
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
      tableName: "ProjectPersons"
    }
  );
  logger.debug(`${callerType} ProjectPerson end definition`);

  // now prepare the associations
  ProjectPerson.associate = models => {
    logger.debug(`${callerType} ProjectPerson belongsTo Project`);
    ProjectPerson.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} ProjectPerson belongsTo Person`);
    ProjectPerson.belongsTo(models.Person, {
      as: "person",
      foreignKey: "personId",
      onDelete: "cascade"
    });
  };

  return ProjectPerson;
};
