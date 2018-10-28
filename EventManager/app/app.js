import config from 'config';
import {loggers} from 'winston';
import express from 'express';
import bodyParser from 'body-parser';

const logger = loggers.get('main');
const app = express();
app.use(bodyParser.json());

logger.debug('Application configuration is done');

module.exports = app;
