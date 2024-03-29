import express from 'express';

import {
  deleteElasticIndex,
  getElasticHealth,
  findElastic,
  setElasticIndex,
} from '../controller/elastic.controller.js';

const elasticRoutes = express.Router();

elasticRoutes.route('/health').get(getElasticHealth);
elasticRoutes.route('/index').post(setElasticIndex);
elasticRoutes.route('/index').delete(deleteElasticIndex);
elasticRoutes.route('/find').get(findElastic);

export default elasticRoutes;
