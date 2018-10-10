import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiAsPromised from 'chai-as-promised';
import chaiLike from 'chai-like';
chai.use(chaiLike);
chai.use(chaiExclude);
chai.use(chaiAsPromised);
import 'chai/register-should';
import DatabaseConnector from '../app/ontology_manager/database_connector/database_connector';
import ElasticSearchDatabaseConnector from '../app/ontology_manager/database_connector/elastic_search_database_connector';
import config from 'config';

describe('Manager', function() {
	it('should create new ontology', function() {});
});

