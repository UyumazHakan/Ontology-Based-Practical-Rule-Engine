import OntologyNode from '../ontology_node';
import {loggers} from 'winston';

const logger = loggers.get('main');

class ReturnNode extends OntologyNode {
	constructor(args) {
		super(args);
		if (args.onValueArrived && typeof args.onValueArrived === 'function') {
			this.onValueArrived = args.onValueArrived;
		}
		this.valueArray = [];
	}
	get lastValue() {
		return this.valueArray[this.valueArray.length - 1];
	}
	execute(args) {
		super.execute(args);
		this.valueArray[this.valueArray.length] = args;
		if (this.onValueArrived) this.onValueArrived(args);
		this.passToSinks(args);
	}
	reset(args) {
		super.reset(args);
		this.valueArray = [];
	}
}

export default ReturnNode;
