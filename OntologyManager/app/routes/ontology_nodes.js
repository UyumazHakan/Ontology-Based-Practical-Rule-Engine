import express from 'express';
import clone from 'clone';
import {loggers} from 'winston';
import {loadNode} from '../ontology_manager/ontology/ontology_load';
import {stringify} from '../utils';
import DatabaseConnectorProxy from '../ontology_manager/database_connector/database_connector_proxy';
import NodeEnum from '../ontology_manager/ontology_nodes/ontology_node_enum';

let router = express.Router();
let logger = loggers.get('main');

router.use((req, res, next) => {
	logger.debug(`Ontology Nodes Router Received: ${stringify(req)}`);
	next();
});
router.param('node_id', function(req, res, next, id) {
	loadNode({id: id})
		.then((node) => {
			req._node = node;
			node = clone(node);
			req.node = node;
			next();
		})
		.catch((err) => {
			next(err);
		});
});

router.post('/', function(req, res) {
	const type = req.body.type;
	let node = new NodeEnum[type](req.body.info);
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
	res.json(req.node.minify());
});
router.post('/:node_id/add_sink', function(req, res) {
	loadNode({id: req.body.sink})
		.then((node) => {
			req._node.addSink(node);
			let callback = (err, sourceResult) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				let callback = (err, sinkResult) => {
					if (err) {
						res.status(500).send(err);
						return;
					}
					res.json({source: sourceResult.minify(), sink: sinkResult.minify()});
				};
				node.saveNode({callback: callback});
			};
			req._node.saveNode({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});
router.post('/:node_id/remove_sink', function(req, res) {
	loadNode({id: req.body.sink})
		.then((node) => {
			req._node.removeSink(node);
			let callback = (err, sourceResult) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				let callback = (err, sinkResult) => {
					if (err) {
						res.status(500).send(err);
						return;
					}
					res.json({source: sourceResult.minify(), sink: sinkResult.minify()});
				};
				node.saveNode({callback: callback});
			};
			req._node.saveNode({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});
router.post('/:node_id/add_source', function(req, res) {
	loadNode({id: req.body.source})
		.then((node) => {
			req._node.addSource(node);
			let callback = (err, sinkResult) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				let callback = (err, sourceResult) => {
					if (err) {
						res.status(500).send(err);
						return;
					}
					res.json({source: sourceResult.minify(), sink: sinkResult.minify()});
				};
				node.saveNode({callback: callback});
			};
			req._node.saveNode({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});
router.post('/:node_id/remove_source', function(req, res) {
	loadNode({id: req.body.source})
		.then((node) => {
			req._node.removeSource(node);
			let callback = (err, sinkResult) => {
				if (err) {
					res.status(500).send(err);
					return;
				}
				let callback = (err, sourceResult) => {
					if (err) {
						res.status(500).send(err);
						return;
					}
					res.json({source: sourceResult.minify(), sink: sinkResult.minify()});
				};
				node.saveNode({callback: callback});
			};
			req._node.saveNode({callback: callback});
		})
		.catch((err) => res.status(500).send(err));
});

export default router;
