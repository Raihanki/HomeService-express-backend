"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Service, {
        through: models.ServiceImage,
        as: "services",
        foreignKey: "imageId",
      });
    }
  }
  Image.init(
    {
      url: DataTypes.STRING,
      imagePublicId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
      timestamps: true,
    }
  );
  return Image;
};
