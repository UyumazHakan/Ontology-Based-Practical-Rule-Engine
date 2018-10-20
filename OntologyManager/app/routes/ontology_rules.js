import express from 'express';
import {loggers} from 'winston';
import {loadNode} from '../ontology_manager/ontology/ontology_load';
import clone from 'clone';
import NodeEnum from '../ontology_manager/ontology_nodes/ontology_node_enum';
import DatabaseConnectorProxy from '../ontology_manager/database_connector/database_connector_proxy';
import OntologyRule from '../ontology_manager/ontology/ontology_rule';

let router = express.Router();
let logger = loggers.get('main');

router.use((req, res, next) => {
	logger.debug(`Ontology Rules Router Received: ${req}`);
	next();
});

router.param('node_id', function(req, res, next, id) {
	loadNode({id: id})
		.then((node) => {
			req._node = node;
			node = clone(node);
			node.sinks = node.sinks.map((sink) => sink.id);
			node.sources = node.sources.map((source) => source.id);
			req.node = node;
			next();
		})
		.catch((err) => {
			next(err);
		});
});

router.param('rule_id', function(req, res, next, id) {
	loadRule({id: id})
		.then((rule) => {
			req._rule = rule;
			req.rule = rule.minify();
			next();
		})
		.catch((err) => {
			next(err);
		});
});

router.post('/', function(req, res) {
	let rule = new OntologyRule(req.info);
	let callback = (err, result) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(rule);
	};
	rule.save({callback: callback});
});
router.get('/', function(req, res) {
	DatabaseConnectorProxy.search({
		index: 'rule',
		type: 'ruleType',
		query: {match_all: {}},
	})
		.then((resp) => {
			let rules = resp.hits.hits.map((hit) => {
				return {id: hit._source.id, name: hit._source.name};
			});
			res.json(rules);
		})
		.catch((err) => res.status(500).send(err));
});
router.get('/:rule_id', function(req, res) {
	res.json(req.rule);
});
router.post(':rule_id/node/:node_id', function(req, res) {
	req._rule.addNode(req._node);
	let callback = () => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(req._rule.minify());
	};
	req._rule.save({callback: callback});
});
router.post(':rule_id/sink_node/:node_id', function(req, res) {
	req._rule.addSinkNode(req._node);
	let callback = () => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(req._rule.minify());
	};
	req._rule.save({callback: callback});
});
router.post(':rule_id/source_node/:node_id', function(req, res) {
	req._rule.addSourceNode(req._node);
	let callback = () => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(req._rule.minify());
	};
	req._rule.save({callback: callback});
});

export default router;
