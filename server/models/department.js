/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/department.js
 * Descr:    Sequelize model for department.
 * Created:  2019-04-12
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Department start definition`);
  var Department = sequelize.define(
    "Department",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      disabledAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
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
      tableName: "Departments"
    }
  );
  logger.debug(`${callerType} Department end definition`);

  Department.associate = models => {
    logger.debug(`${callerType} Department belongsTo Organization`);
    Department.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });
  };

  return Department;
};
