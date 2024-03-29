import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import logger from "../util/logger.js";

dotenv.config();

export const elasticConnector = new Client({
  node: process.env.ES_HOST,
  auth: {
    username: process.env.ES_USER,
    password: process.env.ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const elasticTestConnection = (client) => {
  client.info()
    .then((response) => logger.info(response))
    .catch((error) => logger.error(error));
};

export const elasticHealth = async () => {
  try {
    return await elasticConnector.cluster.health({});
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
}
