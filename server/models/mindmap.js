/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/mindmap.js
 * Created:  2019-01-27 13:44:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:18:27
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

/* define the model for the Mindmap table */
module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Mindmap start definition`);
  var Mindmap = sequelize.define(
    "Mindmap",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      mapData: {
        type: DataTypes.JSON,
        allowNull: true
      },
      mapName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mapDescription: {
        type: DataTypes.STRING,
        allowNull: true
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
      tableName: "Mindmaps"
    }
  );
  logger.debug(`${callerType} Organization end definition`);

  /* set up the associations */
  Mindmap.associate = models => {
    logger.debug(`${callerType} Mindmap belongsTo Organization`);
    Mindmap.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });
  };

  /* return the model */
  return Mindmap;
};
