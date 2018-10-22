import {Enum} from 'enumify';

/**
 * Enum for sink types
 * @typedef {string} SinkTypeEnum
 * @property {string} append To append in an array in sink
 * @property {string} appendWithTimestamp To append in an array with timestamp
 * @property {string} replace To replace value in sink
 * @property {string} create To create new value in sink
 */
/**
 * Enumeration class for sink
 * @extends Enum
 */
class SinkType extends Enum {}

SinkType.initEnum(['append', 'appendWithTimestamp', 'replace', 'create']);

export default SinkType;
