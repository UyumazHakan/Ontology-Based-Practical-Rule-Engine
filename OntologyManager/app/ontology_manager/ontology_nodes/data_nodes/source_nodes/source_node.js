import OntologyNode from '../../ontology_node';

import {loggers} from 'winston';
import SourceType from './source_types';

const logger = loggers.get('main');
/**
 * Generic source node
 * @extends OntologyNode
 */
class SourceNode extends OntologyNode {
	/**
	 * Creates a generic source node
	 * @param {Object} args All arguments
	 * @param {SourceType | SourceTypeEnum} args.sinkType Type of the source
	 */
	constructor(args) {
		super(args);
		if (args.sourceType.name) args.sourceType = args.sourceType.name;
		this.sourceType = SourceType.enumValueOf(args.sourceType);
	}
	set cache(args) {
		this._cache = true;
		this.cacheStrategy = args.cacheStrategy;
		this.flowSinks = args.sinks;
	}
	/**
	 * Saves source node
	 * @param {Object} [args] Arguments to be saved
	 */
	saveNode(args) {
		if (!args) args = {};
		args.sourceType = this.sourceType.name;
		args._cache = undefined;
		args.cacheFn = undefined;
		args.flowSinks = undefined;
		super.saveNode(args);
	}

	/**
	 * Execute every sink node by checking caching is active
	 * @param {Object} args Arguments to be sent to sink nodes
	 * @param {OntologyNode~passToSinksCallback} [args.callback] The callback function to be called before passing to sinks
	 */
	passToSinks(args) {
		if (args.callback) args.callback(args);
		if (this._cache) {
			const cacheResponse = this.cacheStrategy.receive(args);
			if (typeof cacheResponse !== 'function') {
				this.flowSinks.forEach((sink) => sink.execute(cacheResponse));
				return;
			} else args._cacheFn = (args) => cacheResponse(args);
		}
		delete args.callback;
		super.passToSinks(args);
	}
}

export default SourceNode;
