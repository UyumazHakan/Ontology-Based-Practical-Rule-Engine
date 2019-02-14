import FilterNode from '../../ontology_nodes/manipulation_nodes/filter_node';
import merge_consequent_filter_nodes from './merge_consequent_filter_nodes';

const optimizers = [merge_consequent_filter_nodes];

export function findConsequentFilterNodes(flow) {
	return flow.nodes
		.filter((node) => {
			if (!(node instanceof FilterNode)) return false;
			if (node.sinks.length !== 1) return false;
			let sink = node.sinks[0];
			if (!(sink instanceof FilterNode)) return false;
			if (sink.sources.length !== 1) return false;
			let sourceFields =
				node.field instanceof Array ? node.field.sort().join() : node.field;
			let sinkFields =
				sink.field instanceof Array ? sink.field.sort().join() : sink.field;
			if (sourceFields !== sinkFields) return false;
			return true;
		})
		.map((node) => {
			return {source: node, sink: node.sinks[0]};
		});
}
function optimize(ontology) {
	let isOptimized = false;
	ontology.flows.forEach((flow) => {
		isOptimized = optimizers.reduce(
			(acc, optimizerFn) => acc || optimizerFn(flow),
			false
		);
	});
	return isOptimized;
}
export default function(ontology) {
	while (optimize(ontology));
}
