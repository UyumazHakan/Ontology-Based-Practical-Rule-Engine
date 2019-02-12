import NodeEnum from '../ontology_nodes/ontology_node_enum';
import OntologyNode from '../ontology_nodes/ontology_node';
import uuid from 'uuid/v4';
import FlowCachingStrategyEnum from './caching_strategy/flow_caching_strategy_enum';
import {loggers} from 'winston';
import {stringify} from '../../utils';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import clone from 'clone';
let logger = loggers.get('main');

/**
 * Class representing a flow in ontology
 */
class OntologyFlow {
	/**
	 * Creates an ontology flow
	 * @param {Object} args An object contains all arguments
	 * @param {string} args.id Unique id to identify each different flows. Automatically generated if not present
	 * @param {string} args.name Display name for the flow
	 * @param {string} args.ontologyID ID of ontology
	 * @param {string} args.owner User Id of the owner. Flow will be public if not presented
	 * @param {boolean} args.isSaved States whether any version of the flow present in th database.
	 * @param {boolean}  args.isUpdated States whether the last version of the flow present in the database
	 * @param {OntologyNode[]} [args.nodes] List of nodes will be owned by the flow
	 * @param {{source, sinks}[]} [args.paths] Specifies sinks and source for each node
	 * @paran {{name: string, info: Object}} [args.cacheStrategy] Specify cache strategy to be used
	 */
	constructor(args) {
		this.updateFields(args);
	}

	updateFields(args) {
		this.id = args.id || this.id || uuid();
		this.name = args.name || this.name;
		this.owner = args.owner || this.owner;
		this.ontologyID = args.ontologyID || this.ontologyID;
		this.nodes = this.nodes || [];
		this.sinkNodes = this.sinkNodes || [];
		this.sourceNodes = this.sourceNodes || [];
		this.isSaved = args.isSaved || this.isSaved || false;
		this._isUpdated = false;
		if (args.nodes) {
			this.nodes.forEach((node) => node.dispose());
			this.nodes.splice(0, this.nodes.length);
			this.sinkNodes.splice(0, this.sinkNodes.length);
			this.sourceNodes.splice(0, this.sourceNodes.length);
			args.nodes.forEach((node) => this.addNode(node));
		}
		if (args.paths) args.paths.forEach((path) => this.addPath(path));
		if (args.cacheStrategy || args._cacheStrategy || this.cacheStrategy) {
			this.cacheStrategy =
				args.cacheStrategy || args._cacheStrategy || this.cacheStrategy;
		}
	}

	/**
	 * Returns whether flow and owned nodes are saved with the latest version in database
	 * @return {boolean} Status of the flow and owned nodes in database
	 */
	get isUpdated() {
		return this.node.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}

	/**
	 * Sets caching strategy
	 * @param {Object} strategy Flow caching strategy to set for the flow
	 */
	set cacheStrategy(strategy) {
		logger.debug(`cacheStrategy(${JSON.stringify(strategy)})`);
		this._cacheStrategy = new FlowCachingStrategyEnum[strategy.type](
			strategy.info
		);
		this.sourceNodes.forEach((sourceNode) => {
			sourceNode.cache = {
				cacheStrategy: this._cacheStrategy,
				sinks: this.sinkNodes,
			};
		});
	}
	addPath(path) {
		const source = this.nodes.find((node) =>
			Object.keys(path.source).reduce(
				(acc, key) => acc && path.source[key] === node[key],
				true
			)
		);
		const sinks = path.sinks.map((sink) =>
			this.nodes.find((node) =>
				Object.keys(sink).reduce(
					(acc, key) => acc && sink[key] === node[key],
					true
				)
			)
		);
		sinks.forEach((sink) => sink.addSource(source));
	}
	/**
	 * Execute all source nodes with given arguments
	 * @param {Object} args Arguments to pass execute function of source nodes
	 */
	execute(args) {
		this.sourceNodes.forEach((node) => node.execute(args));
	}

	/**
	 * Add a node to flow
	 * @param {Object} args An object contains all arguments
	 * @param {OntologyNode | Object} args.value The node to be added to flow
	 * @param {string} args.type Enumeration of the node type to be added
	 * @param {boolean} args.sink Specifies whether the node is a sink node
	 * @param {boolean} args.source Specifies whether the node is a source node
	 */
	addNode(args) {
		args.info.ontologyID = this.ontologyID;
		this._isUpdated = false;
		let newNode =
			args.info instanceof OntologyNode
				? args.info
				: new NodeEnum[args.type](args.info);
		if (args.sink) this.addSinkNode({node: newNode});
		if (args.source) this.addSourceNode({node: newNode});
		this.nodes.push(newNode);
	}

	/**
	 * Adds a sink node to flow
	 * @param {Object} args An object contains all arguments
	 * @param {OntologyNode} args.node The node to be added as sink node
	 */
	addSinkNode(args) {
		this._isUpdated = false;
		if (args.node) {
			this.sinkNodes.push(args.node);
			return;
		}
	}
	/**
	 * Adds a source node to flow
	 * @param {Object} args An object contains all arguments
	 * @param {OntologyNode} args.node The node to be added as source node
	 */
	addSourceNode(args) {
		this._isUpdated = false;
		if (args.node) {
			this.sourceNodes.push(args.node);
			return;
		}
	}
	/**
	 * Saves the flow and all its nodes
	 * @param {Object} args An object contains all arguments
	 * @param {function} args.callback Callback function to be called after flow saved
	 */
	save(args) {
		if (!args) args = {};
		let saveObject = this.minify();
		saveObject.nodes = this.nodes.map((node) => node.id);
		saveObject.sinkNodes = this.sinkNodes.map((node) => node.id);
		saveObject.sourceNodes = this.sourceNodes.map((node) => node.id);
		this.nodes.forEach((node) => node.saveNode());
		if (!this.isSaved) {
			DatabaseConnectorProxy.create({
				index: 'flow',
				type: 'flowType',
				body: saveObject,
			})
				.then((res) => {
					logger.debug(`Flow saving is successful. ${stringify(res)}`);
					this.isSaved = true;
					this._isUpdated = true;
					if (args.callback) args.callback(null, res);
				})
				.catch((err) => {
					logger.debug(`Flow saving is failed. ${stringify(err)}`);
					if (args && args.callback) args.callback(err, null);
				});
		} else if (!this._isUpdated) {
			DatabaseConnectorProxy.update({
				index: 'flow',
				type: 'flowType',
				body: saveObject,
				id: this.id,
			})
				.then((res) => {
					logger.debug(`Flow updating is successful. ${stringify(res)}`);
					this.isSaved = true;
					this._isUpdated = true;
					if (args.callback) args.callback(null, res);
				})
				.catch((err) => {
					logger.debug(`Flow updating is failed. ${stringify(err)}`);
					if (args.callback) args.callback(err, null);
				});
		}
	}

	/**
	 * Returns clone the flow with minified versions of nodes
	 * @param {any} args Not used currently
	 * @return {OntologyFlow} Clone of the flow with node ids instead of OntologyNode
	 */
	minify(args) {
		let flow = clone(this);
		flow.nodes = flow.nodes.map((node) => node.minify());
		flow.sinkNodes = flow.sinkNodes.map((node) => node.minify());
		flow.sourceNodes = flow.sourceNodes.map((node) => node.minify());
		if (flow._cacheStrategy) flow._cacheStrategy = flow._cacheStrategy.minify();
		return flow;
	}
}

export default OntologyFlow;
