import OntologyNode from '../ontology_node';
import {loggers} from 'winston';

const logger = loggers.get('main');

class MapNode extends OntologyNode {
	constructor(args) {
		super(args);
		if (!args.sourceMap || !args.sinkMap) {
			const err = `sourceMap and sinkMap should be defined in args`;
			logger.error(err);
			throw Error(err);
		}
		this.mapFunction = args.mapFunction;
		this.keepSource = args.keepSource || false;
		if (
			args.sourceMap instanceof Array &&
			args.sinkMap instanceof Array &&
			args.sourceMap.length === args.sinkMap.length
		) {
			this.sourceMap = args.sourceMap;
			this.sinkMap = args.sinkMap;
		} else if (
			!(args.sourceMap instanceof Array) &&
			!(args.sinkMap instanceof Array)
		) {
			this.sourceMap = [args.sourceMap];
			this.sinkMap = [args.sinkMap];
		} else {
			logger.error(
				`${args.sourceMap} has not same number of element with ${args.sinkMap}
				`
			);
			throw TypeError;
		}
	}
	set mapFunction(map) {
		if (!map) {
			this._mapFunction = (args) => args;
			return;
		}
		if (typeof map === 'function') {
			this._mapFunction = map;
		} else {
			logger.error(`${map} is not a function`);
		}
	}
	get mapFunction() {
		return this._mapFunction;
	}
	get map() {
		let map = {};
		this.sourceMap.forEach((element, i) => {
			if (element instanceof Array) {
				element.forEach(
					(nestedElement) => (map[nestedElement] = this.sinkMap[i])
				);
			} else {
				map[element] = this.sinkMap[i];
			}
		});
		return map;
	}
	execute(args) {
		super.execute(args);
		let passValue = {};
		passValue.append = (key, value) => {
			if (value instanceof Array) value = value.map(this.mapFunction);
			else value = this.mapFunction(value);
			if (!passValue[key]) {
				passValue[key] = value;
			} else if (passValue[key] instanceof Array) {
				passValue[key].push(value);
			} else {
				passValue[key] = [passValue[key], value];
			}
		};
		Object.keys(args).forEach((key) => {
			if (this.map[key]) {
				if (this.map[key] instanceof Array) {
					this.map[key].forEach((mulKey) =>
						passValue.append(mulKey, args[key])
					);
				} else {
					passValue.append(this.map[key], args[key]);
				}
			}
			if (!this.map[key] || this.keepSource) {
				passValue.append(key, args[key]);
			}
		});
		delete passValue.append;
		logger.debug(
			`Mapped ${JSON.stringify(args)} to ${JSON.stringify(passValue)}`
		);
		this.passToSinks(passValue);
	}
}

export default MapNode;
