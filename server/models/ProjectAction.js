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
      type: DataTypes.STRING,
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
    },
    priority: {
      type: DataTypes.ENUM('High','Medium','Low'),
      defaultValue: 'Medium',
    },
    comments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    progress:{
      type: DataTypes.STRING,
      defaultValue: '0%',
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

    ProjectAction.belongsToMany(models.Person, {
      through: "ProjectActionPersons",
      as: "assigneeIds",
      foreignKey: "projectActionId",
      otherKey: "assigneeId"
    });
  };
  return ProjectAction;
};