import {loggers} from 'winston';
let logger = loggers.get('main');
import clone from 'clone';
import {hash} from '../../../utils';

/**
 * Class to be extended for creating concrete flow caching strategies
 */
class FlowCachingStrategy {
	/**
	 * Constructor of flow caching strategy. Cannot be created directly.
	 * @param {Object} args All arguments
	 */
	constructor(args) {
		if (new.target === FlowCachingStrategy) {
			let errMessage =
				'Cannot construct FlowCachingStrategy instances directly';
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.cache = args.cache ? args.cache : {};
	}

	/**
	 * @name CachingFunction
	 * @param {Object} args Resulting data to be cached
	 */
	/**
	 * Method to be called after data received by the flow
	 * @param {Object} args Data received by the flow
	 * @return {Object | CachingFunction} Returns cached object or cache function
	 */
	receive(args) {
		args = clone(args);
		delete args._cacheFn;
		const argsHash = hash(args);
		return this.cache[argsHash] ? this.cache[argsHash] : this.execute(argsHash);
	}

	/**
	 * Executes the caching strategy. Should be called by extending in concrete strategy class
	 * @param {Object} args Received data to be cached
	 */
	execute(args) {
		let errMessage = 'You need to use execute method of the subclasses';
		logger.error(errMessage);
		throw new TypeError(errMessage);
	}
	minify(args) {
		return {cache: this.cache};
	}
}

export default FlowCachingStrategy;
