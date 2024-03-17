"use strict";

import { DataTypes, QueryInterface } from "sequelize";

import { getIsoTimestamp, PLACE_TABLE_NAME, USERS_TABLE_NAME } from "../lib";

module.exports = {
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint(PLACE_TABLE_NAME, "fk_user_place");
    await queryInterface.dropTable(PLACE_TABLE_NAME);
  },
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(PLACE_TABLE_NAME, {
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        comment: "Place Creation DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      latitude: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      longitude: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      owner_id: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          key: "id",
          model: USERS_TABLE_NAME,
        },
        type: DataTypes.UUID,
      },
      updated_at: {
        allowNull: false,
        comment: "Place Deletion DateTime",
        defaultValue: getIsoTimestamp,
        type: DataTypes.DATE,
      },
    });

    await queryInterface.addConstraint(PLACE_TABLE_NAME, {
      fields: ["owner_id"],
      name: "fk_user_place",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: {
        field: "id",
        table: USERS_TABLE_NAME,
      },
      type: "foreign key",
    });
  },
};
