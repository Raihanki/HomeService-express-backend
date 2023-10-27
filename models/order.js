"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
  Order.init(
    {
      status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
        validate: {
          isIn: [
            [
              "PENDING",
              "ACCEPTED",
              "REQ_ONPROCESS",
              "ONPROCESS",
              "REQ_SUCCESS",
              "SUCCESS",
              "REQ_CANCEL",
              "CANCEL",
            ],
          ],
        },
      },
      isCanceling: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
