import 'chai/register-should';
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
import MapNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/map_node';
import FilterNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/filter_node';
import ReduceNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/reduce_node';
import ReturnNode from '../app/ontology_manager/ontology_nodes/test_nodes/return_node';

describe('OntologyNodes', function() {
	let simpleReturnNode = new ReturnNode({});
	beforeEach(function() {
		simpleReturnNode.reset();
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
			node.addSink(simpleReturnNode);
			node.execute({
				from: 'test_value',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to: 'test_value',
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
			node.addSink(simpleReturnNode);
			node.execute({
				from1: 'test_value1',
				from2: 'test_value2',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to1: 'test_value1',
				to2: 'test_value2',
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
			node.addSink(simpleReturnNode);
			node.execute({
				from1: 'test_value1',
				toBeEmpty: 'test_value2',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to1: 'test_value1',
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
			node.addSink(simpleReturnNode);
			node.execute({
				from1: 'test_value1',
				nonDefined: 'test_value2',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to1: 'test_value1',
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
			node.addSink(simpleReturnNode);
			node.execute({
				from1: 'test_value1',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to1: 'test_value1',
				to2: 'test_value1',
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
			node.addSink(simpleReturnNode);
			node.execute({
				many1: 'test_value1',
				many2: 'test_value2',
			});
			let value = simpleReturnNode.lastValue;

			value.should.to.deep.equal({
				one: [
					'test_value1',
					'test_value2',
				],
			});
		});
	});
	describe('FilterNode', function() {
		it('should filter only one default field', function() {
			let node = new FilterNode({
				field: 'test_field',
				filterFunction: ((value) => value > 4),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field: [4, 5, 1],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field: [5],
			});
		});
		it('should filter only one field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: 'test_field',
				test_field: [4, 5, 1],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				field: 'test_field',
				test_field: [5],
			});
		});
		it('should not filter non-given field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: 'test_field1',
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field1: [5],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
		});
		it('should filter two default field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: ['test_field1', 'test_field2'],
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field1: [5],
				test_field2: [5, 6],

			});
		});
		it('should filter two field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: ['test_field1','test_field2'],
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				field: ['test_field1', 'test_field2'],
				test_field1: [5],
				test_field2: [5, 6],

			});
		});
		it('should filter overwritten default field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: ['test_field1', 'test_field2'],
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: ['test_field1', 'test_field3'],
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				field: ['test_field1', 'test_field3'],
				test_field1: [5],
				test_field2: [4, 5, 6],
				test_field3: [5, 6],
			});
		});
		it('should filter overwriten default fields with new one field', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: ['test_field1', 'test_field2'],
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: 'test_field1',
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				field: 'test_field1',
				test_field1: [5],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
		});
		it('should filter overwritten default field with new multiple fields', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: 'test_field1',
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: ['test_field1', 'test_field3'],
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				field: ['test_field1', 'test_field3'],
				test_field1: [5],
				test_field2: [4, 5, 6],
				test_field3: [5, 6],
			});
		});
		it('should not fail for non-existing fields', function() {
			let node = new FilterNode({
				filterFunction: ((value) => value > 4),
				field: 'nonExisting',
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
				test_field3: [4, 5, 6],
			});
		});

	});
	describe('ReduceNode', function() {
		it('should reduce only one default field', function() {
			let node = new ReduceNode({
				field: 'test_field',
				reduceFunction: ((acc, cur) => (acc + cur)),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field: [4, 5, 1],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field: 10,
			});
		});
		it('should reduce multiple default field', function() {
			let node = new ReduceNode({
				field: ['test_field1', 'test_field2'],
				reduceFunction: ((acc, cur) => (acc + cur)),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field1: 10,
				test_field2: 15,
			});
		});
		it('should reduce multiple default field with initial value', function() {
			let node = new ReduceNode({
				field: ['test_field1', 'test_field2'],
				initial: 2,
				reduceFunction: ((acc, cur) => (acc + cur)),
			});
			node.addSink(simpleReturnNode);
			node.execute({
				test_field1: [4, 5, 1],
				test_field2: [4, 5, 6],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field1: 12,
				test_field2: 17,
			});
		});
	});
});
