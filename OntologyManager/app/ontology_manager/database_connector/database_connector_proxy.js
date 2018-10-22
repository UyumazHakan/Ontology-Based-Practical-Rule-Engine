import {loggers} from 'winston';
import _config from 'config';

import ElasticSearchDatabaseConnector from './elastic_search_database_connector';

const logger = loggers.get('main');
let instance = null;

/**
 * Class for communicating with selected databases in config file
 */
class DatabaseConnectorProxy {
	/**
	 * Creates DatabaseConnecterProxy with config file
	 */
	constructor() {
		logger.debug("DatabaseConnectorProxy()")
		let config = _config.database;
		if (config === undefined) {
			logger.error('Need to have configuration to create the instance');
			throw new Error();
		} else if (config.type === 'elasticsearch') {
			this.connector = new ElasticSearchDatabaseConnector(config);
			this.type = 'elasticsearch';
		} else {
			logger.error(`Database type ${config.type} is not valid`);
			throw new Error();
		}
	}

	/**
	 * Execute create function of the selected database connector in config
	 * @param {Object} args All arguments to be passed to create function of the configured DatabaseConnector
	 */
	create(args) {
		logger.debug(`DatabaseConnectorProxy.create(${JSON.stringify(args)})`);
		return this.connector.create(args);
	}
	/**
	 * Execute search function of the selected database connector in config
	 * @param {Object} args All arguments to be passed to search function of the configured DatabaseConnector
	 */
	search(args) {
		return this.connector.search(args);
	}
	/**
	 * Execute update function of the selected database connector in config
	 * @param {Object} args All arguments to be passed to update function of the configured DatabaseConnector
	 */
	update(args) {
		return this.connector.update(args);
	}
	/**
	 * Execute getTypeUUID function of the selected database connector in config
	 * @param {Object} args All arguments to be passed to getTypeUUID function of the configured DatabaseConnector
	 */
	getTypeUUID(args) {
		return this.connector.getTypeUUID(args);
	}
	/**
	 * Execute ping function of the selected database connector in config
	 * @param {Object} args All arguments to be passed to ping function of the configured DatabaseConnector
	 */
	ping(args) {
		return this.connector.ping(args);
	}
}

/**
 * Returns singleton DatabaseConnectorProxy instance
 * @return {DatabaseConnectorProxy} Singleton instance of DatabaseConnectorProxy
 */
function getInstance() {
	if (instance === null) {
		instance = new DatabaseConnectorProxy();
	}
	return instance;
}

export default getInstance();
