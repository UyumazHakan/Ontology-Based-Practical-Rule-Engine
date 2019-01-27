export interface Flow {
  id: string;
  name: string;
  ontologyId: string;
  nodes: Node[];
  sinkNodes: Node[];
  sourceNodes: Node[];
  isSaved: boolean;
  _isUpdated: boolean;
}
export interface GroupingNode extends Node {
  limit: number;
}
export interface MqttSinkNode extends Node {
  sinkType: { name: string; ordianl: number };
  host: string;
  topic: string;
}
export interface Node {
  id: string;
  graphId?: number;
  name: string;
  sources: string[];
  sinks: string[];
  isSaved: boolean;
  _isUpdated: string;
  nodeType: string;
}
