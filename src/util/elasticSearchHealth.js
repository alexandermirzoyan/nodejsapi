import { esClient } from '../config/elasticSearch.config.js';

export const elasticSearchHealth = async () => {
  try {
    return await esClient.cluster.health({});
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
}
