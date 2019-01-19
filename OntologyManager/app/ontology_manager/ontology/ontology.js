import OntologyFlow from './ontology_flow';
import uuid from 'uuid/v4';
import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';

import {loggers} from 'winston';
import clone from 'clone';
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
	 * @param {OntologyFlow[]} args.flows List of flows will be owned by the ontology
	 */
	constructor(args) {
		this.id = args.id || uuid();
		this.name = args.name;
		this.owner = args.owner;
		this.flows = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args.isUpdated || false;
		if (args.flows) args.flows.forEach((flow) => this.addFlow(flow.info));
	}
	/**
	 * Returns whether ontology and owned flows are saved with the latest version in database
	 * @return {boolean} Status of the ontology and owned flows in database
	 */
	get isUpdated() {
		return this.flows.reduce(
			(acc, cur) => acc && cur.isUpdated,
			this._isUpdated
		);
	}

	/**
	 * Returns all nodes that belongs to flows of ontology
	 * @return {OntologyNode[]} All nodes that belongs to flows of ontology
	 */
	get nodes() {
		return this.flows.reduce((acc, cur) => acc.concat(cur.nodes), []);
	}
	/**
	 * Returns all sink nodes that belongs to flows of ontology
	 * @return {OntologyNode[]} All sink nodes that belongs to flows of ontology
	 */
	get sinkNodes() {
		return this.flows.reduce((acc, cur) => acc.concat(cur.sinkNodes), []);
	}
	/**
	 * Returns all source nodes that belongs to flows of ontology
	 * @return {OntologyNode[]} All source nodes that belongs to flows of ontology
	 */
	get sourceNodes() {
		return this.flows.reduce((acc, cur) => acc.concat(cur.sourceNodes), []);
	}

	/**
	 * Adds a new flow to ontology
	 * @param {OntologyFlow | Object} args Flow to be added in ontology
	 */
	addFlow(args) {
		args.ontologyID = this.name;
		this._isUpdated = false;
		let newFlow = args instanceof OntologyFlow ? args : new OntologyFlow(args);
		this.flows.push(newFlow);
	}

	/**
	 * Saves ontology and all its flows
	 * @param {Object} args All arguments
	 * @param {function} args.callback Callback function to be called after ontology saved
	 */
	save(args) {
		let saveObject = {
			id: this.id,
			name: this.name,
			owner: this.owner,
			flows: this.flows.map((flow) => flow.id),
		};
		this.flows.forEach((flow) => flow.save());
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
					if (args.callback) args.callback(null, res);
				})
				.catch((err) => {
					logger.debug(`Ontology saving is failed. ${err}`);
					if (args.callback) args.callback(err, null);
				});
		}
	}
	/**
	 * Returns clone the ontology with minified versions of flows
	 * @param {any} args Not used currently
	 * @return {Ontology} Clone of the ontology with minified flows
	 */
	minify(args) {
		let ontology = clone(this);
		ontology.flows = ontology.flows.map((flow) => flow.minify());
		return ontology;
	}
}

export default Ontology;
