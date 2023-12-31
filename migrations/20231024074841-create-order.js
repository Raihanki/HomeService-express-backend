"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      serviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "services",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      status: {
        type: Sequelize.STRING,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
