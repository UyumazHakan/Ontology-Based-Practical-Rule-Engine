import { Component, Input, OnInit } from "@angular/core";
import { GraphService } from "../graph.service";

@Component({
  selector: "app-rule-sidebar",
  templateUrl: "./rule-sidebar.component.html",
  styleUrls: ["./rule-sidebar.component.scss"]
})
export class RuleSidebarComponent implements OnInit {
  constructor(private graphService: GraphService) {}

  ngOnInit() {}
}
