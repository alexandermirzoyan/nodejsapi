import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

export const esClient = new Client({
  node: process.env.ES_HOST,
  auth: {
    username: process.env.ES_USER,
    password: process.env.ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
