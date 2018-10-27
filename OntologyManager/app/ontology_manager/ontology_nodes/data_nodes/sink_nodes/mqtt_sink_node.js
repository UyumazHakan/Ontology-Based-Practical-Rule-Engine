import SinkNode from './sink_node';
import SinkType from './sink_types';
import {publish} from '../../../stream_communicator/stream_communicator_proxy';
import {loggers} from 'winston';
let logger = loggers.get('main');
/**
 * Node for data sink to mqtt
 * @extends SinkNode
 **/
class MqttSinkNode extends SinkNode {
	/**
	 * Creates a sink node to mqtt
	 * @param {Object} args All arguments
	 * @param {string} args.host Host of mqtt server
	 * @param {number} args.port Port of mqtt server
	 * @param {string} args.topic Topic message to be sinked
	 * @param {string | string[]} args.field Field or fields to be sinked
	 */
	constructor(args) {
		logger.debug(`MqttSinkNode(${JSON.stringify(args)})`);
		super(args);
		if (
			this.sinkType !== SinkType.append &&
			this.sinkType !== SinkType.appendWithTimestamp
		) {
			let errMessage = `${this.sinkType} is not valid for MqttSinkNode`;
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.host = args.host;
		this.port = args.port;
		this.topic = args.topic;
		this.objectType = args.objectType;
		this.objectId = args.objectId;
		this.field = args.field;
	}
	/**
	 * Executes the node
	 * @param {Object} args All arguments
	 * @param {string | string[]} args.value Value or values to be sinked in the fields
	 */
	execute(args) {
		let body = {};
		if (
			this.field instanceof Array &&
			args.value instanceof Array &&
			this.field.length === args.value.length
		) {
			body = this.field.reduce((acc, cur, i) => {
				acc[cur] = args[cur];
				return acc;
			}, {});
		} else if (!(this.field instanceof Array))
			body[this.field] = args[this.field];
		else {
			logger.error(
				`${this.field} has not same number of element with ${args.value}
				`
			);
			throw TypeError;
		}
		logger.debug(`Body ${JSON.stringify(body)} created`);
		this.executeWithType(body);
		this.passToSinks(args);
	}
	/**
	 * Selects and executes the node according the sink type
	 * @param {Object} args Object to be sinked
	 */
	executeWithType(args) {
		if (this.sinkType === SinkType.appendWithTimestamp) {
			args.timestamp = Date.now();
		} else if (!this.sinkType === SinkType.append) return;
		publish({
			protocol: 'mqtt',
			host: this.host,
			port: this.port,
			topic: this.topic,
			message: JSON.stringify(args),
		});
	}
}
export default MqttSinkNode;
