import OntologyNode from '../../ontology_node';
import SinkTypes from './sink_types';

import {loggers} from 'winston';
import SinkType from './sink_types';

const logger  = loggers.get('main');

class SinkNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.sinkType = SinkType.enumValueOf(args.sinkType);
	}
}


export default SinkNode;
