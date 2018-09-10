const config = require('config');
const logger = require('winston').loggers.get('main');
const express = require('express');
const app = express();

logger.debug("Application configuration is done");

module.exports = app;
