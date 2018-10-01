import OntologyNode from '../ontology_node';
import {loggers} from 'winston';

const logger = loggers.get('main');

class FilterNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.field = args.field;
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
		let filterField = args.field ? args.field : this.field;
		let executeImp = (field) => {
			if (!args[field]) return;
			else if (args[field] instanceof Array) {
				args[field] = args[field].filter(this.filterFunction);
			} else {
				const err = `${args} does not have ${field} as an array`;
				logger.error(err);
				throw Error(err);
			}
		};
		if (filterField instanceof Array) {
			filterField.forEach(executeImp);
		} else {
			executeImp(filterField);
		}
		this.passToSinks(args);
	}
}

export default FilterNode;
