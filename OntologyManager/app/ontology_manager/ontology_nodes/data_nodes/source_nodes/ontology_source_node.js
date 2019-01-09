import SourceNode from './source_node';
import {subscribe} from '../../../stream_communicator/stream_communicator_proxy';
import {loggers} from 'winston';
import config from 'config';
let logger = loggers.get('main');

/**
 * Node for data source from ontology
 * @extends SourceNode
 */
class OntologySourceNode extends SourceNode {
	/**
	 * Creates a source node from ontology
	 * @param {Object} args All arguments
	 * @param {string} [args.host] Host of mqtt server of ontology engine
	 * @param {number} [args.port] Port of mqtt server of ontology engine
	 * @param {string} args.ontologyID Id of ontology that data will be subscribed
	 * @param {string} args.ontologyClass Ontology class to be subscribed
	 */
	constructor(args) {
		logger.debug(`OntologySourceNode(${JSON.stringify(args)})`);
		super(args);
		this.host = args.host || config.get('ontology_engine.host');
		this.port = args.port || config.get('ontology_engine.port');
		this.ontologyID = args.ontologyID;
		this.ontologyClass = args.ontologyClass;
		subscribe({
			protocol: 'mqtt',
			host: this.host,
			port: this.port,
			topic: `ontology/classified/${this.ontologyID}/${this.ontologyClass}`,
			callback: (args) => this.execute(args),
		});
	}
	/**
	 * Executes the node
	 * @param {Object} args All arguments
	 */
	execute(args) {
		super.execute(args);
		this.passToSinks(args);
	}
}
export default OntologySourceNode;
