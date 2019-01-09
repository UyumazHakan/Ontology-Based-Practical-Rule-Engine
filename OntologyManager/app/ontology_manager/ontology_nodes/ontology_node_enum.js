import ElasticsearchSinkNode from './data_nodes/sink_nodes/elasticsearch_sink_node';
import MqttSinkNode from './data_nodes/sink_nodes/mqtt_sink_node';
import ElasticsearchSourceNode from './data_nodes/source_nodes/elasticsearch_source_node';
import FilterNode from './manipulation_nodes/filter_node';
import MapNode from './manipulation_nodes/map_node';
import ReduceNode from './manipulation_nodes/reduce_node';
import ReturnNode from './test_nodes/return_node';
import MqttSourceNode from './data_nodes/source_nodes/mqtt_source_node';
import GroupingNode from './bridge_nodes/grouping_node';
import OntologySinkNode from './data_nodes/sink_nodes/ontology_sink_node';
import OntologySourceNode from './data_nodes/source_nodes/ontology_source_node';
/**
 * Enum for OntologyNodeRoutes
 * @readonly
 * @enum {OntologyNode}
 */
export default {
	ElasticsearchSinkNode: ElasticsearchSinkNode,
	ElasticsearchSourceNode: ElasticsearchSourceNode,
	MqttSinkNode: MqttSinkNode,
	MqttSourceNode: MqttSourceNode,
	OntologySinkNode: OntologySinkNode,
	OntologySourceNode: OntologySourceNode,
	GroupingNode: GroupingNode,
	FilterNode: FilterNode,
	MapNode: MapNode,
	ReduceNode: ReduceNode,
	ReturnNode: ReturnNode,
};
