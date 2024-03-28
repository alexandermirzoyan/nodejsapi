import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/patient.query.js';

export const getPatients = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patients`);

  database.query(QUERY.SELECT_PATIENTS, (error, results) => {
    if (!results) {
      res.send(Response.Ok('No patients found'));
      return;
    }

    res.send(Response.Ok('Patients retrieved', { patients: results }));
  });
};

export const createPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating patient`);

  database.query(QUERY.CREATE_PATIENT_PROCEDURE, Object.values(req.body), (error, results) => {
    if (!results) {
      logger.error(error.message);

      res.send(Response.InternalServerError('Error occurred'));
      return;
    }

    // const patient = { id: results.insertedId, ...req.body, created_at: new Date() };
    const patient = results[0][0];
    res.send(Response.Created('Patient created', { patient }));
  });
};

export const getPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patient`);

  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.send(Response.NotFound(`Patient by id ${req.params.id} was not found`));
      return;
    }

    res.send(Response.Ok('Patient retrieved', results[0]));
  });
};

export const updatePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, updating patient`);

  database.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
    if (!error) {
      res.send(Response.Ok('Patient updated', { id: req.params.id, ...req.body }));
      return;
    }

    logger.error(error.message);
    res.send(Response.InternalServerError('Error occurred'));
  });
};

export const deletePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting patient`);

  database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.send(Response.Ok('Patient deleted', results[0]));
      return;
    }

    res.send(Response.NotFound(`Patient by id ${req.params.id} was not found`));
  });
};
