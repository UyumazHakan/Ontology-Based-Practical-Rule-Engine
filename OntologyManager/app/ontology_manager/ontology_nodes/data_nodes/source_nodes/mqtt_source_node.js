import SourceNode from './source_node';
import SourceType from './source_types';
import {subscribe} from '../../../stream_communicator/stream_communicator_proxy';
import {loggers} from 'winston';
let logger = loggers.get('main');

/**
 * Node for data source from mqtt
 * @extends SourceNode
 */
class MqttSourceNode extends SourceNode {
	/**
	 * Creates a source node from mqtt
	 * @param {Object} args All arguments
	 *
	 * @param {string} args.host Host of mqtt server
	 * @param {number} args.port Port of mqtt server
	 * @param {string} args.topic Topic message to be subscribed
	 * @param {string | string[]} [args.field] Field or fields to be matched
	 * @param {SourceType | SourceTypeEnum} args.sinkType Type of the source
	 */
	constructor(args) {
		logger.debug(`MqttSourceNode(${JSON.stringify(args)})`);
		super(args);
		if (
			this.sourceType !== SourceType.all &&
			this.sourceType !== SourceType.allWithField &&
			this.sourceType !== SourceType.allWithFieldValuePair &&
			this.sourceType !== SourceType.id
		) {
			let errMessage = `${this.sourceType} is not valid for MqttSourceNode`;
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.host = args.host;
		this.port = args.port;
		this.topic = args.topic;
		this.field = args.field;
		subscribe({
			protocol: 'mqtt',
			host: this.host,
			port: this.port,
			topic: this.topic,
			callback: (args) => this.execute(args),
		});
	}
	/**
	 * Executes the node
	 * @param {Object} args All arguments
	 */
	execute(args) {
		super.execute(args);
		if (!args.field) args.field = this.field;
		this.executeWithType(args);
	}
	/**
	 * Selects and executes the node according the sink type
	 * @param {Object} args Gathered object
	 */
	executeWithType(args) {
		if (this.sourceType === SourceType.all) this.executeTypeAll(args);
		else if (this.sourceType === SourceType.allWithField)
			this.executeTypeAllWithField(args);
		else if (this.sourceType === SourceType.allWithFieldValuePair)
			this.executeTypeAllWithFieldValuePair(args);
		else if (this.sourceType === SourceType.id) this.executeTypeId(args);
	}
	/**
	 * Pass every gathered object to sink nodes
	 * @param {Object} args Gathered object
	 */
	executeTypeAll(args) {
		if (args.field) delete args.field;
		this.passToSinks(args);
	}
	/**
	 * Pass every gathered object with certain field to sink nodes
	 * @param {Object} args Gathered object
	 * @param {string | string[]} [args.field] Field or fields to be matched
	 */
	executeTypeAllWithField(args) {
		if (
			(args.field instanceof Array &&
				args.field.reduce((acc, cur) => acc && args[cur], true)) ||
			(!(args.field instanceof Array) && args[args.field])
		) {
			delete args.field;
			this.passToSinks(args);
		}
	}
	/**
	 * Pass every gathered object with certain value in certain field to sink nodes
	 * @param {Object} args Gathered object
	 */
	executeTypeAllWithFieldValuePair(args) {}
	/**
	 * Pass every gathered object with certain id to sink nodes
	 * @param {Object} args Gathered object
	 */
	executeTypeId(args) {}
}
export default MqttSourceNode;
