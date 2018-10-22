import mqtt from 'mqtt';
import StreamCommunicator from './stream_communicator';

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
			const subscriberFns = this.subscribers[topic];
			try {
				const parsedMessage = JSON.parse(message);
				subscriberFns.forEach((fn) => fn(parsedMessage, message));
			} catch (e) {
				subscriberFns.forEach((fn) => fn(_, message));
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
		if (!(args.message instanceof string)) {
			args.message = JSON.stringify(args.message);
		}
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
				this.subscribers[args.topic].push(args.callback);
			} else {
				this.subscribers[args.topic] = [args.callback];
			}
		});
	}
}
export default MqttComunicator;
