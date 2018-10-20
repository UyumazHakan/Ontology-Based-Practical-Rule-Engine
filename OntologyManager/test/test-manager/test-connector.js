import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';
import DatabaseConnector
	from '../../app/ontology_manager/database_connector/database_connector';
import config from 'config';
import ElasticSearchDatabaseConnector
	from '../../app/ontology_manager/database_connector/elastic_search_database_connector';
describe('DatabaseConnector', function() {
	describe('Creation', function() {
		it('should throw error when creating base connector', function() {
			let fn = function() {
				new DatabaseConnector(config.database);
			};
			fn.should.throw(TypeError);
		});
		it(
			'should create a elasticsearch connector object with default' +
			' settings',
			function() {
				let fn = function() {
					new ElasticSearchDatabaseConnector(config.database);
				};
				fn.should.not.throw();
			}
		);
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
})
