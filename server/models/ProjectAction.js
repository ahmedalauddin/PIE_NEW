'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectAction = sequelize.define('ProjectAction', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Open','Closed','New'),
      defaultValue: 'New',
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
    }
  }, {});
  ProjectAction.associate = function(models) {
    ProjectAction.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projId",
      onDelete: "cascade"
    });
    ProjectAction.belongsTo(models.Person, {
      as: "person",
      foreignKey: "assigneeId",
      onDelete: "cascade"
    });
  };
  return ProjectAction;
};