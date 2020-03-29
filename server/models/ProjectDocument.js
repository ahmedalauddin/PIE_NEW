'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectDocument = sequelize.define('ProjectDocument', {
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
    projId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uploadBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
  ProjectDocument.associate = function(models) {
    ProjectDocument.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projId",
      onDelete: "cascade"
    });
    ProjectDocument.belongsTo(models.Person, {
      as: "person",
      foreignKey: "uploadBy",
      onDelete: "cascade"
    });
  };
  return ProjectDocument;
};