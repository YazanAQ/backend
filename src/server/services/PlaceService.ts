import { v4 as uuid } from "uuid";

import { GeoGeniusOrm } from "../../database";
import Place from "../../database/orm/models/place.model";
import SharedPlaces from "../../database/orm/models/sharePlaces.model";
import { BadRequestError } from "../helpers/Errors";
import {
  BaseServiceArgsI,
  PlaceArgsI,
  PlaceResponseI,
  PlaceServiceInterface,
  RemovePlaceArgsI,
  RemovePlaceResponseI,
  SharePlaceArgs,
} from "../interfaces";

/**
 * Service class for managing user Placeships.
 */
export class PlaceService implements PlaceServiceInterface {
  private readonly geoGeniusOrm?: GeoGeniusOrm;

  /**
   * Creates an instance of PlaceService.
   * @param {BaseServiceArgsI} params - Parameters for initializing the service.
   * @param {GeoGeniusOrm} params.geoGeniusOrm - The ORM instance for database operations.
   */
  constructor({ geoGeniusOrm }: BaseServiceArgsI) {
    this.geoGeniusOrm = geoGeniusOrm;
  }

  /**
   * Adds a Place for a user.
   * @param {PlaceArgsI} param0 - Parameters for adding a Place.
   * @returns {Promise<PlaceResponseI>} A promise that resolves to the updated user information.
   */
  public async addPlace({
    address,
    description,
    latitude,
    longitude,
    name,
    ownerId,
  }: PlaceArgsI): Promise<PlaceResponseI> {
    try {
      const placeCreated = await this.geoGeniusOrm?.models.Place.create({
        address,
        description,
        id: uuid(),
        latitude,
        longitude,
        name,
        ownerId,
      });

      return { place: placeCreated?.toJSON() };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Removes a Place for a user.
   * @param {RemovePlaceArgsI} param0 - Parameters for removing a Place.
   * @returns {Promise<RemovePlaceResponseI>} A promise that resolves to the updated user information.
   */
  public async removePlace({
    id,
    ownerId,
  }: RemovePlaceArgsI): Promise<RemovePlaceResponseI> {
    try {
      const count = await this.geoGeniusOrm?.sequelize.models.Place.destroy({
        where: { id, ownerId },
      });

      return { success: !!count };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Shares a Place for a user with friends.
   * @param {SharePlaceArgs} param0 - Parameters for sharing a Place.
   * @returns {Promise<SharedPlaces[]>} A promise that resolves to the updated user information.
   */
  public async sharePlace({
    friendIds,
    ownerId,
    placeId,
  }: SharePlaceArgs): Promise<SharedPlaces[]> {
    try {
      const placeExist =
        await this.geoGeniusOrm?.sequelize.models.Place.findOne({
          where: {
            id: placeId,
          },
        });

      if (!placeExist) {
        throw new BadRequestError(`Place with id=${placeId} does not exist.`);
      }

      const sharedPlacesPayload = friendIds.map((userId: string) => ({
        ownerId,
        placeId,
        userId,
      }));

      const result =
        await this.geoGeniusOrm?.sequelize.models.SharedPlaces.bulkCreate(
          sharedPlacesPayload
        );

      return result as SharedPlaces[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches places belonging to a user.
   * @param {string} ownerId - ID of the owner/user.
   * @returns {Promise<Place[]>} A promise that resolves to an array of places.
   */
  public async fetchPlaces({ ownerId }: { ownerId: string }): Promise<Place[]> {
    try {
      const places = await this.geoGeniusOrm?.sequelize.models.Place.findAll({
        include: [
          {
            as: "sharedWith",
            include: [
              {
                as: "user",
                attributes: {
                  exclude: ["password", "socialMedia", "deletedAt", "isActive"],
                },
                model: this.geoGeniusOrm.sequelize.models.User,
              },
            ],
            model: this.geoGeniusOrm.sequelize.models.SharedPlaces,
          },
        ],
        where: { ownerId },
      });

      return places as Place[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
