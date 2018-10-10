import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';
import ReturnNode
	from '../app/ontology_manager/ontology_nodes/test_nodes/return_node';
import ElasticsearchSinkNode
	from '../app/ontology_manager/ontology_nodes/data_nodes/sink_nodes/elasticsearch_sink_node';
import ElasticsearchSourceNode
	from '../app/ontology_manager/ontology_nodes/data_nodes/source_nodes/elasticsearch_source_node';
import MapNode
	from '../app/ontology_manager/ontology_nodes/manipulation_nodes/map_node';
import FilterNode
	from '../app/ontology_manager/ontology_nodes/manipulation_nodes/filter_node';
import {loadNode} from '../app/ontology_manager/ontology/ontology_load';
import ReduceNode
	from '../app/ontology_manager/ontology_nodes/manipulation_nodes/reduce_node';

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
					field: ['test_field1', 'test_field2'],
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" and "test_field2" default fields', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithField',
					objectType: 'test_type',
					field: ['test_field1', 'test_field2'],
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
					field: ['test_field1', 'test_field2'],
					value: ['test_value1', 'test_value2'],
				});
				setTimeout(done, 10000);
			});
			it('should get all "test_type" objects with "test_field1" "test_value1" and "test_field2" "test_value2" default fields and values', function(done) {
				this.timeout(15000);
				let node = new ElasticsearchSourceNode({
					sourceType: 'allWithFieldValuePair',
					objectType: 'test_type',
					field: ['test_field1', 'test_field2'],
				});
				node.execute({
					value: ['test_value1', 'test_value2'],
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
				sourceMap: ['from1', 'from2'],
				sinkMap: ['to1', 'to2'],
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
				sourceMap: ['from1', 'toBeEmpty'],
				sinkMap: ['to1', []],
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
				sourceMap: ['from1'],
				sinkMap: ['to1'],
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
				sourceMap: ['from1'],
				sinkMap: [['to1', 'to2']],
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
				sourceMap: [['many1', 'many2']],
				sinkMap: [['one']],
			});
			node.addSink(simpleReturnNode);
			node.execute({
				many1: 'test_value1',
				many2: 'test_value2',
			});
			let value = simpleReturnNode.lastValue;

			value.should.to.deep.equal({
				one: ['test_value1', 'test_value2'],
			});
		});
		it('should map one-to-many field with function', function() {
			let node = new MapNode({
				sourceMap: ['from1'],
				sinkMap: [['to1', 'to2']],
				mapFunction: (args) => 'mapped',
			});
			node.addSink(simpleReturnNode);
			node.execute({
				from1: 'test_value1',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to1: 'mapped',
				to2: 'mapped',
			});
		});
		it('should map many-to-one field with function', function() {
			let node = new MapNode({
				sourceMap: [['many1', 'many2']],
				sinkMap: [['one']],

				mapFunction: (args) => 'mapped',
			});
			node.addSink(simpleReturnNode);
			node.execute({
				many1: 'test_value1',
				many2: 'test_value2',
			});
			let value = simpleReturnNode.lastValue;

			value.should.to.deep.equal({
				one: ['mapped', 'mapped'],
			});
		});
	});
	describe('FilterNode', function() {
		it('should filter only one default field', function() {
			let node = new FilterNode({
				field: 'test_field',
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
			});
			node.addSink(simpleReturnNode);
			node.execute({
				field: ['test_field1', 'test_field2'],
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
				filter: (value) => value > 4,
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
		it('should saveNode itself', function() {
			let node = new FilterNode({
				filter: (value) => value > 4,
				field: 'nonExisting',
			});
			node.addSink(simpleReturnNode);
			node.saveNode();
		});
		it('should loadNode saved  object', function() {
			this.timeout(3000);
			let node = new FilterNode({
				filter: (value) => value > 4,
				field: 'nonExisting',
			});

			node.addSink(simpleReturnNode);
			simpleReturnNode.saveNode();
			node.saveNode();

			return new Promise((resolve, reject) => {
				setTimeout(() => {
					loadNode({
						id: node.id,
					})
						.then(resolve)
						.catch(reject);
				}, 1000);
			}).should.eventually.be.like({
				id: node.id,
				name: node.name,
				field: node.field,
			});
		});
	});
	describe('ReduceNode', function() {
		it('should reduce only one default field', function() {
			let node = new ReduceNode({
				field: 'test_field',
				reduceFunction: (acc, cur) => acc + cur,
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
				reduceFunction: (acc, cur) => acc + cur,
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
				reduceFunction: (acc, cur) => acc + cur,
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
