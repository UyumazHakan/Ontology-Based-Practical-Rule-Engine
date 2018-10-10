import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';
import ReturnNode from '../app/ontology_manager/ontology_nodes/test_nodes/return_node';
import MapNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/map_node';
import OntologyRule from '../app/ontology_manager/ontology/ontology_rule';
import ReduceNode from '../app/ontology_manager/ontology_nodes/manipulation_nodes/reduce_node';
import {loadRule} from '../app/ontology_manager/ontology/ontology_load';

describe('OntologyRule', function() {
	let simpleReturnNode = new ReturnNode({});
	beforeEach(function() {
		simpleReturnNode.reset();
	});
	describe('execute', function() {
		it('should execute with one map node', function() {
			let mapNode = new MapNode({
				sourceMap: 'from',
				sinkMap: 'to',
			});
			mapNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology',
				owner: 'test_user',
				nodes: [
					{
						type: 'MapNode',
						value: mapNode,
						source: true,
					},
					{
						type: 'ReturnNode',
						value: simpleReturnNode,
						sink: true,
					},
				],
			});
			rule.execute({
				from: 'test_value',
			});
			simpleReturnNode.lastValue.should.deep.equal({
				to: 'test_value',
			});
		});
		it('should execute with map and reduce node', function() {
			let mapNode = new MapNode({
				sourceMap: 'test_field',
				sinkMap: 'test_field',
				mapFunction: (e) => e * e,
			});
			let reduceNode = new ReduceNode({
				field: 'test_field',
				reduceFunction: (acc, e) => acc + e,
			});
			mapNode.addSink(reduceNode);
			reduceNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology',
				owner: 'test_user',
				nodes: [
					{
						type: 'MapNode',
						value: mapNode,
						source: true,
					},
					{
						type: 'ReduceNode',
						value: reduceNode,
					},
					{
						type: 'ReturnNode',
						value: simpleReturnNode,
						sink: true,
					},
				],
			});
			rule.execute({
				test_field: [1, 2, 3],
			});
			simpleReturnNode.lastValue.should.deep.equal({
				test_field: 14,
			});
		});
		it('should execute with multiple sources', function() {
			let mapNode1 = new MapNode({
				sourceMap: 'test_field',
				sinkMap: 'test_field',
				mapFunction: (e) => e * e,
			});
			let mapNode2 = new MapNode({
				sourceMap: 'test_field',
				sinkMap: 'test_field',
				mapFunction: (e) => e * e * e,
			});
			let reduceNode = new ReduceNode({
				field: 'test_field',
				reduceFunction: (acc, e) => acc + e,
			});
			mapNode1.addSink(reduceNode);
			mapNode2.addSink(reduceNode);
			reduceNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology',
				owner: 'test_user',
				nodes: [
					{
						type: 'MapNode',
						value: mapNode1,
						source: true,
					},
					{
						type: 'MapNode',
						value: mapNode2,
						source: true,
					},
					{
						type: 'ReduceNode',
						value: reduceNode,
					},
					{
						type: 'ReturnNode',
						value: simpleReturnNode,
						sink: true,
					},
				],
			});
			rule.execute({
				test_field: [1, 2, 3],
			});
			simpleReturnNode.valueArray.should.deep.equal([
				{
					test_field: 14,
				},
				{
					test_field: 36,
				},
			]);
		});
		it('should execute with multiple same sinks', function() {
			let mapNode = new MapNode({
				sourceMap: 'test_field',
				sinkMap: 'test_field',
				mapFunction: (e) => e * e,
			});
			let reduceNode = new ReduceNode({
				field: 'test_field',
				reduceFunction: (acc, e) => acc + e,
			});
			mapNode.addSink(reduceNode);
			mapNode.addSink(simpleReturnNode);
			reduceNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology',
				owner: 'test_user',
				nodes: [
					{
						type: 'MapNode',
						value: mapNode,
						source: true,
					},
					{
						type: 'ReduceNode',
						value: reduceNode,
					},
					{
						type: 'ReturnNode',
						value: simpleReturnNode,
						sink: true,
					},
				],
			});
			rule.execute({
				test_field: [1, 2, 3],
			});
			simpleReturnNode.valueArray.should.deep.equal([
				{
					test_field: 14,
				},
				{
					test_field: [1, 4, 9],
				},
			]);
		});
	});
	describe('save and load', function() {
		it('should load saved rule', function() {
			this.timeout(3000);
			let mapNode = new MapNode({
				sourceMap: 'test_field',
				sinkMap: 'test_field',
				mapFunction: (e) => e * e,
			});
			let reduceNode = new ReduceNode({
				field: 'test_field',
				reduceFunction: (acc, e) => acc + e,
			});
			mapNode.addSink(reduceNode);
			mapNode.addSink(simpleReturnNode);
			reduceNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology',
				owner: 'test_user',
				nodes: [
					{
						type: 'MapNode',
						value: mapNode,
						source: true,
					},
					{
						type: 'ReduceNode',
						value: reduceNode,
					},
					{
						type: 'ReturnNode',
						value: simpleReturnNode,
						sink: true,
					},
				],
			});
			rule.save();
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					loadRule({
						id: rule.id,
					})
						.then(resolve)
						.catch(reject);
				}, 1000);
			}).should.eventually.be
				.like({
					id: rule.id,
					name: rule.name,
					owner: rule.owner,
				})
				.and.has.property('nodes')
				.lengthOf(rule.nodes.length);
		});
	});
});
