/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/person.js
 * Created:  2019-01-30 11:33:14
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:45:02
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const bCrypt = require("bcrypt");
const callerType = "model";

// password hashing function
var hasSecurePassword = (user, options, callback) => {
  if (user.password != user.passwordConfirmation) {
    logger.debug(`hasSecurePassword -> pass: ${user.password}, confirm: ${user.passwordConfirmation}`);
    throw new Error("Password confirmation doesn't match password");
  }
  bCrypt.hash(user.get("password"), 12, function (err, hash) {
    if (err) return callback(err);
    user.set("pwdHash", hash);
    logger.debug(`hasSecurePassword -> pwdHash: ${hash}`);
    return "success";
    // return callback(null, options);
  });
};

// export
module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Person start definition`);
  var Person = sequelize.define(
    "Person",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
          len: {
            args: [1, 128],
            msg: "The first name must between at 1 and 128 characters."
          }
        }
      },
      lastName: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
          len: {
            args: [1, 128],
            msg: "The last name must between at 1 and 128 characters."
          }
        }
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      allowLogin: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      deptId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [5, 255],
            msg: "The email must between at 5 and 255 characters."
          },
          isEmail: true
        }
      },
      pwdhash: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
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
      },
      isCustomerAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      tableName: "Persons",
      freezeTableName: true,
      getterMethods: {
        fullName() {
          return this.firstName + " " + this.lastName;
        }
      },
      setterMethods: {},
      indexes: [{ unique: true, fields: ["email"] }],
      instanceMethods: {
        authenticate: value => {
          if (bCrypt.compareSync(value, this.pwdhash)) return this;
          else return false;
        }
      }
      
      /*,
      hooks: {
        beforeCreate: (user, options, callback) => {
          user.email = user.email.toLowerCase();
          if (user.password) return hasSecurePassword(user, options, callback);
          else return callback(null, options);
        },
        beforeUpdate: (user, options, callback) => {
          user.email = user.email.toLowerCase();
          if (user.password) return hasSecurePassword(user, options, callback);
          else return callback(null, options);
        }
      }*/
    }
  );
  logger.debug(`${callerType} Person end definition`);

  // now prepare the associations
  logger.debug(`${callerType} Person start associations`);
  Person.associate = models => {
    logger.debug(`${callerType} Person belongsTo Organization`);
    Person.belongsTo(models.Organization, {
      as: "organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Person hasMany Task`);
    Person.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "assignedTo"
    });

    logger.debug(`${callerType} Person belongsToMany Project`);
    Person.belongsToMany(models.Project, {
      through: "ProjectPersons",
      as: "projects",
      foreignKey: "personId",
      otherKey: "projectId"
    });

    logger.debug(`${callerType} Person hasMany ProjectAction`);
    Person.hasMany(models.ProjectAction, {
      as: "ProjectActions",
      foreignKey: "assigneeId"
    });

    logger.debug(`${callerType} Person hasMany ProjectDocument`);
    Person.hasMany(models.ProjectDocument, {
      as: "ProjectDocuments",
      foreignKey: "uploadBy"
    });

    logger.debug(`${callerType} Person hasMany OrganizationAction`);
    Person.hasMany(models.OrganizationAction, {
      as: "OrganizationActions",
      foreignKey: "assigneeId"
    });
  };
  logger.debug(`${callerType} Person end associations`);

  return Person;
};
