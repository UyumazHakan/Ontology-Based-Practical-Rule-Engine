import { EventEmitter, Injectable } from "@angular/core";
import { Network, DataSet, Node, Edge, IdType } from "vis";
import { Flow } from "./ontology-manager-types";

@Injectable({
  providedIn: "root"
})
export class GraphService {
  private nodeDataSet = new DataSet();
  private edgeDataSet = new DataSet();
  nodes = [];
  edges = [];
  selectedNode;
  private availableNodeID = 1;
  public readonly onGraphDataChange = new EventEmitter();
  public readonly onNodeClick = new EventEmitter();
  constructor() {
    this.onNodeClick.subscribe(node => (this.selectedNode = node));
  }
  get graphData() {
    return {
      nodes: this.nodeDataSet,
      edges: this.edgeDataSet
    };
  }
  addNode(label: string, node): number {
    node = node || {};
    let graphId = this.availableNodeID++;
    node.graphId = graphId;
    node.label = label;
    this.nodeDataSet.add({ id: graphId, label: label });
    this.nodes[graphId] = node;
    this.emitNewGraphData();
    return graphId;
  }
  editNode(graphId: number, node) {
    node.graphId = graphId;
    node.label = node.name;
    this.nodeDataSet.update({ id: graphId, label: node.label });
    this.nodes[graphId] = node;
  }
  addEdge(from: number, to: number) {
    this.edgeDataSet.add({ from: from, to: to });
    this.edges.push({ from: this.nodes[from], to: this.nodes[to] });
    this.emitNewGraphData();
  }

  changeClickedNode(data) {
    this.onNodeClick.emit(this.nodes[data.nodes[0]]);
  }
  private findNodeGraphId(id: string): number {
    return this.nodes.findIndex(node => node && node.id === id);
  }
  private emitNewGraphData() {
    this.onGraphDataChange.emit(this.graphData);
  }
  createGraphFromFlow(flow: Flow) {
    this.clearGraph();
    flow.nodes.forEach(node => {
      this.addNode(node.name, node);
    });
    flow.nodes.forEach(node => {
      node.sinks.forEach(sink => {
        this.addEdge(node.graphId, this.findNodeGraphId(sink));
      });
    });
  }

  clearGraph() {
    this.availableNodeID = 1;
    this.edgeDataSet.clear();
    this.nodeDataSet.clear();
    this.edges.splice(0, this.edges.length);
    this.nodes.splice(0, this.nodes.length);
    this.emitNewGraphData();
  }
  deleteNodeEdges(node) {
    const filteredEdges = this.edges.filter(
      edge => !(node === edge.from || node === edge.to)
    );
    this.edges.splice(0, this.edges.length);
    this.edgeDataSet.clear();
    filteredEdges.forEach(edge =>
      this.addEdge(edge.from.graphId, edge.to.graphId)
    );
    this.emitNewGraphData();
  }
  deleteSelectedNode() {
    this.nodes[this.selectedNode.graphId] = undefined;
    this.nodeDataSet.remove(this.selectedNode.graphId);
    this.deleteNodeEdges(this.selectedNode);
    this.changeClickedNode({ nodes: [undefined] });
    this.emitNewGraphData();
  }
}
