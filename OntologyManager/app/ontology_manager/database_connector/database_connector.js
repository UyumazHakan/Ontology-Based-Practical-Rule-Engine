import {loggers} from 'winston';
import clone from 'clone';

const logger = loggers.get('main');
/**
 * Class for all connection with database
 */
class DatabaseConnector {
	/**
	 * Creates a DatabaseConnector. Should be used through subclasses
	 * @param {Object} config  The configuration of the database
	 * @param {string} config.host Host of the database
	 * @param {number} config.port Port of the database
	 * @param {Object} config.logger Log configuration for database
	 * @param {string} config.logger.level Log level for database
	 * @param {Object} config.heartbeat Heartbeat configuration for database
	 * @param {boolean} config.heartbeat.check States whether heartbeat should be active
	 * @param {number} config.heartbeat.interval Interval for heartbeat in ms
	 */
	constructor(config) {
		if (new.target === DatabaseConnector) {
			let errMessage =
				'Cannot construct DatabaseConnector' + ' instances directly';
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.isAlive = false;
		this.host = config.host;
		this.port = config.port;
		this.logLevel = config.logger.level;
		this.heartbeat = config.heartbeat.check;
		if (this.heartbeat) {
			this.heartbeatInterval = config.heartbeat.interval;
		}
		this.searchBuffer = [];
		this.createBuffer = [];
		this.updateBuffer = [];
		this.connect();
		this.startHeartbeat();
	}

	/**
	 * Starts heartbeat with configured interval
	 */
	startHeartbeat() {
		if (this.heartbeat) {
			setInterval(this.ping, this.heartbeatInterval, () => {
				let tmp = clone(this.searchBuffer);
				this.searchBuffer = [];
				tmp.forEach((args) => {
					this.search(args).then(args.onFailCallback);
				});
				tmp = clone(this.createBuffer);
				this.createBuffer = [];
				tmp.forEach((args) => {
					this.create(args).then(args.onFailCallback);
				});
				tmp = clone(this.updateBuffer);
				this.updateBuffer = [];
				tmp.forEach((args) => {
					this.update(args).then(args.onFailCallback);
				});
			});
		}
	}
}

export default DatabaseConnector;
