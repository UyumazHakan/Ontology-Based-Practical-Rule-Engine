import QueryInterpreter from './query_interpreter';
import config from 'config';
import {stringify} from '../utils';
/**
 * Class for creating flow json objects to be sent to ontology manager
 */
class FlowQueryInterpreter extends QueryInterpreter {
	constructor() {
		super();
		this.httpUrl =
			'http://' +
			config.get('ontology_manager.host') +
			':' +
			config.get('ontology_manager.port') +
			'/manager/rule/';
	}
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
	end() {
		super.end();
		console.dir(stringify(this.value));
		if (!this.value.info.paths instanceof Array)
			this.value.info.paths = [this.value.info.paths];
		this.value.info.paths = this.value.info.paths.map((path) => ({
			source: path.first,
			sinks: path.second instanceof Array ? path.second : [path.second],
		}));
		this.value.info.nodes = this.value.info.middles.concat(
			this.value.info.sinks.map((sink) => {
				sink.sink = true;
				return sink;
			}),
			this.value.info.sources.map((source) => {
				source.source = true;
				return source;
			})
		);
		delete this.value.info.middles;
		delete this.value.info.sources;
		delete this.value.info.sinks;
		return this;
	}
}
export function interpret(nodeQuery) {
	return new FlowQueryInterpreter().interpret(nodeQuery);
}
