import DatabaseConnectorProxy
	from './ontology_manager/database_connector/database_connector_proxy';

import config from 'config';
import {loggers} from 'winston';
import express from 'express';

const logger = loggers.get('main');
const app = express();

const databaseConnector = new DatabaseConnectorProxy();

logger.debug("Application configuration is done");


module.exports = app;
