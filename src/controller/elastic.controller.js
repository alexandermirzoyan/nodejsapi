import { elasticHealth } from '../config/elastic.config.js';

export const getElasticHealth = async (req, res) => {
  const elasticResponse = await elasticHealth();
  res.send(elasticResponse);
}
