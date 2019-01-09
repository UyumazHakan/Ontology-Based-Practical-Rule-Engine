import SinkNode from './sink_node';
import SinkType from './sink_types';
import {publish} from '../../../stream_communicator/stream_communicator_proxy';
import {loggers} from 'winston';
import config from 'config';
let logger = loggers.get('main');
/**
 * Node for data sink to ontology
 * @extends SinkNode
 **/
class OntologySinkNode extends SinkNode {
	/**
	 * Creates a sink node to ontology
	 * @param {Object} args All arguments
	 * @param {string} [args.host] Host of mqtt server of ontology engine
	 * @param {number} [args.port] Port of mqtt server of ontology engine
	 * @param {string} args.ontologyID Id of ontology that data will be sinked
	 * @param {string | string[]} args.field Field or fields to be sinked
	 */
	constructor(args) {
		logger.debug(`OntologySinkNode(${JSON.stringify(args)})`);
		super(args);
		this.host = args.host || config.get('ontology_engine.host');
		this.port = args.port || config.get('ontology_engine.port');
		this.ontologyID = args.ontologyID;
		this.field = args.field;
	}
	/**
	 * Executes the node
	 * @param {Object} args All arguments
	 * @param {string | string[]} args.value Value or values to be sinked in the fields
	 */
	execute(args) {
		super.execute(args);
		let body = {};
		if (!this.field) body = args;
		else if (this.field instanceof Array) {
			body = this.field.reduce((acc, cur, i) => {
				if (args[cur]) acc[cur] = args[cur];
				return acc;
			}, {});
		} else if (!(this.field instanceof Array))
			body[this.field] = args[this.field];
		else {
			logger.error(
				`${this.field} has not same number of element with ${args.value}
				`
			);
			throw TypeError;
		}
		logger.debug(`Body ${JSON.stringify(body)} created`);
		if (body !== {}) {
			publish({
				protocol: 'mqtt',
				host: this.host,
				port: this.port,
				topic: `ontology/query/${this.ontologyID}`,
				message: JSON.stringify({data: body}),
			});
		}

		this.passToSinks(args);
	}
}
export default OntologySinkNode;
