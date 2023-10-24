"use strict";
const { Model } = require("sequelize");
const ServiceCategory = require("./servicecategory.cjs");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ServiceCategory, {
        foreignKey: "serviceCategoryId",
        as: "serviceCategory",
      });
      this.hasMany(models.Order, {
        foreignKey: "serviceId",
        as: "orders",
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
  return Service;
};