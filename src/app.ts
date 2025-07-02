import express from "express";
import RegionRoutes from "./routes/regionRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use("/region", RegionRoutes);

app.use(errorMiddleware);

export default app;
