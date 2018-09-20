import OntologyNode from 'app/ontology_manager/ontology_nodes/ontology_node';
import {loggers} from 'winston';

const logger = loggers.get('main');

class FilterNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.filterFunction = args.filterFunction;
	}
	set filterFunction(filter) {
		if (typeof filter === 'function') {
			this.mFilterFunction = filter;
		} else {
			logger.error(`${filter} is not a function`);
		}
	}
	get filterFunction() {
		return this.mFilterFunction;
	}
	execute(args) {
		super.execute(args);
		args['dataStream'] = args['dataStream'].filter(this.filterFunction);
		this.passToSinks(args);
	}
}

export default FilterNode;
