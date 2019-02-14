import {inspect} from 'util';
import md5 from 'md5';
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
/**
 * Helper function to create hash of an object
 * @param {Object} object Object to be hashed
 * @return {string} Resulting hash
 */
export function hash(object) {
	return md5(objectToKey(object));
}
export function objectToKey(object) {
	return Object.keys(object)
		.sort()
		.map((key) => key + '?' + object[key])
		.join(':');
}
