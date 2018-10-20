import OntologyRule from './ontology_rule';
import uuid from 'uuid/v4';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';

import {loggers} from 'winston';
let logger = loggers.get('main');

/**
 * Class represents ontology
 */
class Ontology {
	/**
	 * Creates a new ontology
	 * @param {Object} args An object contains all arguments
	 * @param {string} args.id Unique id to identify each different ontologies. Automatically generated if not present
	 * @param {string} args.name Display name for the ontology
	 * @param {string} args.owner User Id of the owner. Ontology will be public if not presented
	 * @param {boolean} args.isSaved States whether any version of the ontology present in th database.
	 * @param {boolean}  args.isUpdated States whether the last version of the ontology present in the database
	 * @param {OntologyRule[]} args.rules List of rules will be owned by the ontology
	 */
	constructor(args) {
		this.id = args.id || uuid();
		this.name = args.name;
		this.owner = args.owner;
		this.rules = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args.isUpdated || false;
		if (args.rules) args.rules.forEach((rule) => this.addRule(rule));
	}
	/**
	 * Returns whether ontology and owned rules are saved with the latest version in database
	 * @return {boolean} Status of the ontology and owned rules in database
	 */
	get isUpdated() {
		return this.rules.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}

	/**
	 * Returns all nodes that belongs to rules of ontology
	 * @return {OntologyNode[]} All nodes that belongs to rules of ontology
	 */
	get nodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.nodes), []);
	}
	/**
	 * Returns all sink nodes that belongs to rules of ontology
	 * @return {OntologyNode[]} All sink nodes that belongs to rules of ontology
	 */
	get sinkNodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.sinkNodes), []);
	}
	/**
	 * Returns all source nodes that belongs to rules of ontology
	 * @return {OntologyNode[]} All source nodes that belongs to rules of ontology
	 */
	get sourceNodes() {
		return this.rules.reduce((acc, cur) => acc.concat(cur.sourceNodes), []);
	}

	/**
	 * Adds a new rule to ontology
	 * @param {OntologyRule | Object} args Rule to be added in ontology
	 */
	addRule(args) {
		this._isUpdated = false;
		let newRule = args instanceof OntologyRule ? args : new OntologyRule(args);
		this.rules.push(newRule);
	}

	/**
	 * Saves ontology and all its rules
	 * @param {Object} args All arguments
	 * @param {function} args.callback Callback function to be called after ontology saved
	 */
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
					if (args.callback) args.callback(err, null);
				})
				.catch((err) => {
					logger.debug(`Ontology saving is failed. ${err}`);
					if (args.callback) args.callback(err, null);
				});
		}
	}
}

export default Ontology;
