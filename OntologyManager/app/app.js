import DatabaseConnectorProxy from './ontology_manager/database_connector/database_connector_proxy';
import OntologyManagerRouter from './routes/ontology_manager';
import config from 'config';
import {loggers} from 'winston';
import express from 'express';

const logger = loggers.get('main');
const app = express();

app.use('/manager', OntologyManagerRouter);

logger.debug('Application configuration is done');

module.exports = app;
