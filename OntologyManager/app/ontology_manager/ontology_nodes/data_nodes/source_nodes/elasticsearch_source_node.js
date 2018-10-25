import SourceNode from './source_node';

import {loggers} from 'winston';
import DatabaseConnectorProxy from '../../../database_connector/database_connector_proxy';
import SourceTypes from './source_types';
const logger = loggers.get('main');

class ElasticsearchSourceNode extends SourceNode {
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
		super.execute(args);
		if (!args.field) args.field = this.field;
		let executeImp = () => {
			args.query = {
				bool: {
					must: [
						{
							match: {
								type: {
									query: this.objectTypeUUID,
									operator: 'and',
								},
							},
						},
					],
				},
			};
			this.executeWithType(args)
				.then((resp) => {
					logger.debug(`Success: ${JSON.stringify(resp)}`);
					const hits = resp.hits.hits;
					let passValue = {};
					hits.forEach((hit, i) => {
						let passHit = {};
						passHit.id = hit._id;
						passHit.type = hit._source.type;
						delete hit._source.type;
						Object.keys(hit._source).forEach(
							(key) => (passHit[key] = hit._source[key])
						);
						passValue[i] = passHit;
					});
					passValue.total = hits.total;
					if (hits.length === 1) {
						Object.keys(passValue[0]).forEach(
							(key) => (passValue[key] = passValue[0][key])
						);
					}
					this.passToSinks(passValue);
				})
				.catch((err) => {
					logger.error(`Fail: ${JSON.stringify(err)}`);
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
	executeWithType(args) {
		if (this.sourceType === SourceTypes.all) {
			return this.all(args);
		} else if (this.sourceType === SourceTypes.allWithField) {
			return this.allWithField(args);
		} else if (this.sourceType === SourceTypes.allWithFieldValuePair) {
			return this.allWithFieldValuePair(args);
		}
	}
	all(args) {
		return DatabaseConnectorProxy.search({
			index: 'data',
			type: 'dataType',
			query: args.query,
		});
	}
	allWithField(args) {
		if (args.field instanceof Array) {
			args.field.forEach((f) =>
				args.query.bool.must.push({
					exists: {
						field: f,
					},
				})
			);
		} else {
			args.query.bool.must.push({
				exists: {
					field: args.field,
				},
			});
		}
		return DatabaseConnectorProxy.search({
			index: 'data',
			type: 'dataType',
			query: args.query,
		});
	}
	allWithFieldValuePair(args) {
		if (
			args.field instanceof Array &&
			args.value instanceof Array &&
			args.field.length === args.value.length
		) {
			args.field.forEach((field, i) => {
				let fieldValuePair = {
					match: {},
				};
				fieldValuePair.match[field] = args.value[i];
				args.query.bool.must.push(fieldValuePair);
			});
		} else if (
			!(args.field instanceof Array) &&
			!(args.value instanceof Array)
		) {
			let fieldValuePair = {
				match: {},
			};
			fieldValuePair.must[args.field] = args.value;
			args.query.bool.must.push(fieldValuePair);
		} else {
			logger.error(
				`${args.field} has not same number of element with ${args.value}
				`
			);
			throw TypeError;
		}
		return DatabaseConnectorProxy.search({
			index: 'data',
			type: 'dataType',
			query: args.query,
		});
	}
}

export default ElasticsearchSourceNode;
