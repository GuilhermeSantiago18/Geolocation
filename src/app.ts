import express from 'express';
import RegionRoutes from './routes/regionRoutes'

const app = express();

app.use(express.json());


app.use('/region', RegionRoutes)



export default app;
