'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrganizationDocument = sequelize.define('OrganizationDocument', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uploadBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    disabledAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      onUpdate: DataTypes.NOW
    }
  }, {});
  OrganizationDocument.associate = function(models) {
    OrganizationDocument.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });
    OrganizationDocument.belongsTo(models.Person, {
      as: "person",
      foreignKey: "uploadBy",
      onDelete: "cascade"
    });
  };
  return OrganizationDocument;
};