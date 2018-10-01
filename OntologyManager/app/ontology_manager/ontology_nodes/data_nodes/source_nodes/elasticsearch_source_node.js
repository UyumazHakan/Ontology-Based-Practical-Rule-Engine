import SourceNode from 'app/ontology_manager/ontology_nodes/data_nodes/source_nodes/source_node';

import {loggers} from 'winston';
import DatabaseConnectorProxy
	from '../../../database_connector/database_connector_proxy';
import SourceTypes from 'source_types';
const logger = loggers.get('main');

class ElasticsearchSourceNode extends SourceNode {
	constructor(args) {
		super(args);
		if (DatabaseConnectorProxy.type !== 'elasticsearch') {
			logger.error('Used database is not elasticsearch');
			throw new TypeError();
		}
		this.objectType = args.objectType;
		DatabaseConnectorProxy.getTypeUUID({
			type:args.objectType
		}).then((resp) => {
			logger.debug(`Success: ${JSON.stringify(resp)}`);
			this.objectTypeUUID = resp;
		}).catch((err) => {
			logger.error(`Fail: ${JSON.stringify(err)}`);
		});
		this.objectId = args.objectId;
		this.field = args.field;
	}
	execute(args) {
		super(args);
		args.query = {objectType: this.objectType};
		this.executeWithType(args).then((resp) => {
			logger.debug(`Success: ${JSON.stringify(resp)}`);
			this.passToSinks({
				hits: resp.hits.hits,
			});
		}).catch((err) => {
			logger.err(`Fail: ${JSON.stringify(err)}`);
		});
	}
	executeWithType(args) {
		if (this.type === SourceTypes.all){
			return this.all(args);
		}
	}
	all(args) {
		return DatabaseConnectorProxy.search({
			index: 'data',
			type:  this.objectTypeUUID,
			query: args.query,
		});
	}
}

export default ElasticsearchSourceNode;
