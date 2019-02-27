import {findConsequentFilterNodes} from './index';
import FilterNode from '../../ontology_nodes/manipulation_nodes/filter_node';

export default function(flow) {
	const consequentNodes = findConsequentFilterNodes(flow);
	if (consequentNodes.length < 1) return false;
	consequentNodes.forEach((nodePair) => {
		let source = nodePair.source;
		let sink = nodePair.sink;
		let index = flow.nodes.indexOf(source);
		if (index > -1) flow.nodes.splice(index, 1);
		index = flow.nodes.indexOf(sink);
		if (index > -1) flow.nodes.splice(index, 1);
		let mergedNode = new FilterNode({
			name: source.name + ' + ' + sink.name,
			field: source.field,
			mFn: (e) => source.fn(e) && sink.fn(e),
		});
		sink.sinks.forEach((node) => {
			node.removeSource(sink);
			mergedNode.addSink(node);
		});
		source.sources.forEach((node) => {
			node.removeSink(source);
			mergedNode.addSource(node);
		});
		flow.addNode({info: mergedNode});
	});
	return true;
}
