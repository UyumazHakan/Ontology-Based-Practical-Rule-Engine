import { Component, Input, OnInit } from "@angular/core";
import { Flow } from "../ontology-manager-types";
import { NodeEditorService } from "../node-editor.service";

@Component({
  selector: "app-flow-edit",
  templateUrl: "./flow-edit.component.html",
  styleUrls: ["./flow-edit.component.scss"]
})
export class FlowEditComponent implements OnInit {
  flow: Flow;
  constructor(private editorService: NodeEditorService) {
    this.editorService.flowEmitter.subscribe(flow => (this.flow = flow));
  }

  ngOnInit() {}
}
