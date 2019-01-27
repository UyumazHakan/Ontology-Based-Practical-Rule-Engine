import { Component, OnInit } from "@angular/core";
import { QueryManagerService } from "../query-manager.service";
import { ActivatedRoute } from "@angular/router";
import { GraphService } from "../graph.service";
import { NodeEditorService } from "../node-editor.service";
import { Flow } from "../ontology-manager-types";

@Component({
  selector: "app-rule-view",
  templateUrl: "./rule-view.component.html",
  styleUrls: ["./rule-view.component.scss"]
})
export class RuleViewComponent implements OnInit {
  flow: Flow;
  constructor(
    private route: ActivatedRoute,
    private queryManager: QueryManagerService,
    private graphService: GraphService,
    private editorService: NodeEditorService
  ) {}

  ngOnInit() {
    this.editorService.flowEmitter.subscribe(flow => (this.flow = flow));
    this.editorService.flowEmitter.subscribe(flow =>
      this.graphService.createGraphFromFlow(flow)
    );
    this.route.params.subscribe(params => {
      this.queryManager.readFlow(params.id).then(flow => {
        this.editorService.flowEmitter.emit(flow[0]);
      });
    });
  }
}
