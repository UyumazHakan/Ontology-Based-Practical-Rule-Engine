import {loggers} from 'winston';

import DatabaseConnector from './database_connector';

import elasticsearch from 'elasticsearch';
import uuid from 'uuid/v1';
const logger = loggers.get('main');
/**
 * Class for all connection with Elasticsearch database
 * @extends DatabaseConnector
 */
class ElasticSearchDatabaseConnector extends DatabaseConnector {
	/**
	 * Creates connection with Elasticsearch database
	 */
	connect() {
		logger.debug('ElasticSearchDatabaseConnector()')
		this.client = new elasticsearch.Client({
			host: `${this.host}:${this.port}`,
			log: this.logLevel,
		});
		this.ping();
	}

	/**
	 * Pings Elasticsearch database and sets isAlive field
	 * @param {function} callback Callback function to call in case of any error
	 */
	ping(callback) {
		logger.debug(`ping(callback)`);
		logger.debug(this.client);
		if(!this.heartbeat) return;
		this.client.ping(
			{
				requestTimeout: 5000,
			},
			(error) => {
				if (error) {
					logger.error('Could not ping elasticsearch');
					this.isAlive = false;
				} else {
					logger.silly('Ping to elasticsearch is successful');
					this.isAlive = true;
				}
				if (callback !== undefined) callback(error);
			}
		);
	}

	/**
	 * Creates a new object in Elasticsearch database
	 * @param {Object} args All arguments
	 * @param {string} args.index Index that the new object should be created in
	 * @param {string} args.type Type of the new object
	 * @param {Object} args.body The object that will be created in Elasticsearch database
	 * @return {Promise<any>} Resolves response from Elasticsearch database
	 */
	create(args) {
		logger.debug(
			`ElasticsearchDatabaseConnector.create(${JSON.stringify(args)})`
		);
		let index = args.index;
		let type = args.type;
		let body = args.body;
		let onFailCallback = args.onFailCallback;
		let id = uuid();
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.createBuffer.push({
					index: index,
					type: type,
					body: body,
					onFailCallback: onFailCallback,
				});
			}
		};
		return new Promise((resolve, reject) => {
			if (!this.isAlive) {
				logger.error(`Elastic search is not alive, appended in the create
				buffer index: ${index}, type: ${type}, query: ${body}`);
				onError();
				reject('Elasticsearch is not alive, appended in the create buffer');
			}

			this.client
				.create({
					index: index,
					type: type,
					body: body,
					id: id,
				})
				.then(
					function(resp) {
						logger.debug(`Created: ${resp}`);
						resolve(resp);
					},
					function(err) {
						logger.error(`Error on creating: ${err.message}`);
						onError();
						reject(err);
					}
				);
		});
	}
	/**
	 * Searches for an object in Elasticsearch database
	 * @param {Object} args All arguments
	 * @param {string} args.index Search index
	 * @param {string} args.type Object type of the search
	 * @param {Object} args.query Search query
	 * @return {Promise<any>} Resolves response from Elasticsearch database
	 */
	search(args) {
		logger.debug(
			`ElasticsearchDatabaseConnector.search(${JSON.stringify(args)})`
		);
		let index = args.index;
		let type = args.type;
		let query = args.query;
		let onFailCallback = args.onFailCallback;
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.searchBuffer.push({
					index: index,
					type: type,
					query: query,
					onFailCallback: onFailCallback,
				});
			}
		};
		return new Promise((resolve, reject) => {
			if (!this.isAlive) {
				logger.error(`Elastic search is not alive, appended in the search
				buffer index: ${index}, type: ${type}, query: ${query}`);
				onError();
				reject('Elasticsearch is not alive, appended in the search buffer');
			}
			this.client
				.search({
					index: index,
					type: type,
					body: {
						query: query,
					},
				})
				.then(
					function(resp) {
						logger.debug(`Searched: ${JSON.stringify(resp)}`);
						resolve(resp);
					},
					function(err) {
						logger.error(err.message);
						onError();
						reject(err);
					}
				);
		});
	}
	/**
	 * Updates an object in Elasticsearch database
	 * @param {Object} args All arguments
	 * @param {string} args.index Index that the object should be updated in
	 * @param {string} args.type Type of the object
	 * @param {Object} args.body New and updated fields of the object
	 * @param {string} args.id Id of the object in the Elasticsearch database
	 * @return {Promise<any>} Resolves response from Elasticsearch database
	 */
	update(args) {
		logger.debug(
			`ElasticsearchDatabaseConnector.update(${JSON.stringify(args)})`
		);
		let index = args.index;
		let type = args.type;
		let body = args.body;
		let id = args.id;
		let onFailCallback = args.onFailCallback;
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.updateBuffer.push({
					index: index,
					type: type,
					body: body,
					id: id,
					onFailCallback: onFailCallback,
				});
			}
		};
		return new Promise((resolve, reject) => {
			if (!this.isAlive) {
				logger.error(`Elastic search is not alive, appended in the search
				buffer index: ${index}, type: ${type}, query: ${query}`);
				onError();
				reject('Elasticsearch is not alive, appended in the search buffer');
			}
			this.client
				.update({
					index: index,
					type: type,
					id: id,
					body: body,
				})
				.then(
					function(resp) {
						logger.debug(`Updated: ${resp}`);
						resolve(resp);
					},
					function(err) {
						logger.error(err.message);
						onError();
						reject(err);
					}
				);
		});
	}

	/**
	 * Gets or creates UUID for an object type
	 * @param {Object} args All arguments
	 * @param {string} args.objectType Object type that is searched for UUID
	 * @returns {Promise<any>} Resolves UUID of the type
	 */
	getTypeUUID(args) {
		logger.debug(
			`ElasticsearchDatabaseConnector.getTypeUUID(${JSON.stringify(args)})`
		);
		return new Promise((resolve, reject) => {
			this.search({
				index: 'meta_data',
				type: 'type_uuid',
				query: {
					match: {
						objectType: args.objectType,
					},
				},
			})
				.then((resp) => {
					logger.debug(`UUID search completed for ${args.objectType}`);
					if (resp.hits.hits.length === 0) {
						let newUUID = uuid();
						this.create({
							index: 'meta_data',
							type: 'type_uuid',
							body: {
								objectType: args.objectType,
								uuid: newUUID,
							},
						})
							.then((resp) => {
								logger.debug(`UUID ${newUUID} created for ${args.objectType}`);
								resolve(newUUID);
							})
							.catch((err) => {
								logger.error(
									'Error while creating uuid exist for ' + args.objectType
								);
								reject(err);
							});
					} else {
						logger.debug(
							`UUID ${resp.hits.hits[0]._source.uuid} found for ${
								args.objectType
							}`
						);
						resolve(resp.hits.hits[0]._source.uuid);
					}
				})
				.catch((err) => {
					logger.error(
						'Error while searching if uuid exist for ' + args.objectType
					);
					reject(err);
				});
		});
	}
}

export default ElasticSearchDatabaseConnector;
