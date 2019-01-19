import {loggers} from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';

const logger = loggers.get('main');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);

logger.debug('Application configuration is done');

module.exports = app;
