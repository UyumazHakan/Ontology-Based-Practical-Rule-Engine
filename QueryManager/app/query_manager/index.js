import {interpret as interpretNodeQuery} from './node_query_interpreter';
import {interpret as interpretFlowQuery} from './flow_query_interpreter';

/**
 * @typedef {Object} IoTeQLQuerySequence
 * @property {IoTeQLQuery[]} seq
 */
/**
 * @typedef {Object} IoTeQLQuery
 * @property {IoTeQLQueryHeader} header
 * @property {IoTeQLQueryBody} body
 */
/**
 * @typedef {Object} IoTeQLQueryHeader
 * @property {IoTeQLQueryCommand} command
 * @property {IoTeQLQueryType} type
 * @property {IoTeQLQueryOption[]} options
 * @property {string} options.type
 */
/**
 * @typedef {Object.<string, IoTeQLQueryValueOrRef>} IoTeQLQueryBody
 */
/**
 * @typedef {'create' | 'update'} IoTeQLQueryCommand
 */
/**
 * @typedef {'node' | 'flow'} IoTeQLQueryType
 */
/**
 * @typedef {Object.<string, IoTeQLQueryPrimitive>} IoTeQLQueryOption
 */
/**
 * @typedef {Object} IoTeQLQueryValueOrRef
 * @property {'number' | 'string' | 'boolean' | 'object' | 'array' | 'ref' } type
 * @property {number | string  | boolean | Object | Array | IoTeQLQueryPrimitive} value
 */
/**
 * @typedef {Object} IoTeQLQueryPrimitive
 * @property {'number' | 'string' | 'boolean' } type
 * @property {number | string | boolean } value
 */
/**
 * Manages and executes parsed queries
 */
class QueryManager {
	/**
	 * Executes given query
	 * @param {IoTeQLQuerySequence} parsedQuery
	 * @return {Object}
	 */
	execute(parsedQuery) {
		const seq = parsedQuery.seq;
		const nodeInterpreters = seq
			.filter((query) => query.header.type === 'node')
			.map(interpretNodeQuery);
		const flowInterpreters = seq
			.filter((query) => query.header.type === 'flow')
			.map(interpretFlowQuery);
		const allInterpreters = nodeInterpreters.concat(flowInterpreters);
		return allInterpreters.map((interpreter) => interpreter.value);
	}
}
const instance = new QueryManager();

export default {execute: instance.execute};
