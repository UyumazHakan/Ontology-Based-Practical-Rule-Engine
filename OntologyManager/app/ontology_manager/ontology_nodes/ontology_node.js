import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import {stringify} from '../../utils';
import uuid from 'uuid/v4';
import clone from 'clone';

import {loggers} from 'winston';
let logger = loggers.get('main');
class OntologyNode {
	constructor(args) {
		if (new.target === OntologyNode) {
			let errMessage = 'Cannot construct OntologyNode' + ' instances directly';
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.id = args.id || uuid();
		this.name = args.name;
		this.sources = [];
		this.sinks = [];
		this.isSaved = args.isSaved || false;
		this._isUpdated = args._isUpdated || args.isUpdated || false;
	}
	get isUpdated() {
		return this._isUpdated;
	}
	addSink(sink) {
		if (!this.sinks.includes(sink)) {
			logger.debug(`Adding sink ${sink} to ${stringify(this)}`);
			this._isUpdated = false;
			this.sinks.push(sink);
			sink.addSource(this);
		}
	}
	addSource(source) {
		if (!this.sources.includes(source)) {
			logger.debug(`Adding source ${source} to ${stringify(this)}`);
			this._isUpdated = false;
			this.sources.push(source);
			source.addSink(this);
		}
	}
	removeSink(sink) {
		if (this.sinks.includes(sink)) {
			logger.debug(`Removing sink ${sink} to ${stringify(this)}`);
			this._isUpdated = false;
			this.sinks.splice(this.sinks.indexOf(sink), 1);
			sink.removeSource(this);
		}
	}
	removeSource(source) {
		if (this.sources.includes(source)) {
			logger.debug(`Removing source ${source} to ${stringify(this)}`);
			this._isUpdated = false;
			this.sources.splice(this.sources.indexOf(source), 1);
			source.removeSink(this);
		}
	}
	// TODO: finish update and create functions
	/**
	 * Callback function to be called after node save is completed or failed
	 * @callback OntologyNode~saveNodeCallback
	 * @param {Error} err Error message
	 * @param {Object} res Response that is sent by database
	 */
	/**
	 * Saves node in database
	 * @param {Object} [args] Extra arguments to be saved
	 * @param {OntologyNode~saveNodeCallback} [args.callback] Callback function to be called after node save is completed or failed
	 */
	saveNode(args) {
		if (!args) args = {};
		let saveObject = args ? Object.assign(this.minify(), args) : this.minify();
		saveObject.nodeType = saveObject.constructor.name;
		delete saveObject.isSaved;
		delete saveObject._isUpdated;
		if (!this.isSaved) {
			DatabaseConnectorProxy.create({
				index: 'node',
				type: 'nodeType',
				body: saveObject,
			})
				.then((res) => {
					logger.debug(`Node saving is successful. ${stringify(res)}`);
					this.isSaved = true;
					this._isUpdated = true;
					if (args.callback) args.callback(null, res);
				})
				.catch((err) => {
					logger.debug(`Node saving is failed. ${stringify(err)}`);
					if (args.callback) args.callback(err, null);
				});
		} else if (!this.isUpdated) {
			DatabaseConnectorProxy.update({
				index: 'node',
				type: 'nodeType',
				body: saveObject,
				id: this.id,
			})
				.then((res) => {
					logger.debug(`Node updating is successful. ${stringify(res)}`);
					this._isUpdated = true;
					if (args.callback) args.callback(null, this);
				})
				.catch((err) => {
					logger.debug(`Node saving is failed. ${stringify(err)}`);
					if (args.callback) args.callback(err, this);
				});
		} else if (args.callback) args.callback(null, this);
	}

	/**
	 * Deletes all sinks and sources of the node
	 * @param {Object} [args] Not used currently
	 */
	reset(args) {
		logger.debug(`Resetting ${stringify(this)}`);
		this.sinks.forEach((sink) => this.removeSink(sink));
		this.sources.forEach((source) => this.removeSource(source));
		logger.debug(`Sinks and sources emptied for ${stringify(this)}`);
	}

	/**
	 * Executes node
	 * @param {Object} args All arguements
	 */
	execute(args) {
		logger.debug(`Executing ${stringify(this)} with ${stringify(args)}`);
	}

	/**
	 * The callback function to called before passing to sinks
	 * @callback OntologyNode~passToSinksCallback
	 * @param {Object} args All arguments that are passed to sinks
	 */
	/**
	 * Execute every sink node
	 * @param {Object} args Arguments to be sent to sink nodes
	 * @param {OntologyNode~passToSinksCallback} [args.callback] The callback function to be called before passing to sinks
	 */
	passToSinks(args) {
		if (args.callback) args.callback(args);
		this.sinks.forEach((sink) => sink.execute(clone(args)));
	}

	/**
	 * Returns minified version of the node with references
	 * @return {any}
	 */
	minify() {
		const minifiedVersion = clone(this);
		delete minifiedVersion.cacheStrategy;
		delete minifiedVersion.flowSinks;
		minifiedVersion.nodeType = minifiedVersion.constructor.name;
		minifiedVersion.sinks = minifiedVersion.sinks.map(
			(node) => (typeof node === 'string' ? node : node.id)
		);
		minifiedVersion.sources = minifiedVersion.sources.map(
			(node) => (typeof node === 'string' ? node : node.id)
		);
		return minifiedVersion;
	}
	dispose() {}
}

export default OntologyNode;
