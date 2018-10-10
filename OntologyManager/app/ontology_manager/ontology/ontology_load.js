import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import NodeEnum from '../ontology_nodes/ontology_node_enum';
import OntologyRule from './ontology_rule';
import Ontology from './ontology';

import {loggers} from 'winston';
let logger = loggers.get('main');
let nodeCache = {};
let ruleCache = {};
let ontologyCache = {};
export function loadNode(args) {
	if (!args.id) reject('ID not defined in arguments');
	return new Promise((resolve, reject) => {
		if (nodeCache[args.id] !== undefined) {
			logger.debug(`Node ${args.id} is found in cache`);
			resolve(nodeCache[args.id]);
			return;
		}
		DatabaseConnectorProxy.search({
			index: 'node',
			type: 'nodeType',
			query: {
				bool: {
					must: [
						{
							match: {
								id: {
									query: args.id,
									operator: 'and',
								},
							},
						},
					],
				},
			},
		})
			.then((res) => {
				if (res.hits.hits.length === 0) {
					reject('No node is found');
					return;
				}
				let nodeInfo = res.hits.hits[0]._source;
				nodeInfo.isSaved = true;
				nodeInfo._isUpdated = true;
				let node = new NodeEnum[nodeInfo.nodeType](nodeInfo);
				nodeCache[nodeInfo.id] = node;
				Promise.all(nodeInfo.sinks.map((sink) => loadNode({id: sink}))).then(
					(sinks) => {
						sinks.forEach((sink) => node.addSink(sink));
						Promise.all(
							nodeInfo.sources.map((source) => loadNode({id: source}))
						).then((sources) => {
							sources.forEach((source) => node.addSource(source));
							node._isUpdated = true;
							resolve(node);
							return;
						});
					}
				);
			})
			.catch((err) => {
				logger.error(`Node loading is failed. ${err}`);
				reject(err);
			});
	});
}
export function loadRule(args) {
	return new Promise((resolve, reject) => {
		if (!args.id) reject('ID not defined in arguments');
		if (ruleCache[args.id] !== undefined) {
			logger.error(`Rule ${args.id} is found in cache`);
			resolve(ruleCache[args.id]);
			return;
		}
		DatabaseConnectorProxy.search({
			index: 'rule',
			type: 'ruleType',
			query: {
				bool: {
					must: [
						{
							match: {
								id: {
									query: args.id,
									operator: 'and',
								},
							},
						},
					],
				},
			},
		})
			.then((res) => {
				if (res.hits.hits.length === 0) {
					reject('No rule is found');
					return;
				}
				let ruleInfo = res.hits.hits[0]._source;
				ruleInfo.isSaved = true;
				ruleInfo._isUpdated = true;
				let ruleNodes = ruleInfo.nodes;
				delete ruleInfo.nodes;
				let rule = new OntologyRule(ruleInfo);
				ruleCache[ruleInfo.id] = rule;
				Promise.all(ruleNodes.map((node) => loadNode({id: node}))).then(
					(nodes) => {
						nodes.forEach((node) => {
							rule.addNode({
								value: node,
								sink: ruleInfo.sinkNodes.includes(node.id),
								source: ruleInfo.sourceNodes.includes(node.id),
							});
						});
						rule._isUpdated = true;
						resolve(rule);
						return;
					}
				);
			})
			.catch((err) => {
				logger.error(`Rule loading is failed. ${err}`);
				reject(err);
			});
	});
}
export function loadOntology(args) {
	return new Promise((resolve, reject) => {
		if (!args.id) reject('ID not defined in arguments');
		if (ontologyCache[args.id] !== undefined) {
			logger.error(`Ontology ${args.id} is found in cache`);
			resolve(ontologyCache[args.id]);
			return;
		}
		DatabaseConnectorProxy.search({
			index: 'ontology',
			type: 'ontologyType',
			query: {
				bool: {
					must: [
						{
							match: {
								id: {
									query: args.id,
									operator: 'and',
								},
							},
						},
					],
				},
			},
		})
			.then((res) => {
				if (res.hits.hits.length === 0) {
					reject('No ontology is found');
					return;
				}
				let ontologyInfo = res.hits.hits[0]._source;
				ontologyInfo.isSaved = true;
				ontologyInfo._isUpdated = true;
				let ontologyRules = ontologyInfo.rules;
				delete ontologyInfo.rules;
				let ontology = new Ontology(ontologyInfo);
				ontologyCache[ontologyInfo.id] = ontology;
				Promise.all(
					ontologyRules.map((rule) => loadRule({id: rule}))
				).then((rules) => {
					rules.forEach((rule) => {
						ontology.addRule(rule);
					});
					ontology._isUpdated = true;
					resolve(ontology);
					return;
				});
			})
			.catch((err) => {
				logger.error(`Ontology loading is failed. ${err}`);
				reject(err);
			});
	});
}
