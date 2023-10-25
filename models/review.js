"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.belongsTo(models.Service, {
        foreignKey: "serviceId",
        as: "service",
      });
    }
  }

  Review.init(
    {
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isIn: [[1, 2, 3, 4, 5]],
        },
      },
      comment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      paranoid: true,
      timestamps: true,
    }
  );
  return Review;
};
