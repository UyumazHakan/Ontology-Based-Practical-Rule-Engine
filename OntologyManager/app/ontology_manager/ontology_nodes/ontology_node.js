class OntologyNode {
	constructor(args) {
		this.id = args.id;
		this.name = args.name;
		this.sources = [];
		this.sinks = [];
	}
	addSink(sink) {
		this.sinks.push(sink);
	}
	addSource(source) {
		this.sources.push(source);
	}
	save() {
		JSON.stringify(this);
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
