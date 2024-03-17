import {
  AuthServiceInterface,
  BaseServiceArgsI,
  FriendServiceInterface,
  PlaceServiceInterface,
  ServicesI,
} from "../interfaces";
import { AuthService } from "../services";
import { FriendService } from "../services/FriendService";
import { PlaceService } from "../services/PlaceService";

const makeGeoGeniusApiServices = (args: BaseServiceArgsI): ServicesI => {
  const authService: AuthServiceInterface = new AuthService(args);
  const friendService: FriendServiceInterface = new FriendService(args);
  const placeService: PlaceServiceInterface = new PlaceService(args);

  return {
    authService,
    friendService,
    placeService,
  };
};

export default makeGeoGeniusApiServices;
