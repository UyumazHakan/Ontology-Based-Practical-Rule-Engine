import MqttComunicator from './mqtt_communicator';

const streamCommunicators = {};

/**
 * Returns stream communicator from cache
 * @param {Object} args
 * @param {string} args.protocol Protocol of server
 * @param {string} args.host Host of the server
 * @param {number} args.port Port of the server
 * @return {StreamCommunicator}
 */
function getCommunicator(args) {
	if (!streamCommunicators[args.protocol])
		streamCommunicators[args.protocol] = {};
	args.host = args.host.replace('\\');
	let address = null;

	if (args.protocol === 'mqtt') {
		if (!args.host.startsWith('mqtt://')) args.host = 'mqtt://' + args.host;
		if (!args.port) args.port = 1883;
		address = host + ':' + this.port;
		if (!streamCommunicators[args.protocol][address])
			streamCommunicators[args.protocol][address] = new MqttComunicator({
				host: args.host,
				port: args.port,
			});
	} else {
		let errMessage = `${args.protocol} is not supported`;
		logger.error(errMessage);
		throw new TypeError(errMessage);
	}
	return streamCommunicators[args.protocol][address];
}
/**
 * Publish message
 * @param {Object} args
 * @param {string} args.protocol Protocol of server
 * @param {string} args.host Host of the server
 * @param {number} args.port Port of the server
 * @param {string} args.message Message to be published
 * @param {string} args.topic Topic to be published to
 */
export function publish(args) {
	const communicator = getCommunicator(args);
	communicator.publish({message: args.message, topic: args.topic});
}
/**
 * Subscribe a topic
 * @param {Object} args
 * @param {StreamCommunicator~subscribeCallback} callback The callback function to called upon a message
 * @param {string} args.protocol Protocol of server
 * @param {string} args.host Host of the server
 * @param {number} args.port Port of the server
 * @param {string} args.topic Topic to be published to
 * @param {StreamCommunicator~subscribeCallback} args.callback The callback function to called upon a message
 */
export function subscribe(args, callback) {
	const communicator = getCommunicator(args);
	communicator.subscribe({
		topic: args.topic,
		callback: args.callback || callback,
	});
}

