/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/organizationperson.js
 * Created:  2020-02-07
 * Author:   Ricky Harerri
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} OrganizationPerson start definition`);
  var OrganizationPerson = sequelize.define(
    "OrganizationPerson",
    {
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      personId: {
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
      }
    },
    {
      tableName: "OrganizationPersons"
    }
  );
  logger.debug(`${callerType} OrganizationPerson end definition`);

  // now prepare the associations
  OrganizationPerson.associate = models => {
    logger.debug(`${callerType} OrganizationPerson belongsTo Organization`);
    OrganizationPerson.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "organizationId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} OrganizationPerson belongsTo Person`);
    OrganizationPerson.belongsTo(models.Person, {
      as: "person",
      foreignKey: "personId",
      onDelete: "cascade"
    });
  };

  return OrganizationPerson;
};
