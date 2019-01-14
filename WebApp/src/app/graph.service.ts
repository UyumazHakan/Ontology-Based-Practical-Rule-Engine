import { EventEmitter, Injectable } from "@angular/core";
import { Network, DataSet, Node, Edge, IdType } from "vis";

@Injectable({
  providedIn: "root"
})
export class GraphService {
  private nodeDataSet = new DataSet();
  private edgeDataSet = new DataSet();
  private nodes = [];
  private edges = [];
  private availableNodeID = 1;
  public readonly onGraphDataChange = new EventEmitter();
  public readonly onNodeClick = new EventEmitter();
  constructor() {}
  addNode(label: string, node): number {
    node = node || {};
    let id = this.availableNodeID++;
    node.id = id;
    node.label = label;
    this.nodeDataSet.add({ id: id, label: label });
    this.nodes[id] = node;
    this.emitNewGraphData();
    return id;
  }
  editNode(id: number, node) {
    node.id = id;
    node.label = node.name;
    this.nodeDataSet.update({ id: id, label: node.label });
    this.nodes[id] = node;
  }
  addEdge(from: number, to: number) {
    this.edgeDataSet.add({ from: from, to: to });
    this.emitNewGraphData();
  }

  changeClickedNode(data) {
    console.dir(data);
    this.onNodeClick.emit(this.nodes[data.nodes[0]]);
  }

  private emitNewGraphData() {
    this.onGraphDataChange.emit({
      nodes: this.nodeDataSet,
      edges: this.edgeDataSet
    });
  }
}
