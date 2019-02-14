import QueryInterpreter from './query_interpreter';
import config from 'config';
import {stringify} from '../utils';
import Balancer from '../balancer';
import mqtt from 'mqtt';
let MqttClient = config.get('ontology_engine')
	? mqtt.connect(
			`mqtt://${config.get('engine_broker.host')}` +
				(config.get('engine_broker.port') &&
				config.get('engine_broker.port').length > 0
					? `:${config.get('engine_broker.port')}`
					: '')
	  )
	: undefined;
/**
 * Class for creating ontology json objects to be sent to ontology manager
 */
class OntologyQueryInterpreter extends QueryInterpreter {
	constructor() {
		super();
	}
	get httpUrl() {
		let result =
			'http://' +
			this.manager.host +
			':' +
			this.manager.port +
			'/manager/ontology';
		console.log(`Sending to:` + result);
		return result;
	}
	/**
	 * Interprets create queries
	 * @private
	 * @param {IoTeQLQuery} ontologyQuery
	 * @return {QueryInterpreter}
	 */
	create(ontologyQuery) {
		this.manager = Balancer.leastLoadedManagerConfig;
		this.engine = Balancer.leastLoadedEngineConfig;
		this.value.info = {};
		Object.assign(this.value.info, ontologyQuery.header.options);
		Object.assign(this.value.info, ontologyQuery.body);
		return this;
	}
	read(ontologyQuery) {
		this.manager = Balancer.findManagerConfig(
			ontologyQuery.header.options.id.value
		);
		this.engine = Balancer.findEngineConfig(
			ontologyQuery.header.options.id.value
		);
		this.httpMethod = 'GET';
		this.httpUrl = this.httpUrl + '/' + ontologyQuery.header.options.id.value;
		return this;
	}
	update(ontologyQuery) {
		this.manager = Balancer.findManagerConfig(
			ontologyQuery.header.options.id.value
		);
		this.engine = Balancer.findEngineConfig(
			ontologyQuery.header.options.id.value
		);
		this.httpMethod = 'PATCH';
		this.httpUrl = this.httpUrl + '/' + ontologyQuery.header.options.id.value;
		this.value.info = {};
		Object.assign(this.value.info, ontologyQuery.header.options);
		Object.assign(this.value.info, ontologyQuery.body);
		return this;
	}
	doRequest() {
		return super.doRequest().concat(this.doMqttRequest());
	}

	doMqttRequest() {
		return new Promise((resolve, reject) => {
			if (this.query.header.command === 'create')
				if (MqttClient)
					MqttClient.publish(
						'ontology/create',
						JSON.stringify({id: this.value.info.name, engine: this.engine.host})
					);
			resolve({data: ''});
		});
	}
}
export function interpret(nodeQuery) {
	return new OntologyQueryInterpreter().interpret(nodeQuery);
}
