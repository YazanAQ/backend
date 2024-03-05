import { DataTypes, QueryInterface } from "sequelize";

import { getIsoTimestamp, toLowerCase, USERS_TABLE_NAME } from "../lib";

module.exports = {
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(USERS_TABLE_NAME);
  },
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(USERS_TABLE_NAME, {
      created_at: {
        allowNull: false,
        comment: "User creation DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        comment: "User Deletion DateTime",
        defaultValue: null,
        type: DataTypes.DATE,
      },
      email: {
        allowNull: false,
        comment: "User Email",
        set: toLowerCase("email"),
        type: DataTypes.STRING(32),
        unique: true,
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      image_url: {
        allowNull: true,
        comment: `image url`,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      is_active: {
        allowNull: false,
        comment: "Wheather The User is active or not",
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
      name: {
        allowNull: true,
        comment: `name`,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: false,
      },
      social_media: {
        allowNull: true,
        comment:
          "social media data when the user registered using social media (google)",
        type: DataTypes.JSON,
      },
      updated_at: {
        allowNull: false,
        comment: "User last updated DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
    });
  },
};
