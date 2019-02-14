import QueryInterpreter from './query_interpreter';
import config from 'config';
import {stringify} from '../utils';
/**
 * Class for creating flow json objects to be sent to ontology manager
 */
class FlowQueryInterpreter extends QueryInterpreter {
	constructor() {
		super();
	}
	get httpUrl() {
		let result =
			'http://' +
			this.manager.host +
			':' +
			this.manager.port +
			'/manager/rule/';
		console.log(`Sending to:` + result);
		return result;
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
	read(flowQuery) {
		this.httpMethod = 'GET';
		this.httpUrl = this.httpUrl + '/' + flowQuery.header.options.id.value;
		return this;
	}
	update(flowQuery) {
		this.httpMethod = 'PATCH';
		this.httpUrl = this.httpUrl + '/' + flowQuery.header.options.id.value;
		this.value.info = {};
		Object.assign(this.value.info, flowQuery.header.options);
		Object.assign(this.value.info, flowQuery.body);
		return this;
	}
	end() {
		super.end();
		console.dir(stringify(this.value));
		this.value.info = this.value.info || {};
		this.value.info.middles = this.value.info.middles || [];
		this.value.info.sources = this.value.info.sources || [];
		this.value.info.sinks = this.value.info.sinks || [];
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
		if (this.value.info.paths) {
			if (!this.value.info.paths instanceof Array)
				this.value.info.paths = [this.value.info.paths];
			this.value.info.paths = this.value.info.paths.map((path) => ({
				source: path.first,
				sinks: path.second instanceof Array ? path.second : [path.second],
			}));
		}
		delete this.value.info.middles;
		delete this.value.info.sources;
		delete this.value.info.sinks;
		return this;
	}
}
export function interpret(nodeQuery) {
	return new FlowQueryInterpreter().interpret(nodeQuery);
}
