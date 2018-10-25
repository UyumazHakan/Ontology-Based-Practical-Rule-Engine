import ElasticsearchSourceNode from 'app/ontology_manager/ontology_nodes/data_nodes/source_nodes/elasticsearch_source_node';
import DatabaseConnectorProxy from '../../../database_connector/database_connector_proxy';

import {loggers} from 'winston';

const logger = loggers.get('main');

class ElasticsearchStreamSourceNode extends ElasticsearchSourceNode {
	constructor(args) {
		super(args);
		this.objectType = args.objectType;
		this.objectId = args.objectId;
		this.streamField = args.streamField;
	}
	execute(args) {}
}

export default ElasticsearchStreamSourceNode;
