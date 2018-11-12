import OntologyNode from '../ontology_node';
import {loggers} from 'winston';
import serialize from 'serialize-javascript';
import {deserialize} from '../../../utils';

const logger = loggers.get('main');

class FilterNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.field = args.field;
		this.fn = args.mFn;
	}

	set fn(args) {
		if (args && typeof args === 'function') this.mFn = args;
		else if (typeof args === 'string')
			this.mFn = deserialize(args).fn || deserialize(args).mFn;
		else logger.error(`${args} is not a function`);
	}
	get fn() {
		return this.mFn;
	}
	saveNode(args) {
		if (!args) args = {};
		args.mFn = serialize({mFn: this.mFn});
		super.saveNode(args);
	}
	execute(args) {
		super.execute(args);
		let filterField = args.field || this.field;
		let executeImp = (field) => {
			if (!args[field]) return;
			else if (args[field] instanceof Array) {
				args[field] = args[field].filter(this.fn);
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
