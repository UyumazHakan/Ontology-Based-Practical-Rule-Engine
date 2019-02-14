import config from 'config';

class Balancer {
	constructor() {
		this.availableManagers = config.get('ontology_manager');
		this.availableEngines = config.get('ontology_engine');
		this.runningOntologies = [];
		this.ontologyEngineMapping = {};
		this.ontologyManagerMapping = {};
		this.extraOntologyMapping = {};
		this.engineLoads = this.availableEngines.map((engine) => {
			return {
				id: engine.id,
				load: 0,
			};
		});
		this.managerLoads = this.availableManagers.map((manager) => {
			return {
				id: manager.id,
				load: 0,
			};
		});
	}
	findOntologyEngineConfig(ontologyId) {
		if (!this.isAssigned(ontologyId)) this.assign(ontologyId);
		return this.findEngineConfig(this.ontologyEngineMapping[ontologyId]);
	}
	findOntologyManagerConfig(ontologyId) {
		if (!this.isAssigned(ontologyId)) this.assign(ontologyId);
		return this.findManagerConfig(this.ontologyManagerMapping[ontologyId]);
	}
	findEngineConfig(engineId) {
		return this.availableEngines.find((engine) => engine.id === engineId);
	}
	findManagerConfig(managerId) {
		return this.availableManagers.find((manager) => manager.id === managerId);
	}
	isAssigned(ontologyId) {
		return this.runningOntologies.includes(ontologyId);
	}
	assign(ontologyId, engineId, managerId) {
		if (!this.ontologyEngineMapping[ontologyId]) {
			this.assignOntologyEngine(ontologyId, engineId);
		}
		if (!this.ontologyManagerMapping[ontologyId]) {
			this.assignOntologyManager(ontologyId, managerId);
		}
		if (!this.isAssigned(ontologyId)) this.runningOntologies.push(ontologyId);
	}
	unassign(ontologyId) {
		let manager = this.ontologyManagerMapping[ontologyId];
		let engine = this.ontologyEngineMapping[ontologyId];
		delete this.ontologyEngineMapping[ontologyId];
		delete this.ontologyManagerMapping[ontologyId];
		if (manager)
			this.managerLoads.find((managerLoad) => managerLoad.id === manager)
				.load--;
		if (engine)
			this.engineLoads.find((engineLoad) => engineLoad.id === engine).load--;
	}

	assignOntologyEngine(ontologyId, engineId) {
		if (!this.ontologyEngineMapping[ontologyId]) {
			engineId = engineId || this.leastLoadedEngine;
			this.ontologyEngineMapping[ontologyId] = engineId;
			this.engineLoads.find((engineLoad) => engineLoad.id === engineId).load++;
		}
	}
	assignOntologyManager(ontologyId, managerId) {
		if (!this.ontologyManagerMapping[ontologyId]) {
			managerId = managerId || this.leastLoadedManager;
			this.ontologyManagerMapping[ontologyId] = managerId;
			this.managerLoads.find((managerLoad) => managerLoad.id === managerId)
				.load++;
		}
	}
	get leastLoadedEngine() {
		return this.engineLoads.reduce(
			(pre, cur) => (pre.load > cur.load ? cur : pre),
			this.engineLoads[0]
		).id;
	}
	get leastLoadedManager() {
		return this.managerLoads.reduce(
			(pre, cur) => (pre.load > cur.load ? cur : pre),
			this.managerLoads[0]
		).id;
	}
	get leastLoadedEngineConfig() {
		return this.findEngineConfig(this.leastLoadedEngine);
	}
	get leastLoadedManagerConfig() {
		return this.findManagerConfig(this.leastLoadedManager);
	}
	assignWithResponse(response, engineId, managerId) {
		const data = response.data;
		if (!this.isAssigned(data.id))
			Balancer.assign(data.id, engineId, managerId);
		if (data.flows) {
			data.flows.forEach((flow) => {
				this.extraOntologyMapping[flow.id] = data.id;
				if (flow.nodes) {
					flow.nodes.forEach((node) => {
						this.extraOntologyMapping[node.id] = data.id;
					});
				}
			});
		}
	}
}
const Instance = new Balancer();
export default Instance;
