export function deserialize(serializedObject) {
	return eval('(' + serializedObject + ')');
}
