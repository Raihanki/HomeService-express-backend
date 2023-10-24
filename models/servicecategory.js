import { Model, DataTypes } from "sequelize";
import { db as sequelize } from "./index.js";

class ServiceCategory extends Model {
  static associate(models) {
    this.hasMany(models.Service, {
      foreignKey: "serviceCategoryId",
      as: "services",
    });
  }
}
ServiceCategory.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "ServiceCategory",
    tableName: "service_categories",
    paranoid: true,
    timestamps: true,
  }
);

export default ServiceCategory;
