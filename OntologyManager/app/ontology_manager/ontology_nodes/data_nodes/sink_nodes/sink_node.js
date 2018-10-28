import OntologyNode from '../../ontology_node';
import SinkTypes from './sink_types';

import {loggers} from 'winston';
import SinkType from './sink_types';

const logger = loggers.get('main');
/**
 * Generic sink node
 * @extends OntologyNode
 */
class SinkNode extends OntologyNode {
	/**
	 * Creates a generic sink node
	 * @param {Object} args All arguments
	 * @param {SinkType | SinkTypeEnum} args.sinkType Type of the sink
	 */
	constructor(args) {
		super(args);
		if (args.sinkType.name) args.sinkType = args.sinkType.name;
		this.sinkType =
			args.sinkType instanceof SinkType
				? args.sinkType
				: SinkType.enumValueOf(args.sinkType);
	}
	/**
	 * Saves sink node
	 * @param {Object} [args] Arguments to be saved
	 */
	saveNode(args) {
		if (!args) args = {};
		args.sinkType = this.sinkType.name;
		super.saveNode(args);
	}
}

export default SinkNode;
