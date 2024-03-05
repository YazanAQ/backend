import { CORS_OPTIONS } from "./constants";
import { ReqWithSharedContextI } from "./interfaces";
import handleOptionsRequest from "./middlewares/handleOptionsRequest";
import sharedContextMiddleware from "./middlewares/sharedContext.middleware";
import routes from "./routes/routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

class App {
  private static _instance: App;
  private _expressApp: Express;

  private constructor() {
    this._expressApp = express();

    // Apply middleware
    this.setupMiddleware();

    // Apply Routes
    this.setupRoutes();
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }

    return App._instance;
  }

  public get expressApp(): Express {
    return this._expressApp;
  }

  private setupMiddleware(): void {
    // Use helmet for security headers
    this.expressApp.use(helmet());

    // Parse JSON bodies
    this.expressApp.use(express.json());

    // Logs the requests
    this.expressApp.use(morgan("tiny"));

    // Parse URL-encoded bodies
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
    this.expressApp.use(cookieParser());

    // Middleware to handle CORS preflight requests
    this.expressApp.use(handleOptionsRequest);

    // Enable CORS
    this.expressApp.use(cors(CORS_OPTIONS));

    this.expressApp.use((req, res, next) =>
      sharedContextMiddleware(
        req as unknown as ReqWithSharedContextI,
        res,
        next
      )
    );

    // Disable server header
    this.expressApp.disable("x-powered-by");
  }

  private setupRoutes(): void {
    // Register routes
    routes.register(this.expressApp);
  }
}

// Exporting the express app instance
export default App.instance.expressApp;
