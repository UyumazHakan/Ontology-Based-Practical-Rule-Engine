import clone from 'clone';
/**
 * Generic interpreter class for all query types
 * @property {Object} value Created json object
 */
class QueryInterpreter {
	/**
	 * Creates a query interpreter
	 */
	constructor() {
		this.value = {};
	}
	/**
	 * Creates a json object to be sent to ontology manager
	 * @param {IoTeQLQuery} query
	 * @return {QueryInterpreter}
	 */
	interpret(query) {
		this.query = query = clone(query);
		switch (query.header.command) {
			case 'create':
				return this.create(query);
			default:
				throw TypeError('Unsupported command type');
		}
	}
}
export default QueryInterpreter;
