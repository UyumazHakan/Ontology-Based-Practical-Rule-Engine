import clone from 'clone';
import config from 'config';
import axios from 'axios';
/**
 * Generic interpreter class for all query types
 * @property {Object} value Created json object
 */
class QueryInterpreter {
	/**
	 * Creates a query interpreter
	 */
	constructor() {
		this.value = {};
		this.isInherited = false;
		this.isEnded = false;
		this.isRequested = false;
	}
	get json() {
		return this.isEnded ? this.value : {};
	}
	get httpUrl() {
		return (
			'http://' +
			config.get('ontology_manager.host') +
			':' +
			config.get('ontology_manager.port') +
			'/'
		);
	}
	get httpMethod() {
		return 'POST';
	}
	doHtppRequest() {
		return new Promise((resolve, reject) => {
			let response = null;
			switch (this.httpMethod) {
				case 'POST':
					axios
						.post(this.httpUrl, this.json)
						.then(resolve)
						.catch(reject);
					break;
				default:
					reject('Unknown http method');
			}
		});
	}
	/**
	 * Creates a json object to be sent to ontology manager
	 * @param {IoTeQLQuery} query
	 * @return {QueryInterpreter}
	 */
	interpret(query) {
		this.query = query = clone(query);
		switch (query.header.command) {
			case 'create':
				return this.create(query);
			default:
				throw TypeError('Unsupported command type');
		}
	}
	setFellowInterpreters(fellows) {
		this.fellows = fellows;
		return this;
	}
	inherit() {
		this.isInherited = true;
		return this;
	}
	end() {
		this.isEnded = true;
		Object.keys(this.value.info).forEach((key) => {
			this.value.info[key] = this.mapInfo(this.value.info[key]);
		});
		return this;
	}
	mapInfo(info) {
		switch (info.type) {
			case 'string':
			case 'number':
			case 'boolean':
				return this.mapPrimitiveInfo(info);
			case 'array':
				return this.mapArrayInfo(info);
			case 'object':
				return this.mapObjectInfo(info);
			case 'ref':
				return this.mapRefInfo(info);
			case 'tuple':
				return this.mapTupleInfo(info);
			default:
				return undefined;
		}
	}
	mapPrimitiveInfo(info) {
		return info.value;
	}
	mapArrayInfo(info) {
		return info.value.map((element) => this.mapInfo(element));
	}
	mapObjectInfo(info) {
		Object.keys(info.value).forEach((key) => {
			info.value[key] = this.mapInfo(info.value[key]);
		});
		return info.value;
	}

	mapRefInfo(info) {
		info = this.mapObjectInfo(info);
		let fellows = this.fellows;
		Object.keys(info).forEach(
			(key) =>
				(fellows = fellows.filter(
					(fellow) =>
						!fellow.isInherited && fellow.value.info[key] === info[key]
				))
		);
		if (fellows.length === 0) return info;
		return fellows[0].inherit().value;
	}

	mapTupleInfo(info) {
		return this.mapObjectInfo(info);
	}
}
export default QueryInterpreter;
