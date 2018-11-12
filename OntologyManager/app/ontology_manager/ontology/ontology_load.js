import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import NodeEnum from '../ontology_nodes/ontology_node_enum';
import OntologyFlow from './ontology_flow';
import Ontology from './ontology';

import {loggers} from 'winston';
let logger = loggers.get('main');
let nodeCache = {};
let flowCache = {};
let ontologyCache = {};

/**
 * Loads a node from database or cache
 * @param {Object} args All arguments
 * @param {string} args.id Id of node to be loaded
 * @return {Promise<OntologyNode>} Resolves node
 */
export function loadNode(args) {
	return new Promise((resolve, reject) => {
		if (!args.id) reject('ID not defined in arguments');
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
/**
 * Loads a flow and its nodes from database or cache
 * @param {Object} args All arguments
 * @param {string} args.id Id of flow to be loaded
 * @return {Promise<any>} Resolves flow
 */
export function loadFlow(args) {
	return new Promise((resolve, reject) => {
		if (!args.id) reject('ID not defined in arguments');
		if (flowCache[args.id] !== undefined) {
			logger.error(`Flow ${args.id} is found in cache`);
			resolve(flowCache[args.id]);
			return;
		}
		DatabaseConnectorProxy.search({
			index: 'flow',
			type: 'flowType',
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
					reject('No flow is found');
					return;
				}
				let flowInfo = res.hits.hits[0]._source;
				flowInfo.isSaved = true;
				flowInfo._isUpdated = true;
				let flowNodes = flowInfo.nodes;
				delete flowInfo.nodes;
				let flow = new OntologyFlow(flowInfo);
				flowCache[flowInfo.id] = flow;
				Promise.all(flowNodes.map((node) => loadNode({id: node}))).then(
					(nodes) => {
						nodes.forEach((node) => {
							flow.addNode({
								info: node,
								sink: flowInfo.sinkNodes.includes(node.id),
								source: flowInfo.sourceNodes.includes(node.id),
							});
						});
						flow._isUpdated = true;
						resolve(flow);
						return;
					}
				);
			})
			.catch((err) => {
				logger.error(`Flow loading is failed. ${err}`);
				reject(err);
			});
	});
}
/**
 * Loads a ontology and its flows from database or cache
 * @param {Object} args All arguments
 * @param {string} args.id Id of ontology to be loaded
 * @return {Promise<any>} Resolves ontology
 */
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
				let ontologyFlows = ontologyInfo.flows;
				delete ontologyInfo.flows;
				let ontology = new Ontology(ontologyInfo);
				ontologyCache[ontologyInfo.id] = ontology;
				Promise.all(ontologyFlows.map((flow) => loadFlow({id: flow}))).then(
					(flows) => {
						flows.forEach((rule) => {
							ontology.addFlow(rule);
						});
						ontology._isUpdated = true;
						resolve(ontology);
						return;
					}
				);
			})
			.catch((err) => {
				logger.error(`Ontology loading is failed. ${err}`);
				reject(err);
			});
	});
}
