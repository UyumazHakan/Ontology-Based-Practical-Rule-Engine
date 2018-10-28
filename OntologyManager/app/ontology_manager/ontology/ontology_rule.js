import NodeEnum from '../ontology_nodes/ontology_node_enum';
import OntologyNode from '../ontology_nodes/ontology_node';
import uuid from 'uuid/v4';

import {loggers} from 'winston';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import clone from 'clone';
let logger = loggers.get('main');

/**
 * Class representing a rule in ontology
 */
class OntologyRule {
	/**
	 * Creates an ontology rule
	 * @param {Object} args An object contains all arguments
	 * @param {string} args.id Unique id to identify each different rules. Automatically generated if not present
	 * @param {string} args.name Display name for the rule
	 * @param {string} args.owner User Id of the owner. Rule will be public if not presented
	 * @param {boolean} args.isSaved States whether any version of the rule present in th database.
	 * @param {boolean}  args.isUpdated States whether the last version of the rule present in the database
	 * @param {OntologyNode[]} args.nodes List of nodes will be owned by the rule
	 */
	constructor(args) {
		this.id = args.id || uuid();
		this.name = args.name;
		this.owner = args.owner;
		this.nodes = [];
		this.sinkNodes = [];
		this.sourceNodes = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args.isUpdated || false;
		if (args.nodes) args.nodes.forEach((node) => this.addNode(node));
	}

	/**
	 * Returns whether rule and owned nodes are saved with the latest version in database
	 * @return {boolean} Status of the rule and owned rules in database
	 */
	get isUpdated() {
		return this.node.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}

	/**
	 * Execute all source nodes with given arguments
	 * @param {Object} args Arguments to pass execute function of source nodes
	 */
	execute(args) {
		this.sourceNodes.forEach((node) => node.execute(args));
	}

	/**
	 * Add a node to rule
	 * @param {Object} args An object contains all arguments
	 * @param {OntologyNode | Object} args.value The node to be added to rule
	 * @param {string} args.type Enumeration of the node type to be added
	 * @param {boolean} args.sink Specifies whether the node is a sink node
	 * @param {boolean} args.source Specifies whether the node is a source node
	 */
	addNode(args) {
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
	 * Adds a sink node to rule
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
	 * Adds a source node to rule
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
	 * Saves the rule and all its nodes
	 * @param {Object} args An object contains all arguments
	 * @param {function} args.callback Callback function to be called after rule saved
	 */
	save(args) {
		let saveObject = {
			id: this.id,
			name: this.name,
			owner: this.owner,
			nodes: this.nodes.map((node) => node.id),
			sinkNodes: this.sinkNodes.map((node) => node.id),
			sourceNodes: this.sourceNodes.map((node) => node.id),
		};
		this.nodes.forEach((node) => node.saveNode());
		if (!this.isSaved) {
			DatabaseConnectorProxy.create({
				index: 'rule',
				type: 'ruleType',
				body: saveObject,
			})
				.then((res) => {
					logger.debug(`Rule saving is successful. ${res}`);
					this.isSaved = true;
					this._isUpdated = true;
					if (args.callback) args.callback(null, res);
				})
				.catch((err) => {
					logger.debug(`Rule saving is failed. ${err}`);
					if (args.callback) args.callback(err, null);
				});
		}
	}

	/**
	 * Returns clone the rule with minified versions of nodes
	 * @param {any} args Not used currently
	 * @return {OntologyRule} Clone of the rule with node ids instead of OntologyNode
	 */
	minify(args) {
		let rule = clone(this);
		rule.nodes = rule.nodes.map((node) => node.minify());
		rule.sinkNodes = rule.sinkNodes.map((node) => node.minify());
		rule.sourceNodes = rule.sourceNodes.map((node) => node.minify());
		return rule;
	}
}

export default OntologyRule;
