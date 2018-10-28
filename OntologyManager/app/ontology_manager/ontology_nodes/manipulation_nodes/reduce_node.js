import OntologyNode from '../ontology_node';
import {loggers} from 'winston';
import {deserialize} from '../../../utils';
import serialize from 'serialize-javascript';

const logger = loggers.get('main');

/**
 * Node for reducing data
 */
class ReduceNode extends OntologyNode {
	/**
	 * Reducing function
	 * @typedef {function} reduceFn
	 * @param {any} source
	 * @return {any}
	 */

	/**
	 * Serialized reducing function
	 * @typedef {string} serializedReduceFn
	 */
	/**
	 *  Creates a reduce node
	 * @param {Object} args All arguments
	 * @param {string[]} args.field Fields to be reduced
	 * @param {reduceFn | serializedReduceFn} [args.mFn] Mapping function to be applied to source
	 */
	constructor(args) {
		super(args);
		this.field = args.field;
		if (args.initial) this.initial = args.initial;
		this.fn = args.mFn;
	}
	/**
	 * Sets reducing function
	 * @param  {reduceFn | serializedReduceFn} args Function to add
	 */
	set fn(args) {
		if (args && typeof args === 'function') this.mFn = args;
		else if (typeof args === 'string')
			this.mFn = deserialize(args).fn || deserialize(args).mFn;
		else logger.error(`${args} is not a function`);
	}
	/**
	 * Gets reducing function
	 * @return {reduceFn}
	 */
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
		let reduceField = this.field;
		let executeImp = (field) => {
			if (!args[field]) return;
			else if (args[field] instanceof Array) {
				args[field] = this.initial
					? args[field].reduce(this.fn, this.initial)
					: args[field].reduce(this.fn);
			} else {
				const err = `${args} does not have ${field} as an array`;
				logger.error(err);
				throw Error(err);
			}
		};
		if (reduceField instanceof Array) reduceField.forEach(executeImp);
		else executeImp(reduceField);

		this.passToSinks(args);
	}
}

export default ReduceNode;
