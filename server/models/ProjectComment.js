'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectComment = sequelize.define('ProjectComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: "ProjectComments"
  });

  ProjectComment.associate = function(models) {
    ProjectComment.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projId",
      onDelete: "cascade"
    });
    ProjectComment.belongsTo(models.Person, {
      as: "person",
      foreignKey: "personId",
      onDelete: "cascade"
    });
  };
  return ProjectComment;
};