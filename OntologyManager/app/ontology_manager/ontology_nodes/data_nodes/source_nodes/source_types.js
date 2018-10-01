import {Enum} from 'enumify';

class SourceTypes extends Enum {}

SourceTypes.initEnum([
	'all',
	'allWithField',
	'allWithFieldValuePair',
	'first',
	'firstWithField',
	'firstWithFieldValuePair',
	'id',
]);

export default SourceTypes;
