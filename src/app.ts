import express from 'express';
import RegionRoutes from './routes/regionRutes'

const app = express();

app.use(express.json());


app.use('/region', RegionRoutes)



export default app;
