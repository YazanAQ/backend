import {
  AuthServiceInterface,
  BaseServiceArgsI,
  ServicesI,
} from "../interfaces";
import { AuthService } from "../services";

const makeGeoGeniusApiServices = (args: BaseServiceArgsI): ServicesI => {
  const authService: AuthServiceInterface = new AuthService(args);

  return {
    authService,
  };
};

export default makeGeoGeniusApiServices;
