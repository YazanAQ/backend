import { DataTypes, QueryInterface } from "sequelize";

import {
  FRIEND_STATUS,
  getIsoTimestamp,
  USER_FRIENDS_TABLE_NAME,
  USERS_TABLE_NAME,
} from "../lib";

module.exports = {
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(USER_FRIENDS_TABLE_NAME);
  },
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(USER_FRIENDS_TABLE_NAME, {
      created_at: {
        allowNull: false,
        comment: "Friend creation DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        comment: "Friend Deletion DateTime",
        defaultValue: null,
        type: DataTypes.DATE,
      },
      friend_id: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          key: "id",
          model: USERS_TABLE_NAME,
        },
        type: DataTypes.UUID,
      },
      status: DataTypes.ENUM(...Object.values(FRIEND_STATUS)),
      updated_at: {
        allowNull: false,
        comment: "Friend last updated DateTime",
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
