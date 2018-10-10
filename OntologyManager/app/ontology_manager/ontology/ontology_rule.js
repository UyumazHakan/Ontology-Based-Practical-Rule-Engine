import NodeEnum from '../ontology_nodes/ontology_node_enum';
import OntologyNode from '../ontology_nodes/ontology_node';
import uuid from 'uuid/v4';

import {loggers} from 'winston';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
let logger = loggers.get('main');

class OntologyRule {
	constructor(args) {
		this.id = args.id || uuid();
		this.name = args.name;
		this.owner = args.owner;
		this.nodes = [];
		this.sinkNodes = [];
		this.sourceNodes = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args._isUpdated || false;
		if (args.nodes) args.nodes.forEach((node) => this.addNode(node));
	}
	get isUpdated() {
		return this.node.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}
	execute(args) {
		this.sourceNodes.forEach((node) => node.execute(args));
	}
	addNode(args) {
		this._isUpdated = false;
		let newNode =
			args.value instanceof OntologyNode
				? args.value
				: new NodeEnum[args.type](args.value);
		if (args.sink) this.addSinkNode({node: newNode});
		if (args.source) this.addSourceNode({node: newNode});
		this.nodes.push(newNode);
	}
	addSinkNode(args) {
		this._isUpdated = false;
		if (args.node) {
			this.sinkNodes.push(args.node);
			return;
		}
	}
	addSourceNode(args) {
		this._isUpdated = false;
		if (args.node) {
			this.sourceNodes.push(args.node);
			return;
		}
	}
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
				})
				.catch((err) => {
					logger.debug(`Rule saving is failed. ${err}`);
				});
		}
	}
	load(args) {}
}

export default OntologyRule;
