import { Model, DataTypes } from "sequelize";
import { db as sequelize } from "./index.js";

class Service extends Model {
  static associate(models) {
    this.belongsTo(models.ServiceCategory, {
      foreignKey: "serviceCategoryId",
      as: "serviceCategory",
    });
    this.hasMany(models.Order, {
      foreignKey: "serviceId",
      as: "orders",
    });
    this.hasMany(models.Review, {
      foreignKey: "serviceId",
      as: "reviews",
    });
  }
}

Service.init(
  {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Service",
    tableName: "services",
    paranoid: true,
    timestamps: true,
  }
);

export default Service;
