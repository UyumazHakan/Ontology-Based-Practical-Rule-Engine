import SourceNode from 'app/ontology_manager/ontology_nodes/data_nodes/source_nodes/source_node';

import {loggers} from 'winston';
import DatabaseConnectorProxy
	from '../../../database_connector/database_connector_proxy';

const logger  = loggers.get('main');

class ElasticsearchSourceNode extends SourceNode {
	constructor(args) {
		super(args);
		if (DatabaseConnectorProxy.type !== 'elasticsearch') {
			logger.error('Used database is not elasticsearch');
			throw new TypeError();
		}
	}
}

export default ElasticsearchSourceNode;
