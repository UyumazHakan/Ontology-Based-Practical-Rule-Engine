import express from 'express';
import clone from 'clone';
import {loggers} from 'winston';
import {loadNode} from '../ontology_manager/ontology/ontology_load';
import DatabaseConnectorProxy from '../ontology_manager/database_connector/database_connector_proxy';
import FilterNode from '../ontology_manager/ontology_nodes/manipulation_nodes/filter_node';
import NodeEnum from '../ontology_manager/ontology_nodes/ontology_node_enum';

let router = express.Router();
let logger = loggers.get('main');

router.use((req, res, next) => {
	logger.debug(`Ontology Nodes Router Received: ${req}`);
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

router.post('/', function(req, res) {
	let node = new NodeEnum[req.type](req.info);
	let callback = (err, result) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(node);
	};
	node.saveNode({callback: callback});
});
router.get('/', function(req, res) {
	DatabaseConnectorProxy.search({
		index: 'node',
		type: 'nodeType',
		query: {match_all: {}},
	})
		.then((resp) => {
			let nodes = resp.hits.hits.map((hit) => {
				return {id: hit._source.id, name: hit._source.name};
			});
			res.json(nodes);
		})
		.catch((err) => res.status(500).send(err));
});
router.get('/:node_id', function(req, res) {
	res.json(req.node);
});
router.post('/:node_id/add_sink', function(req, res) {
	loadNode({id: req.sink})
		.then((node) => {
			req._node.addSink(node);
			let callback = () => {
				let callback = () => {
					res.json(req._node);
				};
				node.save({callback: callback});
			};
			req._node.save({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});
router.post('/:node_id/add_source', function(req, res) {
	loadNode({id: req.source})
		.then((node) => {
			req._node.addSource(node);
			let callback = () => {
				let callback = () => {
					res.json(req._node);
				};
				node.save({callback: callback});
			};
			req._node.save({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});

export default router;
