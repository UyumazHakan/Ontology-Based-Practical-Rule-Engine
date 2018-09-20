import DatabaseConnectorProxy from '../database_connector/database_connector_proxy';

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
		this.sinks.push(sink);
	}
	addSource(source) {
		this.sources.push(source);
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

	}
	passToSinks(args) {
		this.sinks.forEach((sink) => sink.execute(args));
	}
}

export default Node;
