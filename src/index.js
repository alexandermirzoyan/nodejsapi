import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import patientRoutes from './route/patient.route.js';
import Response from './domain/response.js';
import logger from './util/logger.js';
import { elasticHealth } from './config/elastic.config.js';

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/patients', patientRoutes);

app.get('/elastic-health', async (_, res) => {
  const elasticResponse = await elasticHealth();
  res.send(elasticResponse);
});

app.get('/', (req, res) => {
  res.send(Response.Ok('Patient API, v1.0.0 - All Systems Go'));
});

app.all('*', (req, res) => {
  res.send(Response.NotFound('Route does not exist on the server'));
});

app.listen(PORT, () => logger.info(`Server is running on ${PORT} port`));
