import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("users", "device_id");
  },
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("users", "device_id", {
      allowNull: true,
      type: DataTypes.STRING,
    });
  },
};
