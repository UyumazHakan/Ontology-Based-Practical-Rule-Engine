import { Component, OnInit } from "@angular/core";
import { QueryManagerService } from "../query-manager.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ontology-details",
  templateUrl: "./ontology-details.component.html",
  styleUrls: ["./ontology-details.component.scss"]
})
export class OntologyDetailsComponent implements OnInit {
  ontology;
  newFlowName: string;
  constructor(
    private queryManager: QueryManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateOntology();
  }

  private updateOntology() {
    this.route.params.subscribe(params => {
      this.queryManager
        .readOntology(params.id)
        .then(result => (this.ontology = result[0]));
    });
  }

  onCreateNewFlow(): void {
    this.updateOntology();
  }
}
