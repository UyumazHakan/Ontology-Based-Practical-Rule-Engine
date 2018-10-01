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
import ElasticsearchSourceNode from '../app/ontology_manager/ontology_nodes/data_nodes/source_nodes/elasticsearch_source_node';
import MapNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/map_node'

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
	describe('SourceNode', function() {
		describe('ElasticsearchSourceNode', function() {
			it('should get all "test_type" objects', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'all',
					objectType: 'test_type',
				});
				node.execute({});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field" field', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithField',
					objectType: 'test_type',
				});
				node.execute({
					field: 'test_field',
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field" default field', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithField',
					objectType: 'test_type',
					field: 'test_field',
				});
				node.execute({});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" and "test_field2" fields', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithField',
					objectType: 'test_type',
				});
				node.execute({
					field: [
						'test_field1',
						'test_field2',
					],
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" and "test_field2" default fields', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithField',
					objectType: 'test_type',
					field: [
						'test_field1',
						'test_field2',
					],
				});
				node.execute({});
				setTimeout(done, 10000);
			});

			it('should get all "test_type" objects with "test_field", "test_value" field and value', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithFieldValuePair',
					objectType: 'test_type',
				});
				node.execute({
					field: 'test_field',
					value: 'test_value',
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field" "test_value" default field and value', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithFieldValuePair',
					objectType: 'test_type',
					field: 'test_field',
				});
				node.execute({
					value: 'test_value',
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" "test_value1" and "test_field2" "test_value2" fields and values', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithFieldValuePair',
					objectType: 'test_type',
				});
				node.execute({
					field: [
						'test_field1',
						'test_field2',
					],
					value: [
						'test_value1',
						'test_value2',
					],
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" "test_value1" and "test_field2" "test_value2" default fields and values', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithFieldValuePair',
					objectType: 'test_type',
					field: [
						'test_field1',
						'test_field2',
					],
				});
				node.execute({
					value: [
						'test_value1',
						'test_value2',
					],
				});
				setTimeout(done, 10000);
			});
		});
	});
	describe('MapNode', function() {
		it('should map one-to-one field', function() {
			let node = new MapNode({
				sourceMap: 'from',
				sinkMap: 'to',
			});
			node.execute({
				from: 'test_value',
			});
		});
		it('should map two different field', function() {
			let node = new MapNode({
				sourceMap: [
					'from1',
					'from2',
				],
				sinkMap: [
					'to1',
					'to2',
				],
			});
			node.execute({
				from1: 'test_value1',
				from2: 'test_value2',
			});
		});
		it('should map drop empty sinks  field', function() {
			let node = new MapNode({
				sourceMap: [
					'from1',
					'toBeEmpty',
				],
				sinkMap: [
					'to1',
					[],
				],
			});
			node.execute({
				from1: 'test_value1',
				toBeEmpty: 'test_value2',
			});
		});
		it('should map by leaving non-defined sources field', function() {
			let node = new MapNode({
				sourceMap: [
					'from1',
				],
				sinkMap: [
					'to1',
				],
			});
			node.execute({
				from1: 'test_value1',
				nonDefined: 'test_value2',
			});
		});
		it('should map one-to-many field', function() {
			let node = new MapNode({
				sourceMap: [
					'from1',
				],
				sinkMap: [
					[
						'to1',
						'to2',
					],
				],
			});
			node.execute({
				from1: 'test_value1',
			});
		});
		it('should map many-to-one field', function() {
			let node = new MapNode({
				sourceMap: [
					[
						'many1',
						'many2',
					],
				],
				sinkMap: [
					[
						'one',
					],
				],
			});
			node.execute({
				many1: 'test_value1',
				many2: 'test_value2',
			});
		});
	});
});
