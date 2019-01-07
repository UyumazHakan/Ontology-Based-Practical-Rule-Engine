import QueryInterpreter from './query_interpreter';
import config from 'config';
import {stringify} from '../utils';
/**
 * Class for creating ontology json objects to be sent to ontology manager
 */
class OntologyQueryInterpreter extends QueryInterpreter {
	get httpUrl() {
		return (
			'http://' +
			config.get('ontology_manager.host') +
			':' +
			config.get('ontology_manager.port') +
			'/manager/ontology/'
		);
	}
	/**
	 * Interprets create queries
	 * @private
	 * @param {IoTeQLQuery} ontologyQuery
	 * @return {QueryInterpreter}
	 */
	create(ontologyQuery) {
		this.value.info = {};
		Object.assign(this.value.info, ontologyQuery.header.options);
		Object.assign(this.value.info, ontologyQuery.body);
		return this;
	}
	doRequest() {
		return super.doRequest().concat(this.doMqttRequest());
	}

	doMqttRequest() {
		return new Promise((resolve, reject) => {});
	}
}
export function interpret(nodeQuery) {
	return new OntologyQueryInterpreter().interpret(nodeQuery);
}
