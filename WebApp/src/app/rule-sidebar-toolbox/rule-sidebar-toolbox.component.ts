import { Component, OnInit } from "@angular/core";
import { GraphService } from "../graph.service";
import { QueryManagerService } from "../query-manager.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-rule-sidebar-toolbox",
  templateUrl: "./rule-sidebar-toolbox.component.html",
  styleUrls: ["./rule-sidebar-toolbox.component.scss"]
})
export class RuleSidebarToolboxComponent implements OnInit {
  selectedNode;
  private isAddEdgeActive: boolean = false;
  private addEdgeFromNode;
  constructor(
    private graphService: GraphService,
    private queryManager: QueryManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.graphService.onNodeClick.subscribe(node => {
      this.selectedNode = node;
      if (this.isAddEdgeActive) {
        if (this.selectedNode)
          this.graphService.addEdge(
            this.addEdgeFromNode.graphId,
            this.selectedNode.graphId
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

  onSave() {
    this.route.params.subscribe(params => {
      this.queryManager.updateFlow(params["id"]);
    });
  }

  onDeleteNode() {
    this.graphService.deleteSelectedNode();
  }

  onAddNode() {
    this.graphService.selectedNode = {};
  }
}
