import {loggers} from 'winston';
import _config from 'config';

import ElasticSearchDatabaseConnector from './elastic_search_database_connector';

const logger = loggers.get('main');
let instance = null;

class DatabaseConnectorProxy {
	constructor() {
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
	create(args) {
		logger.debug(`DatabaseConnectorProxy.create(${JSON.stringify(args)})`);
		return this.connector.create(args);
	}
	search(args) {
		return this.connector.search(args);
	}
	update(args) {
		return this.connector.update(args);
	}
	getTypeUUID(args) {
		return this.connector.getTypeUUID(args);
	}
	ping(args) {
		return this.connector.ping(args);
	}
}

function getInstance() {
	if (instance === null) {
		instance = new DatabaseConnectorProxy();
	}
	return instance;
}

export default getInstance();
