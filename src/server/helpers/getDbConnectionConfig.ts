import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import { config } from "../config";

expand(dotenv.config());

const getDbConnectionConfig = () => {
  const newSequelizeConfig = { ...config[process.env.NODE_ENV!] };

  return newSequelizeConfig;
};

export default getDbConnectionConfig;
