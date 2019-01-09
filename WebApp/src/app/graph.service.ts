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
  addNode(label: string): number {
    let id = this.availableNodeID++;
    this.nodeDataSet.add({ id: id, label: label });
    this.nodes[id] = { label: label };
    this.emitNewGraphData();
    return id;
  }
  addEdge(from: number, to: number) {
    this.edgeDataSet.add({ from: from, to: to });
    this.emitNewGraphData();
  }

  changeClickedNode(data) {
    this.onNodeClick.emit(this.nodes[data.nodes[0]]);
  }

  private emitNewGraphData() {
    this.onGraphDataChange.emit({
      nodes: this.nodeDataSet,
      edges: this.edgeDataSet
    });
  }
}
