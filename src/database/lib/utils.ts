// Import necessary types and modules
import { DateInput } from "./types";
import { QueryInterface, WhereOptions } from "sequelize";
import { Model, Sequelize } from "sequelize-typescript";

// Import the interface for ORM options
import { IOrmOptions } from "../orm/";

// Function to get ISO timestamp from a Date object or current date if not provided
export const getIsoTimestamp = (date?: DateInput): string => {
  if (date) {
    return new Date(date).toISOString();
  }

  return new Date().toISOString();
};

// Function to convert the stored value in a model column to a Date object
export const getDate = (column: string): (() => Date) =>
  function (this: Model) {
    return new Date(this.getDataValue(column));
  };

// Function to set the value of a model column to ISO timestamp of a Date object
export const setDate = (column: string): ((val: DateInput) => void) =>
  function (this: Model, val: DateInput) {
    return this.setDataValue(column, getIsoTimestamp(val));
  };

// Function to set the value of a model column to lowercase of the provided string
export const toLowerCase = (column: string): ((val: string) => void) =>
  function (this: Model, val: string) {
    return this.setDataValue(column, val.toLowerCase());
  };

// Function to get the schema name from the Sequelize QueryInterface
export const getSchema = (queryInterface: QueryInterface): string => {
  // Get the Sequelize instance and options from the QueryInterface
  const sequelize = queryInterface.sequelize as Sequelize;
  const options = sequelize.options as IOrmOptions;

  // Return the schema name from options
  return options.schema as string;
};

/**
 * Update or create a record in the database.
 * @param {ModelCtor} model - The Sequelize model for the entity.
 * @param {object} where - The condition to find the record.
 * @param {object} newItem - The data to be updated or created.
 * @returns {Promise<Partial<any>>} The updated or created record.
 */
export const updateOrCreate = async (
  model,
  where: WhereOptions,
  newItem: any
): Promise<Partial<any>> => {
  // First try to find the record
  const foundItem = await model.findOne({ where });

  if (!foundItem) {
    // Item not found, create a new one
    return model.create(newItem);
  } else {
    await model.update(newItem, { where });

    return await model.findOne({ where });
  }
};
