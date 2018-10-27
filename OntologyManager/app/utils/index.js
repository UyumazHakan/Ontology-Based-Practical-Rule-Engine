/**
 * Helper function to deserialize any serialized object
 * @param {string} serializedObject
 * @return {any}
 */
export function deserialize(serializedObject) {
	return eval('(' + serializedObject + ')');
}
