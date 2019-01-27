import mqtt from 'mqtt';
import StreamCommunicator from './stream_communicator';
import {loggers} from 'winston';
import {stringify} from '../../utils';
const logger = loggers.get('main');

/**
 * Class for mqtt communication
 */
class MqttComunicator extends StreamCommunicator {
	constructor(args) {
		super(args);
		this.host = this.host.replace('\\');
		if (!this.host.startsWith('mqtt://')) this.host = 'mqtt://' + this.host;
	}

	/**
	 * Connects to mqtt server with given host and ip
	 */
	connect() {
		let address = this.host;
		if (this.port) address += ':' + this.port;
		this.client = mqtt.connect(address);
		this.client.on('message', (topic, message) => {
			const subscriberFns = this.subscribers[topic]
				.filter((e) => e && e.callback)
				.map((subscriber) => subscriber.callback);
			try {
				const parsedMessage = JSON.parse(message);
				subscriberFns.forEach((fn) => fn(parsedMessage, message));
			} catch (e) {
				logger.error(stringify(e));
				subscriberFns.forEach((fn) => fn(undefined, message));
			}
		});
	}

	/**
	 * Publish a message
	 * @param {Object} args  All arguements
	 * @param {string} args.topic To which topic message will be published
	 * @param {string | Object} args.message Message to publish
	 */
	publish(args) {
		if (args.message instanceof Object)
			args.message = JSON.stringify(args.message);
		this.client.publish(args.topic, args.message);
	}
	/**
	 * Subscribe a topic
	 * @param {Object} args  All arguements
	 * @param {string} args.topic To which topic will be subscribed
	 * @param {StreamCommunicator~subscribeCallback} args.callback The callback function to called upon a message
	 */
	subscribe(args) {
		this.client.subscribe(args.topic, (err) => {
			if (err) return;
			if (this.subscribers[args.topic]) {
				this.subscribers[args.topic].push({
					callback: args.callback,
					id: args.id,
				});
			} else {
				this.subscribers[args.topic] = [
					{
						callback: args.callback,
						id: args.id,
					},
				];
			}
		});
	}
	unsubscribe(args) {
		const subs = this.subscribers[args.topic];
		subs.splice(0, subs.length, subs.filter((sub) => sub.id !== args.id));
		if (subs.length <= 0) this.client.unsubscribe(args.topic);
	}
}
export default MqttComunicator;
