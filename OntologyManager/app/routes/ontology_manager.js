import express from 'express';
import {loggers} from 'winston';
import OntologyNodeRoutes from './ontology_nodes';
import OntologyRuleRoutes from './ontology_rules';
import Ontology from '../ontology_manager/ontology/ontology';
import {stringify} from '../utils';

let managerRouter = express.Router();
let ontologyRoutes = express.Router();
let logger = loggers.get('main');

managerRouter.use((req, res, next) => {
	logger.debug(`Ontology Manager Router Received: ${stringify(req.body)}`);
	next();
});

ontologyRoutes.post('/', function(req, res) {
	let ontology = new Ontology(req.body.info);
	let callback = (err, result) => {
		if (err) {
			res.status(500).send(stringify(err));
			return;
		}
		res.send(stringify(ontology.minify()));
	};
	ontology.save({callback: callback});
});

managerRouter.use('/node', OntologyNodeRoutes);
managerRouter.use('/rule', OntologyRuleRoutes);
managerRouter.use('/ontology', ontologyRoutes);

export default managerRouter;
