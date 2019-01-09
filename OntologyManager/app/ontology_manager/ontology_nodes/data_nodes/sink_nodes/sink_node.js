import OntologyNode from '../../ontology_node';
import SinkTypes from './sink_types';

import {loggers} from 'winston';
import SinkType from './sink_types';

const logger = loggers.get('main');
/**
 * Generic sink node
 * @extends OntologyNode
 */
class SinkNode extends OntologyNode {
	/**
	 * Creates a generic sink node
	 * @param {Object} args All arguments
	 * @param {SinkType | SinkTypeEnum} args.sinkType Type of the sink
	 */
	constructor(args) {
		super(args);
		if (args.sinkType) {
			if (args.sinkType.name) args.sinkType = args.sinkType.name;
			this.sinkType =
				args.sinkType instanceof SinkType
					? args.sinkType
					: SinkType.enumValueOf(args.sinkType);
		}
	}
	/**
	 * Saves sink node
	 * @param {Object} [args] Arguments to be saved
	 */
	saveNode(args) {
		if (!args) args = {};
		if (this.sinkType) args.sinkType = this.sinkType.name;
		super.saveNode(args);
	}
	/**
	 * Execute every sink node after caching
	 * @param {Object} args Arguments to be sent to sink nodes
	 * @param {OntologyNode~passToSinksCallback} [args.callback] The callback function to be called before passing to sinks
	 */
	passToSinks(args) {
		if (args.callback) args.callback(args);
		delete args.callback;

		if (args._cacheFn) {
			const cacheFn = args._cacheFn;
			delete args._cacheFn;
			cacheFn(args);
		}
		super.passToSinks(args);
	}
}

export default SinkNode;
