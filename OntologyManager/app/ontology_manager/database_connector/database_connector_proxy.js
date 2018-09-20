import {loggers} from 'winston';

import ElasticSearchDatabaseConnector from './elastic_search_database_connector';

const logger = loggers.get('main');
let instance = null;

class DatabaseConnectorProxy {
	constructor(config) {
		if (!instance) {
			instance = this;
		}
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
		return instance;
	}
	create(...args) {
		this.connector.create(args);
	}
	search(...args) {
		this.connector.search(args);
	}
	update(...args) {
		this.connector.update(args);
	}
}

export default DatabaseConnectorProxy;
