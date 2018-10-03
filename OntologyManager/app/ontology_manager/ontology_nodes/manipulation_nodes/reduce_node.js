import OntologyNode from '../ontology_node';
import {loggers} from 'winston';

const logger = loggers.get('main');

class ReduceNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.field = args.field;
		if (args.initial) this.initial = args.initial;
		this.reduceFunction = args.reduceFunction;
	}
	set reduceFunction(reduce) {
		if (typeof reduce === 'function') {
			this.mReduceFunction = reduce;
		} else {
			logger.error(`${reduce} is not a function`);
		}
	}
	get reduceFunction() {
		return this.mReduceFunction;
	}
	execute(args) {
		super.execute(args);
		let reduceField = args.field ? args.field : this.field;
		let executeImp = (field) => {
			if (!args[field]) return;
			else if (args[field] instanceof Array) {
				args[field] = this.initial ?
					args[field].reduce(this.reduceFunction, this.initial) :
					args[field].reduce(this.reduceFunction);
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
