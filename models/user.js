import { Model, DataTypes } from "sequelize";
import { db as sequelize } from "./index.js";

class User extends Model {
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

export default User;
