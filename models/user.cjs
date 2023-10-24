"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      address: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        len: [8, 50],
      },
      isSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      telp: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 20],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      timestamps: true,
    }
  );
  return User;
};
