"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServiceCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
  return ServiceCategory;
};
