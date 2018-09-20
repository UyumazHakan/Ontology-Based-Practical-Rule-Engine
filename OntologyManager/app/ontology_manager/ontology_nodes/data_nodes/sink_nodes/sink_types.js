import {Enum} from 'enumify';

class SinkType extends Enum {}

SinkType.initEnum([
	'append',
	'appendWithTimestamp',
	'replace',
]);

export default SinkType;
