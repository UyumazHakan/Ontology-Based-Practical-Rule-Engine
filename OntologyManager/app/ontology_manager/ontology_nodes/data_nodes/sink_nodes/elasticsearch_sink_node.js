import DatabaseConnectorProxy from '../../../database_connector/database_connector_proxy';

import {loggers} from 'winston';
import SinkNode from 'sink_node';

const logger = loggers.get('main');

class ElasticsearchSinkNode extends SinkNode {
	constructor(args) {
		super(args);
		if (DatabaseConnectorProxy.type !== 'elasticsearch') {
			logger.error('Used database is not elasticsearch');
			throw new TypeError();
		}
		this.objectType = args.objectType;
		this.objectId = args.objectId;
		this.field = args.field;
	}
	execute(args) {
		let body = {};
		if (args.field instanceof Array && args.value instanceof Array &&
		args.field.length === args.value.length) {
			body.doc = args.field.reduce((acc, cur, i) => {
				if (acc === undefined) {
					return {cur: args.value[i]};
				}
				return acc[cur] = args.value[i];
			});
		} else if (!(args.field instanceof Array) &&
			!(args.value instanceof Array)) {
			body.doc = {args.field: args.value};
		} else {
			logger.error(`${args.field} has not same number of element with ${args.value}`);
			throw TypeError;
			body.doc = {};
		}
		DatabaseConnectorProxy.update('data', '', body, args.id);
	}
}

export default ElasticsearchStreamSourceNode;
