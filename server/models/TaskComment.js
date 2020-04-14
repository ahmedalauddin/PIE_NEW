'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectComment = sequelize.define('TaskComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    personName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    disabledAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: "TaskComments"
  });


  return ProjectComment;
};