import express from "express";
import RegionRoutes from "./routes/regionRoutes";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import YAML from "yamljs";
import { OpenAPIV3 } from "openapi-types";

const app = express();

app.use(express.json());

const swaggerDocument = YAML.load(
  "./src/docs/swagger.yaml",
) as OpenAPIV3.Document;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/region", RegionRoutes);

app.use(errorMiddleware);

export default app;
