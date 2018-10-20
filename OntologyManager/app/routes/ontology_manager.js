import express from 'express';
import {loggers} from 'winston';
import OntologyNodes from './ontology_nodes';
import OntologyRules from './ontology_rules';

let router = express.Router();
let logger = loggers.get('main');

router.use((req, res, next) => {
	logger.debug(`Ontology Manager Router Received: ${req}`);
	next();
});

router.use('/node', OntologyNodes);
router.use('/rule', OntologyRules);

export default router;
