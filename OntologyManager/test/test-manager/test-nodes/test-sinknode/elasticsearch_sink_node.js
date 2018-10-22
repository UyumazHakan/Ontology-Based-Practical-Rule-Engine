import DatabaseConnectorProxy from '../../../../app/ontology_manager/database_connector/database_connector_proxy';
import ElasticsearchSinkNode from '../../../../app/ontology_manager/ontology_nodes/data_nodes/sink_nodes/elasticsearch_sink_node';
function searchElasticSearch(index, type, id) {
	return DatabaseConnectorProxy.search({
		index: index,
		type: type,
		query: {
			terms: {
				_id: [id],
			},
		},
	});
}
import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';

describe('ElasticsearchSinkNode', function() {
	it('should create new object with one field in database with unique id', function(done) {
		this.timeout(15000);
		let node = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		node.execute({
			value: 'test_value',
			callback: (args) => {
				setTimeout(
					() =>
						searchElasticSearch('data', 'dataType', args.id)
							.then((resp) => {
								resp.should.has
									.property('hits')
									.property('hits')
									.lengthOf(1);
								resp.hits.hits[0]._source.should.be.like({
									test_field: 'test_value',
								});
								done();
							})
							.catch(done),
					1000
				);
			},
		});
	});
	it('should create new object with two fields in database', function(done) {
		this.timeout(15000);
		let node = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: ['test_field1', 'test_field2'],
		});
		node.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(
					() =>
						searchElasticSearch('data', 'dataType', args.id)
							.then((resp) => {
								resp.should.has
									.property('hits')
									.property('hits')
									.lengthOf(1);
								resp.hits.hits[0]._source.should.be.like({
									test_field1: 'test_value1',
									test_field2: 'test_value2',
								});
								done();
							})
							.catch(done),
					1000
				);
			},
		});
	});
	it('should create new object with one empty array field', function(done) {
		this.timeout(15000);
		let node = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		node.execute({
			value: [],
			callback: (args) => {
				setTimeout(
					() =>
						searchElasticSearch('data', 'dataType', args.id)
							.then((resp) => {
								resp.should.has
									.property('hits')
									.property('hits')
									.lengthOf(1);
								resp.hits.hits[0]._source.should.be.like({
									test_field: [],
								});
								done();
							})
							.catch(done),
					1000
				);
			},
		});
	});
	it('should create new object with one array field that has one element', function(done) {
		this.timeout(15000);
		let node = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		node.execute({
			value: ['test_value'],
			callback: (args) => {
				setTimeout(
					() =>
						searchElasticSearch('data', 'dataType', args.id)
							.then((resp) => {
								resp.should.has
									.property('hits')
									.property('hits')
									.lengthOf(1);
								resp.hits.hits[0]._source.should.be.like({
									test_field: ['test_value'],
								});
								done();
							})
							.catch(done),
					1000
				);
			},
		});
	});
	it('should create new object with one array field that has multiple element', function(done) {
		this.timeout(15000);
		let node = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		node.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(
					() =>
						searchElasticSearch('data', 'dataType', args.id)
							.then((resp) => {
								resp.should.has
									.property('hits')
									.property('hits')
									.lengthOf(1);
								resp.hits.hits[0]._source.should.be.like({
									test_field: ['test_value1', 'test_value2'],
								});
								done();
							})
							.catch(done),
					1000
				);
			},
		});
	});
	it('should append new data to array and pass current object', function(done) {
		this.timeout(15000);
		let createNode = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		let appendNode = new ElasticsearchSinkNode({
			sinkType: 'append',
			objectType: 'test_type',
			field: 'test_field',
		});
		createNode.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(() => {
					appendNode.execute({
						id: args.id,
						value: 'test_value3',
						callback: (args) =>
							setTimeout(
								() =>
									searchElasticSearch('data', 'dataType', args.id)
										.then((resp) => {
											resp.should.has
												.property('hits')
												.property('hits')
												.lengthOf(1);
											resp.hits.hits[0]._source.should.be.like({
												test_field: [
													'test_value1',
													'test_value2',
													'test_value3',
												],
											});
											done();
										})
										.catch(done),
								1000
							),
					});
				}, 1000);
			},
		});
	});
	it('should append new data array to array and pass current object', function(done) {
		this.timeout(15000);
		let createNode = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		let appendNode = new ElasticsearchSinkNode({
			sinkType: 'append',
			objectType: 'test_type',
			field: 'test_field',
		});
		createNode.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(() => {
					appendNode.execute({
						id: args.id,
						value: ['test_value3', 'test_value4'],
						callback: (args) =>
							setTimeout(
								() =>
									searchElasticSearch('data', 'dataType', args.id)
										.then((resp) => {
											resp.should.has
												.property('hits')
												.property('hits')
												.lengthOf(1);
											resp.hits.hits[0]._source.should.be.like({
												test_field: [
													'test_value1',
													'test_value2',
													'test_value3',
													'test_value4',
												],
											});
											done();
										})
										.catch(done),
								1000
							),
					});
				}, 1000);
			},
		});
	});
	it('should append new data with timestamp to array and pass current object', function(done) {
		this.timeout(15000);
		let createNode = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		let appendNode = new ElasticsearchSinkNode({
			sinkType: 'appendWithTimestamo',
			objectType: 'test_type',
			field: 'test_field',
		});
		createNode.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(() => {
					appendNode.execute({
						id: args.id,
						value: 'test_value3',
						callback: (args) =>
							setTimeout(
								() =>
									searchElasticSearch('data', 'dataType', args.id)
										.then((resp) => {
											resp.should.has
												.property('hits')
												.property('hits')
												.lengthOf(1);
											resp.hits.hits[0]._source.should.be.like({
												test_field: [
													'test_value1',
													'test_value2',
													{value: 'test_value3'},
												],
											});
											resp.hits.hits[0]._source.test_field[2].should.has.property('timestamp');
											done();
										})
										.catch(done),
								1000
							),
					});
				}, 1000);
			},
		});
	});
	it('should replace a field an pass current object', function(done) {
		this.timeout(15000);
		let createNode = new ElasticsearchSinkNode({
			sinkType: 'create',
			objectType: 'test_type',
			field: 'test_field',
		});
		let replaceNode = new ElasticsearchSinkNode({
			sinkType: 'replace',
			objectType: 'test_type',
			field: 'test_field',
		});
		createNode.execute({
			value: ['test_value1', 'test_value2'],
			callback: (args) => {
				setTimeout(() => {
					appendNode.execute({
						id: args.id,
						value: 'test_value3',
						callback: (args) =>
							setTimeout(
								() =>
									searchElasticSearch('data', 'dataType', args.id)
										.then((resp) => {
											resp.should.has
												.property('hits')
												.property('hits')
												.lengthOf(1);
											resp.hits.hits[0]._source.should.be.like({
												test_field: 'test_value3',
											});
											done();
										})
										.catch(done),
								1000
							),
					});
				}, 1000);
			},
		});
	});
});
