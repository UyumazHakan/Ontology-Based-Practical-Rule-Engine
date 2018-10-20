import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';
import Ontology from '../../app/ontology_manager/ontology/ontology';
import ReturnNode from '../../app/ontology_manager/ontology_nodes/test_nodes/return_node';
import MapNode from '../../app/ontology_manager/ontology_nodes/manipulation_nodes/map_node';
import OntologyRule from '../../app/ontology_manager/ontology/ontology_rule';
import ReduceNode
	from '../../app/ontology_manager/ontology_nodes/manipulation_nodes/reduce_node';
import {loadOntology} from '../../app/ontology_manager/ontology/ontology_load';

describe('Ontology', function() {
	let simpleReturnNode = new ReturnNode({});
	beforeEach(function() {
		simpleReturnNode.reset();
	});
	describe('execute', function() {
		it('should execute with one rule', function() {
			let mapNode = new MapNode({
				sourceMap: 'from',
				sinkMap: 'to',
			});
			mapNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology_rule',
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
			let ontology = new Ontology({
				name: 'test_ontology',
				owner: 'test_user',
				rules: [rule],
			});
			rule.execute({
				from: 2,
			});
			ontology.sinkNodes.should.exist.and.have.lengthOf(1);
			ontology.sinkNodes[0].should.have.property('lastValue').deep.equal({
				to: 2,
			});
		});
	});
	describe('load and save', function() {

		it('should load saved ontology', function() {
			this.timeout(3000);			let mapNode = new MapNode({
				sourceMap: 'from',
				sinkMap: 'to',
			});
			mapNode.addSink(simpleReturnNode);
			let rule = new OntologyRule({
				name: 'test_ontology_rule',
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
			let ontology = new Ontology({
				name: 'test_ontology',
				owner: 'test_user',
				rules: [rule],
			});
			ontology.save();
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					loadOntology({
						id: ontology.id,
					})
						.then(resolve)
						.catch(reject);
				}, 1000);
			}).should.eventually.be.like({
				id: ontology.id,
				name: ontology.name,
				owner: ontology.owner,
			}).and.has.property('rules').lengthOf(ontology.rules.length);
		});
	})
});
