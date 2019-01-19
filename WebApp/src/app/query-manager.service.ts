import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";

const QueryCommand = {
  create: "create",
  read: "read",
  update: "update",
  delete: "delete"
};
const QueryType = {
  ontology: "ontology",
  flow: "flow",
  node: "node"
};
export class QueryRef {
  name?: string;
}

@Injectable({
  providedIn: "root"
})
export class QueryManagerService {
  constructor(private http: HttpClient) {}
  private generateQueryVariable(variable: any): string {
    if (typeof variable === "number") return variable.toString();
    if (typeof variable === "string") return `"${variable}"`;
    if (variable instanceof QueryRef)
      return `$ref(${Object.keys(variable)
        .map(key => `${key} = ${this.generateQueryVariable(variable[key])}`)
        .join(", ")})`;
    if (variable instanceof Array)
      return `[${variable.map(e => this.generateQueryVariable(e)).join(", ")}]`;
    if (variable instanceof Object)
      return `{\n${Object.keys(variable)
        .map(key => `${key} : ${this.generateQueryVariable(variable[key])}`)
        .join(", ")}\n}`;
  }
  private generateQuery(
    command: string,
    type: string,
    options: object,
    body: object
  ): string {
    let queryOptions = Object.keys(options)
      .map(
        key =>
          `${key} ${
            options[key] !== true
              ? `=${this.generateQueryVariable(options[key])}`
              : ""
          }`
      )
      .join(", ");
    let queryBody = Object.keys(body)
      .map(key => `${key} : ${this.generateQueryVariable(body[key])}`)
      .join(",\n");
    return `$${command}[${type}](${queryOptions})\n{\n${queryBody}\n}`;
  }
  private generateCreateQuery(
    type: string,
    options: object,
    body: object
  ): string {
    return this.generateQuery(QueryCommand.create, type, options, body);
  }
  private generateReadQuery(
    type: string,
    options: object,
    body: object
  ): string {
    return this.generateQuery(QueryCommand.read, type, options, body);
  }
  private generateCreateOntologyQuery(ontologyName: string): string {
    return this.generateCreateQuery(
      QueryType.ontology,
      { name: ontologyName },
      {}
    );
  }
  private generateReadOntologyQuery(ontologyId: string): string {
    return this.generateReadQuery(QueryType.ontology, { id: ontologyId }, {});
  }
  createOntology(ontologyName: string) {
    return new Promise((resolve, reject) =>
      this.http
        .post(
          environment.queryManager.url,
          this.generateCreateOntologyQuery(ontologyName),
          { headers: { "Content-Type": "text/plain" } }
        )
        .subscribe(resolve)
    );
  }
  readOntology(ontologyId: string) {
    return new Promise((resolve, reject) =>
      this.http
        .post(
          environment.queryManager.url,
          this.generateReadOntologyQuery(ontologyId),
          { headers: { "Content-Type": "text/plain" } }
        )
        .subscribe(resolve)
    );
  }
}
