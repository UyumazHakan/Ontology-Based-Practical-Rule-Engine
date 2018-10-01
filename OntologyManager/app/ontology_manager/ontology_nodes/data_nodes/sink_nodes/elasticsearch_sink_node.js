import DatabaseConnectorProxy from '../../../database_connector/database_connector_proxy';

import {loggers} from 'winston';
import SinkNode from './sink_node';
import SinkType from './sink_types';

const logger = loggers.get('main');

class ElasticsearchSinkNode extends SinkNode {
	constructor(args) {
		logger.debug(`ElasticsearchSinkNode(${JSON.stringify(args)})`);
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
		super.execute(args);

		let executeImp = () => {
			let body = {objectType: this.objectType};
			if (this.field instanceof Array && args.value instanceof Array &&
				this.field.length === args.value.length) {
				body.doc = this.field.reduce((acc, cur, i) => {
					acc[cur] = args.value[i];
					return acc;
				}, {});
			} else if (!(this.field instanceof Array) &&
				!(args.value instanceof Array)) {
				body.doc = {};
				body.doc[this.field] = args.value;
			} else {
				logger.error(
					`${this.field} has not same number of element with ${args.value}
				`);
				throw TypeError;
			}
			logger.debug(`Body ${JSON.stringify(body)} created`);
			this.executeWithType(body, args.id ? args.id : this.objectId)
				.then(res => {
					logger.debug(`Success: ${JSON.stringify(res)}`);
					this.passToSinks(res);
				}).catch(err => {
				logger.debug(`Fail: ${JSON.stringify(err)}`);
			});
		};

		if (this.objectTypeUUID) {
			executeImp(this);
		} else {
			logger.debug(`UUID search starts for ${this.objectType}`);
			DatabaseConnectorProxy.getTypeUUID({
				objectType: this.objectType,
			}).then((resp) => {
				logger.debug(`UUID Success: ${JSON.stringify(resp)}`);
				this.objectTypeUUID = resp;
				executeImp();
			}).catch((err) => {
				logger.error(`UUID Fail: ${JSON.stringify(err)}`);
			});
		}
	}
	executeWithType(body, id) {
		logger.debug(`ElasticsearchSinkNode.executeWithType(${JSON.stringify(body)}, ${JSON.stringify(id)})`);
		if (this.sinkType === SinkType.append) {
		} else if (this.sinkType === SinkType.replace) {
			return this.replace(body, id);
		} else if (this.sinkType === SinkType.appendWithTimestamp) {
		} else if (this.sinkType === SinkType.create) {
			return this.create(body.doc, id);
		}
	}
	replace(body, id) {
		logger.debug(`ElasticsearchSinkNode.replace(${JSON.stringify(body)}, ${JSON.stringify(id)})`);
		DatabaseConnectorProxy.update('data', '', body, id);
	}
	create(body, id) {
		logger.debug(`ElasticsearchSinkNode.create(${JSON.stringify(body)}, ${JSON.stringify(id)})`);
		body.type = this.objectTypeUUID;
		return DatabaseConnectorProxy.create({
			index: 'data',
			type: 'dataType',
			body: body,
		});
	}
}

export default ElasticsearchSinkNode;
