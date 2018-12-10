import FlowCachingStrategy from './flow_caching_strategy';
import {loggers} from 'winston';
import {stringify} from '../../../utils';
import deepEqual from 'deep-equal';

let logger = loggers.get('main');

/**
 * Simple caching strategy for flows. Caches data after receiving specified amount of same data and result pair.
 */
class SimpleFlowCachingStrategy extends FlowCachingStrategy {
	/**
	 * Constructor of simple flow caching strategy.
	 * @param {Object} args All arguments
	 * @param {number} args.count Defines how many times same data and result pair should be received for caching
	 * @param {Object.<Object, {count: number, result: Object}>} [args.cacheCounter] Cache counter object if this strategy is loaded
	 */
	constructor(args) {
		logger.debug(`SimpleFlowCachingStrategy(${stringify(args)})`);
		super(args);
		this.count = args.count;
		/**
		 * Keeps data and result with how many times its received. Number of times will be -1 if it receive any different data
		 * @type {Object.<Object, {count: number, result: Object}>}
		 */
		this.cacheCounter = args.cacheCounter ? args.cacheCounter : [];
	}

	/**
	 * Executes simple caching strategy
	 * @param {Object} args Data received by the flow
	 * @return {CachingFunction}
	 */
	execute(args) {
		return (result) => {
			delete args._cacheFn;
			logger.silly(`New result: ${stringify(result)}`);
			const cacheConterPoint = this.cacheCounter.find((e) =>
				deepEqual(e.received, args)
			);
			if (!cacheConterPoint) {
				this.cacheCounter.push({received: args, result: result, count: 1});
				return;
			}

			logger.silly(`Existing result: ${stringify(cacheConterPoint.result)}`);
			if (cacheConterPoint.count === -1) return;

			if (!deepEqual(cacheConterPoint.result, result)) {
				logger.debug('Non matching. Setting counter to -1');
				cacheConterPoint.count = -1;
				return;
			}
			cacheConterPoint.count++;
			if (this.count <= cacheConterPoint.count)
				this.cache.push({received: args, result: result});
		};
	}
	minify(args) {
		const result = super.minify(args);
		result.name = 'SimpleFlowCachingStrategy';
		result.count = this.count;
		result.cacheCounter = this.cacheCounter;
		return result;
	}
}

export default SimpleFlowCachingStrategy;
