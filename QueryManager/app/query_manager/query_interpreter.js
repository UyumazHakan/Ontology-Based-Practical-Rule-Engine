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
		this.httpUrl =
			'http://' +
			config.get('ontology_manager.host') +
			':' +
			config.get('ontology_manager.port') +
			'/';
		this.httpMethod = 'POST';
		this.value = {};
		this.isInherited = false;
		this.isEnded = false;
		this.isRequested = false;
	}
	get json() {
		return this.isEnded ? this.value : {};
	}

	doRequest() {
		return [this.doHttpRequest()];
	}
	doHttpRequest() {
		return new Promise((resolve, reject) => {
			switch (this.httpMethod) {
				case 'POST':
					axios
						.post(this.httpUrl, this.json)
						.then(resolve)
						.catch(reject);
					break;
				case 'GET':
					axios
						.get(this.httpUrl)
						.then((result) => {
							const data = result.data;
							console.dir(data);
							this.readFlowData(data);
							resolve(result);
						})
						.catch(reject);
					break;
				case 'PATCH':
					axios
						.patch(this.httpUrl, this.json)
						.then(resolve)
						.catch(reject);
					break;
				default:
					reject('Unknown http method');
			}
		});
	}

	readFlowData(flow) {
		delete flow.isSaved;
		delete flow._isUpdated;
		if (flow.nodes) {
			flow.nodes = flow.nodes.map(this.readNodeData);
		}
		if (flow.sinkNodes) {
			flow.sinkNodes = flow.sinkNodes.map(this.readNodeData);
		}
		if (flow.sourceNodes) {
			flow.sourceNodes = flow.sourceNodes.map(this.readNodeData);
		}
		return flow;
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
			case 'read':
				return this.read(query);
			case 'update':
				return this.update(query);
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
		if (this.value.info)
			Object.keys(this.value.info).forEach((key) => {
				this.value.info[key] = this.mapInfo(this.value.info[key]);
			});
		return this;
	}
	readNodeData(node) {
		if (node.sourceType) node.sourceType = node.sourceType.name;
		if (node.sinkType) node.sinkType = node.sinkType.name;
		delete node.isSaved;
		delete node._isUpdated;
		node.nodeType = node.nodeType.replace('Node', '');
		return node;
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
