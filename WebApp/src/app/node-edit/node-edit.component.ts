import { Component, OnInit } from "@angular/core";
import { GraphService } from "../graph.service";
import { NodeEditorService, NodeInfo } from "../node-editor.service";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: "app-node-edit",
  templateUrl: "./node-edit.component.html",
  styleUrls: ["./node-edit.component.scss"]
})
export class NodeEditComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private selectedNode;
  isEditing: boolean = false;
  nodeTypeNames: string[];
  selectedTypeName: string;
  selectedType: NodeInfo;
  constructor(
    private graphService: GraphService,
    private nodeEditorService: NodeEditorService
  ) {
    this.nodeTypeNames = nodeEditorService.nodeTypes.map(info => info.name);
  }

  ngOnInit() {
    this.selectedNode = {};
    this.graphService.onNodeClick.subscribe(node => {
      if (!node) return;
      this.selectedTypeName = node.type;
      this.onTypeChange();
      this.selectedNode = node;
      this.isEditing = true;
    });
  }

  onTypeChange() {
    if (!this.selectedNode) this.selectedNode = {};
    this.selectedType = this.nodeEditorService.nodeTypes.find(
      type => type.name === this.selectedTypeName
    );
  }
  onDone() {
    this.selectedNode.type = this.selectedTypeName;
    if (this.isEditing)
      this.graphService.editNode(this.selectedNode.id, this.selectedNode);
    else this.graphService.addNode(this.selectedNode.name, this.selectedNode);
    this.selectedTypeName = undefined;
    this.selectedType = undefined;
    this.selectedNode = undefined;
    this.isEditing = false;
  }
  addToken(field: string, value): void {
    if (!this.selectedNode[field]) this.selectedNode[field] = [];
    this.selectedNode[field].push(value);
  }

  removeToken(field: string, value): void {
    const index = this.selectedNode[field].indexOf(value);

    if (index >= 0) {
      this.selectedNode[field].splice(index, 1);
    }
  }
}
