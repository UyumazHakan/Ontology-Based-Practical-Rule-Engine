import {inspect} from 'util';
/**
 * Helper function to deserialize any serialized object
 * @param {string} serializedObject
 * @return {any}
 */
export function deserialize(serializedObject) {
	return eval('(' + serializedObject + ')');
}
/**
 * Helper function to stringify an object without circles
 * @param {Object} object Object to be stringified
 * @return {string} Resulting string
 */
export function stringify(object) {
	return JSON.stringify(inspect(object));
}
