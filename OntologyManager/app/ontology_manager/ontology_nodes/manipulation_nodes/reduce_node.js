import OntologyNode from '../ontology_node';
import {loggers} from 'winston';
import {deserialize} from '../../../utils';
import serialize from 'serialize-javascript';

const logger = loggers.get('main');

class ReduceNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.field = args.field;
		if (args.initial) this.initial = args.initial;
		this.fn = args.fn;
	}
	set fn(args) {
		if (args && typeof args === 'function') {
			this.mFn = args;
		} else if (typeof args === 'string') {
			this.mFn = deserialize(args).fn;
		} else {
			logger.error(`${args} is not a function`);
		}
	}
	get fn() {
		return this.mFn;
	}
	saveNode() {
		super.saveNode({
			fn: serialize({fn: this.mFn}),
		});
	}
	execute(args) {
		super.execute(args);
		let reduceField = args.field ? args.field : this.field;
		let executeImp = (field) => {
			if (!args[field]) return;
			else if (args[field] instanceof Array) {
				args[field] = this.initial ?
					args[field].reduce(this.fn, this.initial) :
					args[field].reduce(this.fn);
			} else {
				const err = `${args} does not have ${field} as an array`;
				logger.error(err);
				throw Error(err);
			}
		};
		if (reduceField instanceof Array) {
			reduceField.forEach(executeImp);
		} else {
			executeImp(reduceField);
		}
		this.passToSinks(args);
	}
}

export default ReduceNode;
