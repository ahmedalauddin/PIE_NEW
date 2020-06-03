'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrganizationAction = sequelize.define('OrganizationAction', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Open','Closed'),
      defaultValue: 'Open',
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
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
    },
    dateAdded: {
      type: DataTypes.STRING,
      allowNull: false
    },
    projectActions: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {});
    OrganizationAction.associate = function(models) {
      OrganizationAction.belongsTo(models.Organization, {
        as: "organization",
        foreignKey: "orgId",
        onDelete: "cascade"
      });
      OrganizationAction.belongsTo(models.Person, {
        as: "person",
        foreignKey: "assigneeId",
        onDelete: "cascade"
      });
  };
  return OrganizationAction;
};