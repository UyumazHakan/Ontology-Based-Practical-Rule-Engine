import 'chai/register-should';
const winston = require('winston');
const logger = winston.loggers.add('main', {
	level: config.get('logger.level'),
	format: winston.format.json(),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File(
			{filename: `${config.get('logger.dir')}error.log`, level: 'error'}
		),
		new winston.transports.File(
			{filename: `${config.get('logger.dir')}combined.log`}
		),
	],
});
import DatabaseConnector
	from '../app/ontology_manager/database_connector/database_connector';
import ElasticSearchDatabaseConnector
	from '../app/ontology_manager/database_connector/elastic_search_database_connector';
import config from 'config';

describe('Manager', function() {
	it('should create new ontology', function() {
	});
});
describe('DatabaseConnector', function() {
	describe('Creation', function() {
		it('should throw error when creating base connector', function() {
			let fn = function() {
				new DatabaseConnector(config.database);
			};
			fn.should.throw(TypeError);
		});
		it('should create a elasticsearch connector object with default' +
			' settings', function() {
			let fn = function() {
				new ElasticSearchDatabaseConnector(config.database);
			};
			fn.should.not.throw();
		});
	});
	describe('Connection', function() {
		it('should be alive elastic search with default settings', function() {
			let connector = new ElasticSearchDatabaseConnector(config.database).should.have
				.property('isAlive');
			setTimeout(() => {
				connector.isAlive.should.be.equal(true);
			}, 3000);
		});
	});
	describe('Ping', function() {
		it('should ping elasticsearch with default settings', function() {
			let connector = new ElasticSearchDatabaseConnector(config.database);
			connector.ping(function(err) {
				err.should.not.exist();
			});
		});
	});
});
