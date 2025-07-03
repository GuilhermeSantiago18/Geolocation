import express from "express";
import RegionRoutes from "./routes/regionRoutes";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import YAML from "yamljs";
import { OpenAPIV3 } from "openapi-types";
import i18nextMiddleware from "i18next-http-middleware";
import i18n from "./i18n";

const swaggerDocument = YAML.load(
  "./src/docs/swagger.yaml",
) as OpenAPIV3.Document;

const app = express();

app.use(express.json());

app.use(i18nextMiddleware.handle(i18n));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/region", RegionRoutes);

app.use(errorMiddleware);

export default app;
