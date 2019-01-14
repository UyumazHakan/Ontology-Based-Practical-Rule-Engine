import { Component, OnInit } from "@angular/core";
import { GraphService } from "../graph.service";

@Component({
  selector: "app-rule-sidebar-toolbox",
  templateUrl: "./rule-sidebar-toolbox.component.html",
  styleUrls: ["./rule-sidebar-toolbox.component.scss"]
})
export class RuleSidebarToolboxComponent implements OnInit {
  selectedNode;
  private isAddEdgeActive: boolean = false;
  private addEdgeFromNode;
  constructor(private graphService: GraphService) {}

  ngOnInit() {
    this.graphService.onNodeClick.subscribe(node => {
      this.selectedNode = node;
      if (this.isAddEdgeActive) {
        if (this.selectedNode)
          this.graphService.addEdge(
            this.addEdgeFromNode.id,
            this.selectedNode.id
          );
        this.addEdgeFromNode = undefined;
        this.isAddEdgeActive = false;
      }
    });
  }
  onAddEdge() {
    this.isAddEdgeActive = true;
    this.addEdgeFromNode = this.selectedNode;
  }
}
