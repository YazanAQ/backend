import Place from "../../database/orm/models/place.model";
import SharedPlaces from "../../database/orm/models/sharePlaces.model";

interface PlaceArgsI {
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  name: string;
  ownerId: string;
}

interface RemovePlaceArgsI {
  id: string;
  ownerId: string;
}

interface PlaceResponseI {
  place: Place;
}

interface RemovePlaceResponseI {
  success: boolean;
}

interface SharePlaceArgs {
  friendIds: string[];
  ownerId: string;
  placeId: string;
}

interface PlaceServiceInterface {
  addPlace(addPlaceArgsI: PlaceArgsI): Promise<PlaceResponseI>;
  fetchPlaces({ ownerId }: { ownerId: string }): Promise<Place[]>;
  removePlace(removePlace: RemovePlaceArgsI): Promise<RemovePlaceResponseI>;
  sharePlace(sharePlaceArgs: SharePlaceArgs): Promise<SharedPlaces[]>;
}

export {
  PlaceArgsI,
  PlaceResponseI,
  PlaceServiceInterface,
  RemovePlaceArgsI,
  RemovePlaceResponseI,
  SharePlaceArgs,
};
