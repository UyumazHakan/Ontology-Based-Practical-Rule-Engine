/**
 * Generic stream type protocol communicator
 */
class StreamCommunicator {
	/**
	 * Creates stream type protocol communicator. Cannot be used directly
	 * @param {Object} args All arguments
	 * @param {string} args.host Host of the server
	 * @param {number} args.port Port of the server
	 */
	constructor(args) {
		if (new.target === StreamCommunicator) {
			let errMessage =
				'Cannot construct StreamCommunicator' + ' instances directly';
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.isAlive = true; // Assuming  alive
		this.host = config.host;
		this.port = config.port;
		this.subscribers = {};
		this.connect();
	}
}

/**
 * The callback function to called upon a message
 * @callback StreamCommunicator~subscribeCallback
 * @param {Object} args Parsed value of received message
 * @param {string} message String value of received message
 */

export default StreamCommunicator;
