import { Component, OnInit } from "@angular/core";
import { Network, DataSet, Node, Edge, IdType } from "vis";
import { GraphService } from "../graph.service";

@Component({
  selector: "app-rule-graph-view",
  templateUrl: "./rule-graph-view.component.html",
  styleUrls: ["./rule-graph-view.component.scss"]
})
export class RuleGraphViewComponent implements OnInit {
  private graphData;
  public graph: Network;

  constructor(private graphService: GraphService) {}

  public ngOnInit(): void {
    this.graphService.onGraphDataChange.subscribe(
      graphData => (this.graphData = graphData)
    );
    this.graphData = this.graphService.graphData;
    var container = document.getElementById("network");
    var options = {
      autoResize: true,
      height: "100%",
      width: "100%",
      manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: true,
        addEdge: true,
        editEdge: true,
        deleteNode: true,
        deleteEdge: true
      },
      edges: {
        arrows: "to"
      },
      interaction: {
        selectConnectedEdges: false
      }
    };
    this.graph = new Network(container, this.graphData, options);
    this.graph.on("click", data => this.onClick(data));
  }
  onClick(data) {
    this.graphService.changeClickedNode(data);
  }
}
