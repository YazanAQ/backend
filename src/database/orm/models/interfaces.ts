import Place from "./place.model";
import SharedPlaces from "./sharePlaces.model";
import User from "./user.model";
import { UserFriends } from "./userFriends.model";

export interface GeoGeniusModels {
  User: User;
  UserFriends: UserFriends;
  Place: Place;
  SharePlaces: SharedPlaces;
}
