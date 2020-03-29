/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/idea.js
 * Created:  2019-07-05
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Idea start definition`);
  var Idea = sequelize.define(
    "Idea",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ideaText: {
        type: DataTypes.STRING,
        allowNull: true
      },
      nodeId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orgId: {
        type: DataTypes.INTEGER,
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
      tableName: "Ideas",
      freezeTableName: true
    }
  );
  logger.debug(`${callerType} Idea end definition`);

  logger.debug(`${callerType} Idea start associations`);
  Idea.associate = models => {
    logger.debug(`${callerType} Idea belongsTo Organization`);
    Idea.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId"
    });
  };
  logger.debug(`${callerType} Idea end associations`);

  return Idea;
};
