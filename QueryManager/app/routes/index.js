import express from 'express';
import {loggers} from 'winston';
import {stringify} from '../utils';
import {parse as parseIoTeQL} from '../ioteql';
import QueryManager from '../query_manager';

let router = express.Router();
let logger = loggers.get('main');

router.use((req, res, next) => {
	logger.debug(`Query Manager Router Received: ${stringify(req)}`);
	next();
});
router.use(function(req, res, next) {
	req.setEncoding('utf8');
	req.rawBody = '';
	req.on('data', function(chunk) {
		req.rawBody += chunk;
	});
	req.on('end', function() {
		next();
	});
});
router.use(function(req, res, next) {
	req.body = parseIoTeQL(req.rawBody);
	next();
});
router.post('/', function(req, res) {
	res.json(QueryManager.execute(req.body));
});

export default router;
