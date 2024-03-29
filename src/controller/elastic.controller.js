import util from 'util';
import { elasticConnector, elasticHealth } from '../config/elastic.config.js';
import database from '../config/mysql.config.js';
import QUERY from "../query/patient.query.js";

// node native promisify
const query = util.promisify(database.query).bind(database);

const ELASTIC_INDEX = 'patients_index';

export const getElasticHealth = async (req, res) => {
  const elasticResponse = await elasticHealth();
  res.send(elasticResponse);
}

export const setElasticIndex = async (_, res) => {
  const patientsDataset = await query(QUERY.SELECT_PATIENTS);
  await elasticConnector.indices.create({ index: ELASTIC_INDEX });
  const operations = patientsDataset.flatMap((patient) => [{ index: { _index: ELASTIC_INDEX } }, patient]);
  const bulkResponse = await elasticConnector.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];

      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });

    console.log('erroredDocuments :: ', erroredDocuments);
  }

  const count = await elasticConnector.count({ index: ELASTIC_INDEX });

  res.send(count);
};

export const deleteElasticIndex = async (_, res) => {
  await elasticConnector.indices.delete({ index: ELASTIC_INDEX });
  res.send('Removed');
};

export const findElastic = async (req, res) => {
  const searchTerm = req.query.search;

  const result = await elasticConnector.search({
    index: ELASTIC_INDEX,
    query: {
      fuzzy: {
        first_name: {
          value: searchTerm,
          fuzziness: 'AUTO',
        },
      },
      /*multi_match: {
        query: searchTerm,
        fields: ["first_name", "last_name"],
        fuzziness: 'AUTO',
      },*/
    },
  });

  res.send(result.hits.hits);
};
