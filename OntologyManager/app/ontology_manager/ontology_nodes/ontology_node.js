import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';

import {loggers} from 'winston';
let logger = loggers.get('main');

class OntologyNode {
	constructor(args) {
		if (new.target === OntologyNode) {
			let errMessage = 'Cannot construct OntologyNode' +
				' instances directly';
			logger.error(errMessage);
			throw new TypeError(errMessage);
		}
		this.id = args.id;
		this.name = args.name;
		this.sources = [];
		this.sinks = [];
		this.isSaved = args.isSaved ? args.isSaved : false;
	}
	addSink(sink) {
		if (!this.sources.includes(sink)) {
			this.sinks.push(source);
			source.addSource(this);
		}
	}
	addSource(source) {
		if (!this.sources.includes(source)) {
			this.sources.push(source);
			source.addSink(this);
		}

	}
	// TODO: finish update and create functions
	save() {
		let saveObject = JSON.stringify(this);
		if (this.isSaved) {
			DatabaseConnectorProxy.update();
		} else {
			DatabaseConnectorProxy.create();
		}
	}
	load() {

	}
	execute(args) {
		logger.debug(`Executing ${JSON.stringify(this)} with ${JSON.stringify(args)}`);
	}
	passToSinks(args) {
		this.sinks.forEach((sink) => sink.execute(args));
	}
}

export default OntologyNode;
