import QueryInterpreter from './query_interpreter';
/**
 * Class for creating flow json objects to be sent to ontology manager
 */
class FlowQueryInterpreter extends QueryInterpreter {
	/**
	 * Interprets create queries
	 * @private
	 * @param {IoTeQLQuery} flowQuery
	 * @return {QueryInterpreter}
	 */
	create(flowQuery) {
		this.value.info = {};
		Object.assign(this.value.info, flowQuery.header.options);
		Object.assign(this.value.info, flowQuery.body);
		return this;
	}
}
export function interpret(nodeQuery) {
	return new FlowQueryInterpreter().interpret(nodeQuery);
}
