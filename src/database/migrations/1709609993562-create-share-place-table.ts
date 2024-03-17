import { DataTypes, QueryInterface } from "sequelize";

import {
  getIsoTimestamp,
  PLACE_TABLE_NAME,
  SHARE_PLACES_TABLE_NAME,
  USERS_TABLE_NAME,
} from "../lib";

module.exports = {
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(SHARE_PLACES_TABLE_NAME);
  },
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(SHARE_PLACES_TABLE_NAME, {
      created_at: {
        allowNull: false,
        comment: "Share Place creation DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
      place_id: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          key: "id",
          model: PLACE_TABLE_NAME,
        },
        type: DataTypes.UUID,
      },
      updated_at: {
        allowNull: false,
        comment: "Share Place last updated DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
      user_id: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          key: "id",
          model: USERS_TABLE_NAME,
        },
        type: DataTypes.UUID,
      },
    });
  },
};
