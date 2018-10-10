import OntologyNode from '../../ontology_node';

import {loggers} from 'winston';
import SourceTypes from './source_types';

const logger  = loggers.get('main');
class SourceNode extends OntologyNode {
	constructor(args) {
		super(args);
		this.sourceType = SourceTypes.enumValueOf(args.sourceType);
	}
}


export default SourceNode;
