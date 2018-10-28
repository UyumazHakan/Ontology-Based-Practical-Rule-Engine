import OntologyNode from '../../ontology_node';

import {loggers} from 'winston';
import SourceType from './source_types';

const logger = loggers.get('main');
/**
 * Generic source node
 * @extends OntologyNode
 */
class SourceNode extends OntologyNode {
	/**
	 * Creates a generic source node
	 * @param {Object} args All arguments
	 * @param {SourceType | SourceTypeEnum} args.sinkType Type of the source
	 */
	constructor(args) {
		super(args);
		if (args.sourceType.name) args.sourceType = args.sourceType.name;
		this.sourceType = SourceType.enumValueOf(args.sourceType);
	}

	/**
	 * Saves source node
	 * @param {Object} [args] Arguments to be saved
	 */
	saveNode(args) {
		if (!args) args = {};
		args.sourceType = this.sourceType.name;
		super.saveNode(args);
	}
}

export default SourceNode;
