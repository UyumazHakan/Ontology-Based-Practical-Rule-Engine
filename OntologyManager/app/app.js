import DatabaseConnectorProxy
	from './ontology_manager/database_connector/database_connector_proxy';

const config = require('config');
const logger = require('winston').loggers.get('main');
const express = require('express');
const app = express();

const databaseConnector = new DatabaseConnectorProxy(config.database);

logger.debug("Application configuration is done");


module.exports = app;
