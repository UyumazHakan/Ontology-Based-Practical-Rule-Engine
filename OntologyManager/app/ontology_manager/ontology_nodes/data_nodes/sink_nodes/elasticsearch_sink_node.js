import DatabaseConnectorProxy from '../../../database_connector/database_connector_proxy';

import {loggers} from 'winston';
import SinkNode from './sink_node';
import SinkType from './sink_types';

const logger = loggers.get('main');
/**
 * Node for data sink to elasticsearch
 * @extends SinkNode
 **/
class ElasticsearchSinkNode extends SinkNode {
	/**
	 * Creates a sink node to elasticsearch
	 * @param {Object} args All arguments
	 * @param {string} args.objectType Type of the object to be sinked
	 * @param {string} args.objectId Id of the object to be sinked
	 * @param {string | string[]} args.field Field or fields to be sinked
	 */
	constructor(args) {
		logger.debug(`ElasticsearchSinkNode(${JSON.stringify(args)})`);
		super(args);
		if (
			this.sinkType !== SinkType.create ||
			this.sinkType !== SinkType.append ||
			this.sinkType !== SinkType.appendWithTimestamp ||
			this.sinkType !== SinkType.replace
		) {
			let errMessage = `${
				this.sinkType
			} is not valid for ElasticsearchSinkNode`;
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		if (DatabaseConnectorProxy.type !== 'elasticsearch') {
			logger.error('Used database is not elasticsearch');
			throw new TypeError();
		}
		this.objectType = args.objectType;
		this.objectId = args.objectId;
		this.field = args.field;
	}

	/**
	 * Executes the node
	 * @param {Object} args All arguements
	 * @param {string} args.id Object id to be sinked. Uses objectId of node if not present
	 * @param {string | string[]} args.value Value or values to be sinked in the fields
	 */
	execute(args) {
		super.execute(args);

		let executeImp = () => {
			let body = {objectType: this.objectType};
			if (
				this.field instanceof Array &&
				args.value instanceof Array &&
				this.field.length === args.value.length
			) {
				body.doc = this.field.reduce((acc, cur, i) => {
					acc[cur] = args.value[i];
					return acc;
				}, {});
			} else if (!(this.field instanceof Array)) {
				body.doc = {};
				body.doc[this.field] = args.value;
			} else {
				logger.error(
					`${this.field} has not same number of element with ${args.value}
				`
				);
				throw TypeError;
			}
			logger.debug(`Body ${JSON.stringify(body)} created`);
			this.executeWithType(body, args.id ? args.id : this.objectId)
				.then((res) => {
					delete args.value;
					args.id = res._id;
					Object.assign(args, body.doc);
					logger.debug(`Success: ${JSON.stringify(args)}`);
					this.passToSinks(args);
				})
				.catch((err) => {
					logger.debug(`Fail: ${JSON.stringify(err)}`);
				});
		};

		if (this.objectTypeUUID) {
			executeImp(this);
		} else {
			logger.debug(`UUID search starts for ${this.objectType}`);
			DatabaseConnectorProxy.getTypeUUID({
				objectType: this.objectType,
			})
				.then((resp) => {
					logger.debug(`UUID Success: ${JSON.stringify(resp)}`);
					this.objectTypeUUID = resp;
					executeImp();
				})
				.catch((err) => {
					logger.error(`UUID Fail: ${JSON.stringify(err)}`);
				});
		}
	}

	/**
	 * Selects and executes the node according the sink type
	 * @param {Object} body Object to be sinked
	 * @param {id} id Id of the object
	 * @return {Promise<any>} Resolves response from elasticsearch
	 */
	executeWithType(body, id) {
		logger.debug(
			`ElasticsearchSinkNode.executeWithType(${JSON.stringify(
				body
			)}, ${JSON.stringify(id)})`
		);
		if (this.sinkType === SinkType.append) {
		} else if (this.sinkType === SinkType.replace) {
			return this.replace(body, id);
		} else if (this.sinkType === SinkType.appendWithTimestamp) {
		} else if (this.sinkType === SinkType.create) {
			return this.create(body.doc, id);
		}
	}
	/**
	 * Update object in the elasticsearch
	 * @param {Object} body Object to be sinked
	 * @param {id} id Id of the object
	 * @return {Promise<any>} Resolves response from elasticsearch
	 **/
	replace(body, id) {
		logger.debug(
			`ElasticsearchSinkNode.replace(${JSON.stringify(body)}, ${JSON.stringify(
				id
			)})`
		);
		return DatabaseConnectorProxy.update('data', '', body, id);
	}
	/**
	 * Creates new object in the elasticsearch
	 * @param {Object} body Object to be sinked
	 * @param {id} id Id of the object
	 * @return {Promise<any>} Resolves response from elasticsearch
	 **/
	create(body, id) {
		logger.debug(
			`ElasticsearchSinkNode.create(${JSON.stringify(body)}, ${JSON.stringify(
				id
			)})`
		);
		body.type = this.objectTypeUUID;
		return DatabaseConnectorProxy.create({
			index: 'data',
			type: 'dataType',
			body: body,
		});
	}
}

export default ElasticsearchSinkNode;
