import QueryInterpreter from './query_interpreter';
/**
 * Class for creating node json objects to be sent to ontology manager
 */
class NodeQueryInterpreter extends QueryInterpreter {
	/**
	 * Interprets create queries
	 * @private
	 * @param {IoTeQLQuery} nodeQuery
	 * @return {Object}
	 */
	create(nodeQuery) {
		if (!nodeQuery.header.options.type)
			throw new TypeError('No node type is defined');
		this.value.type = nodeQuery.header.options.type + 'Node';
		delete nodeQuery.header.options.type;
		this.value.info = {};
		Object.assign(this.value.info, nodeQuery.header.options);
		Object.assign(this.value.info, nodeQuery.body);
		return this;
	}
}
export function interpret(nodeQuery) {
	return new NodeQueryInterpreter().interpret(nodeQuery);
}
