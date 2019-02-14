import FlowCachingStrategy from './flow_caching_strategy';
import {loggers} from 'winston';
import {stringify, objectToKey} from '../../../utils';
import clone from 'clone';

let logger = loggers.get('main');

/**
 * Simple caching strategy for flows. Caches data after receiving specified amount of same data and result pair.
 */
class HashlessCachingStrategy extends FlowCachingStrategy {
	/**
	 * Constructor of simple flow caching strategy.
	 * @param {Object} args All arguments
	 * @param {number} args.count Defines how many times same data and result pair should be received for caching
	 * @param {Object.<string, {count: number, result: string}>} [args.cacheCounter] Cache counter object if this strategy is loaded
	 */
	constructor(args) {
		logger.debug(`HashlessCachingStrategy(${stringify(args)})`);
		super(args);
		this.count = args.count;
		/**
		 * Keeps data and result with how many times its received. Number of times will be -1 if it receive any different data
		 * @type {Object.<string, {count: number, result: string}>}
		 */
		this.cacheCounter = args.cacheCounter ? args.cacheCounter : {};
	}

	/**
	 * Method to be called after data received by the flow
	 * @param {Object} args Data received by the flow
	 * @return {Object | CachingFunction} Returns cached object or cache function
	 */
	receive(args) {
		args = clone(args);
		delete args._cacheFn;
		const argsKey = objectToKey(args);
		return this.cache[argsKey] ? this.cache[argsKey] : this.execute(argsKey);
	}
	/**
	 * Executes simple caching strategy
	 * @param {string} argsKey Key of data received by the flow
	 * @return {CachingFunction}
	 */
	execute(argsKey) {
		return (result) => {
			const resultKey = objectToKey(result);
			logger.silly(`New result: ${stringify(result)}`);
			logger.silly(`New result objectToKey: ${stringify(resultKey)}`);
			const cacheConterPoint = this.cacheCounter[argsKey];
			if (!cacheConterPoint) {
				this.cacheCounter[argsKey] = {result: resultKey, count: 1};
				return;
			}
			if (cacheConterPoint.count === -1) {
				logger.debug('This argument has got at least two different values');
				return;
			}
			logger.silly(
				`Existing result objectToKey: ${stringify(cacheConterPoint.result)}`
			);

			if (cacheConterPoint.result !== resultKey) {
				logger.debug('Non matching. Setting counter to -1');
				delete cacheConterPoint.result;
				cacheConterPoint.count = -1;
				return;
			}
			cacheConterPoint.count++;
			if (this.count <= cacheConterPoint.count) {
				delete this.cacheCounter[argsKey];
				this.cache[argsKey] = result;
			}
		};
	}
	minify(args) {
		const result = super.minify(args);
		result.name = 'HashlessCachingStrategy';
		result.count = this.count;
		result.cacheCounter = this.cacheCounter;
		return result;
	}
}

export default HashlessCachingStrategy;
