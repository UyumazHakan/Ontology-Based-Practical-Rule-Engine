import {loggers} from 'winston';

import DatabaseConnector from './database_connector';

import elasticsearch from 'elasticsearch';

const logger = loggers.get('main');

/**
 *
 */
class ElasticSearchDatabaseConnector extends DatabaseConnector {
	/**
	 *
	 */
	connect() {
		this.client = new elasticsearch.Client({
			host: `${this.host}:${this.port}`,
			log: this.logLevel,
		});
		this.ping();
	}


	/**
	 *
	 */
	ping(callback) {
		this.client.ping({
			requestTimeout: 1000,
		}, (error) => {
			if (error) {
				logger.error('Could not ping elasticsearch');
				this.isAlive = false;
			} else {
				logger.silly('Ping to elasticsearch is successful');
				this.isAlive = true;
			}
			if (callback !== undefined) callback(error);
		});
	}
	create(index, type, body, onFailCallback) {
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.createBuffer.push({
					'index': index,
					'type': type,
					'body': body,
					'onFailCallback': onFailCallback,
				});
			}
		};
		return new Promise((resolve, reject) => {
			if (!this.isAlive) {
				logger.error(`Elastic search is not alive, appended in the create 
				buffer index: ${index}, type: ${type}, query: ${query}`);
				onError();
				reject('Elasticsearch is not alive, appended in the create buffer');
			}
			this.client.create({
				index: index,
				type: type,
				body: body,
			}).then(function(resp) {
				logger.debug(`Created: ${resp}`);
				resolve(resp);
			}, function(err) {
				logger.error(err.message);
				onError();
				reject(err);
			});
		});
	}
	search(index, type, query, onFailCallback) {
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.searchBuffer.push({
					'index': index,
					'type': type,
					'query': query,
					'onFailCallback': onFailCallback,
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
			this.client.search({
				index: index,
				type: type,
				body: {
					query: query,
				},
			}).then(function(resp) {
				logger.debug(`Searched: ${resp}`);
				resolve(resp);
			}, function(err) {
				logger.error(err.message);
				onError();
				reject(err);
			});
		});
	}
	update(index, type, body, id, onFailCallback) {
		let onError = () => {
			if (onFailCallback !== undefined) {
				this.updateBuffer.push({
					'index': index,
					'type': type,
					'body': body,
					'id': id,
					'onFailCallback': onFailCallback,
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
			this.client.update({
				index: index,
				type: type,
				id: id,
				body: body,
			}).then(function(resp) {
				logger.debug(`Updated: ${resp}`);
				resolve(resp);
			}, function(err) {
				logger.error(err.message);
				onError();
				reject(err);
			});
		});
	}
}

export default ElasticSearchDatabaseConnector;
