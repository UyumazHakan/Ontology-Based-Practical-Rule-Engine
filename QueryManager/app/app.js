import {loggers} from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const logger = loggers.get('main');
const app = express();
app.use(bodyParser.json());
app.use(routes);

logger.debug('Application configuration is done');

module.exports = app;
