import { AbstractGeoGeniusOrm } from "./AbstractGeoGeniusOrm";
import { IOrmOptions } from "./interfaces";

export class GeoGeniusOrm extends AbstractGeoGeniusOrm<any> {
  constructor(options: IOrmOptions) {
    super({
      ...options,
      modelMatch: (filename, member) =>
        filename.substring(0, filename.indexOf(".model")) ===
        member.toLowerCase(),
      models: [
        __dirname + "/models/*.model.ts",
        __dirname + "/models/*.model.js",
      ],
    });
  }
}
