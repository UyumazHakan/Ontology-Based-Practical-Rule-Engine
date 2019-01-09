import { Component, OnInit } from "@angular/core";
import { GraphService } from "../graph.service";

@Component({
  selector: "app-node-edit",
  templateUrl: "./node-edit.component.html",
  styleUrls: ["./node-edit.component.scss"]
})
export class NodeEditComponent implements OnInit {
  private selectedNode;
  constructor(private graphService: GraphService) {}

  ngOnInit() {
    this.graphService.onNodeClick.subscribe(node => (this.selectedNode = node));
  }
}
