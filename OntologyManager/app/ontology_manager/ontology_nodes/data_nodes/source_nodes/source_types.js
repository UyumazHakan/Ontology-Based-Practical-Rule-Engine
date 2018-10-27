import {Enum} from 'enumify';
/**
 * Enum for source types
 * @typedef {string} SourceTypeEnum
 * @property {string} all Matches everything in the source
 * @property {string} allWithField Matches everything with certain field in the source
 * @property {string} allWithFieldValuePair Matches everything with certain value in certain field
 * @property {string} first Matches first object in the source
 * @property {string} firstWithField Matches first object with certain field in the source
 * @property {string} firstWithFieldValuePair Matches first object with certain value in certain field
 * @property {string} id Matches with only objects with certain id
 */
/**
 * Enumeration class for source
 * @extends Enum
 */
class SourceType extends Enum {}

SourceType.initEnum([
	'all',
	'allWithField',
	'allWithFieldValuePair',
	'first',
	'firstWithField',
	'firstWithFieldValuePair',
	'id',
]);

export default SourceType;
