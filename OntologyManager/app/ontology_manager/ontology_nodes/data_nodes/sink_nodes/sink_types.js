import {Enum} from 'enumify';

class SinkType extends Enum {}

SinkType.initEnum([
	'append',
	'appendWithTimestamp',
	'replace',
	'create',
]);

export default SinkType;
