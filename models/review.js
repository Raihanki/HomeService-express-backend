import { Model, DataTypes } from "sequelize";

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
      type: Sequelize.INTEGER,
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

export default Review;
