import OntologyNode from '../ontology_node';
/**
 * Node for grouping data coming from sources and send to sinks when a limit is reached
 */
class GroupingNode extends OntologyNode {
	/**
	 * Creates a grouping node
	 * @param {Object} args All arguments
	 * @param {string[]} args.groupBy Fields grouping will applied
	 * @param {number} args.limit How many data will be merged together before sending to sinks
	 */
	constructor(args) {
		super(args);
		this.groupBy = args.groupBy;
		this.limit = args.limit;
		this.groups = {};
	}

	/**
	 * Executes grouping node
	 * @param {Object} args All arguments
	 */
	execute(args) {
		const group = this.createGroup(args);
		if (this.groups[group]) this.groups[group].count++;
		else this.groups[group] = {count: 1, value: group};
		Object.keys(args).forEach((key) => {
			if (group[key]) return;
			if (!this.groups[group].value[key]) this.groups[group].value[key] = [];
			for (
				let i = this.groups[group].value[key].length;
				i < this.groups[group].count;
				i++
			)
				this.groups[group].value[key].push(null);
			this.groups[group].value[key][this.groups[group].count - 1] = args[key];
		});
		if (this.groups[group].count >= this.limit) {
			const groupToPass = this.groups[group].value;
			delete this.groups[group];
			this.passToSinks(groupToPass);
		}
	}

	/**
	 * @private
	 * @param {Object} args All arguments
	 * @return {Object} An object with only groupBy fields
	 */
	createGroup(args) {
		const group = {};
		this.groupBy.forEach((field) => {
			if (args[field]) group[field] = args[field];
			else group[field] = null;
		});
		return group;
	}
}
export default GroupingNode;
