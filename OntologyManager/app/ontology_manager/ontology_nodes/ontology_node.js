import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';
import * as util from 'util';
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
		logger.debug(
			`Adding sink ${sink} to ${JSON.stringify(util.inspect(this))}`
		);
		this._isUpdated = false;
		if (!this.sinks.includes(sink)) {
			this.sinks.push(sink);
			sink.addSource(this);
		}
	}
	addSource(source) {
		logger.debug(
			`Adding source ${source} to ${JSON.stringify(util.inspect(this))}`
		);
		this._isUpdated = false;
		if (!this.sources.includes(source)) {
			this.sources.push(source);
			source.addSink(this);
		}
	}
	removeSink(sink) {
		logger.debug(
			`Removing sink ${sink} to ${JSON.stringify(util.inspect(this))}`
		);
		this._isUpdated = false;
		if (this.sources.includes(sink)) {
			this.sinks.splice(this.sinks.indexOf(sink), 1);
			sink.removeSource(this);
		}
	}
	removeSource(source) {
		logger.debug(
			`Removing source ${source} to ${JSON.stringify(util.inspect(this))}`
		);
		this._isUpdated = false;
		if (!this.sources.includes(source)) {
			this.sources.push(this.sources.indexOf(source), 1);
			source.removeSink(this);
		}
	}
	// TODO: finish update and create functions
	saveNode(args) {
		let saveObject = args ? Object.assign(clone(this), args) : clone(this);
		saveObject.nodeType = saveObject.constructor.name;
		saveObject.sinks = this.sinks.map((node) => node.id);
		saveObject.sources = this.sources.map((node) => node.id);
		delete saveObject.isSaved;
		delete saveObject._isUpdated;
		if (!this.isSaved) {
			DatabaseConnectorProxy.create({
				index: 'node',
				type: 'nodeType',
				body: saveObject,
			})
				.then((res) => {
					logger.debug(`Node saving is successful. ${res}`);
					this.isSaved = true;
					this._isUpdated = true;
				})
				.catch((err) => {
					logger.debug(`Node saving is failed. ${err}`);
				});
		}
	}

	reset(args) {
		logger.debug(`Resetting ${JSON.stringify(util.inspect(this))}`);
		this.sinks.forEach((sink) => this.removeSink(sink));
		this.sources.forEach((source) => this.removeSource(source));
		logger.debug(
			`Sinks and sources emptied for ${JSON.stringify(util.inspect(this))}`
		);
	}
	execute(args) {
		logger.debug(
			`Executing ${JSON.stringify(util.inspect(this))} with ${JSON.stringify(
				args
			)}`
		);
	}
	passToSinks(args) {
		this.sinks.forEach((sink) => sink.execute(clone(args)));
	}
}


export default OntologyNode;
