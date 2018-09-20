import {loggers} from 'winston';
import clone from 'clone';

const logger = loggers.get('main');
/**
 *
 */
class DatabaseConnector {
	/**
	 *
	 * @param {object} config - The configuration of the database
	 */
	constructor(config) {
		if (new.target === DatabaseConnector) {
			let errMessage = 'Cannot construct DatabaseConnector' +
				' instances directly';
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
