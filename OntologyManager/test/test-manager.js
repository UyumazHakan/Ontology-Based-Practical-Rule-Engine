import 'chai/register-should';
const winston = require('winston');
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
		it('should be alive elastic search with default settings', function(done) {
			let connector = new ElasticSearchDatabaseConnector(config.database);
			connector.should.have.property('isAlive');
			setTimeout(() => {
				connector.isAlive.should.be.equal(true);
				done();
			}, 1000);
		});
	});
	describe('Ping', function() {
		it('should ping elasticsearch with default settings', function() {
			let connector = new ElasticSearchDatabaseConnector(config.database);
			connector.ping(function(err) {
				if (err) throw Error();
			});
		});
	});
});

import ElasticsearchSinkNode from '../app/ontology_manager/ontology_nodes/data_nodes/sink_nodes/elasticsearch_sink_node';

describe('OntologyNodes', function() {
	beforeEach(function() {
	});
	describe('SinkNode', function() {
		describe('ElasticsearchSinkNode', function() {
			it('should create new object with one field in database', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSinkNode({
					sinkType: 'create',
					objectType: 'test_type',
					field: 'test_field',
				});
				node.execute({value: 'test_value'});
				setTimeout(done, 10000);
			});
			it('should create new object with two fields in database', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSinkNode({
					sinkType: 'create',
					objectType: 'test_type',
					field: ['test_field1', 'test_field2'],
				});
				 node.execute({value: ['test_value1', 'test_value2']});
				setTimeout(done, 10000);
			});
		});
	});
});
