import OntologyRule from './ontology_rule';
import uuid from 'uuid/v4';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';

import {loggers} from 'winston';
let logger = loggers.get('main');

class Ontology {
	constructor(args) {
		this.id = args.id || uuid();
		this.name = args.name;
		this.owner = args.owner;
		this.rules = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args._isUpdated || args.isUpdated || false;
		if (args.rules) args.rules.forEach((rule) => this.addRule(rule));
	}
	get isUpdated() {
		return this.rules.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}
	get nodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.nodes), []);
	}
	get sinkNodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.sinkNodes), []);
	}
	get sourceNodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.sourceNodes), []);
	}
	addRule(args) {
		this._isUpdated = false;
		let newRule = args instanceof OntologyRule ? args : new OntologyRule(args);
		this.rules.push(newRule);
	}
	save(args) {
		let saveObject = {
			id: this.id,
			name: this.name,
			owner: this.owner,
			rules: this.rules.map((rule) => rule.id),
		};
		this.rules.forEach((rule) => rule.save());
		if (!this.isSaved) {
			DatabaseConnectorProxy.create({
				index: 'ontology',
				type: 'ontologyType',
				body: saveObject,
			})
				.then((res) => {
					logger.debug(`Ontology saving is successful. ${res}`);
					this.isSaved = true;
					this._isUpdated = true;
				})
				.catch((err) => {
					logger.debug(`Ontology saving is failed. ${err}`);
				});
		}
	}
	load(args) {}
}

export default Ontology;
