import express from 'express';

import { getElasticHealth } from '../controller/elastic.controller.js';

const elasticRoutes = express.Router();

elasticRoutes.route('/health').get(getElasticHealth);

export default elasticRoutes;
