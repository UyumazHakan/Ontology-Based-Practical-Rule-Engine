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
		this.sinkType =
			args.sinkType instanceof SinkType
				? args.sinkType
				: SinkType.enumValueOf(args.sinkType);
	}
}

export default SinkNode;
