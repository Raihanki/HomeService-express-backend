import { Model, DataTypes } from "sequelize";
import { db as sequelize } from "./index.js";

class Order extends Model {
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
        isIn: [["PENDING", "SUCCESS", "CANCEL"]],
      },
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
);

export default Order;
