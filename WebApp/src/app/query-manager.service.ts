import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { NodeEditorService } from "./node-editor.service";
import { GraphService } from "./graph.service";
import clone from "clone";
import { Flow } from "./ontology-manager-types";

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
class Path {
  from: QueryRef;
  to: QueryRef;
}

@Injectable({
  providedIn: "root"
})
export class QueryManagerService {
  flow: Flow;
  constructor(
    private http: HttpClient,
    private graphService: GraphService,
    private nodeEditor: NodeEditorService
  ) {
    this.nodeEditor.flowEmitter.subscribe(flow => (this.flow = flow));
  }
  private generateQueryVariable(variable: any): string {
    if (typeof variable === "number") return variable.toString();
    if (typeof variable === "string") return `"${variable}"`;
    if (typeof variable === "boolean") return `"${variable}"`;
    if (variable instanceof Path)
      return `(${this.generateQueryVariable(
        variable.from
      )},${this.generateQueryVariable(variable.to)})`;
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
      .filter(key => options[key])
      .map(
        key =>
          `${key}${
            options[key] !== true
              ? ` =${this.generateQueryVariable(options[key])}`
              : ""
          }`
      )
      .join(", ");
    let queryBody = Object.keys(body)
      .filter(key => body[key] && body[key] !== null)
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
  private generateUpdateQuery(
    type: string,
    options: object,
    body: object
  ): string {
    return this.generateQuery(QueryCommand.update, type, options, body);
  }
  private generateCreateNodeQuery(nodeType: string, body: { id?: any } = {}) {
    const options = {};
    options[nodeType] = true;
    if (body.id) delete body.id;
    return this.generateCreateQuery(QueryType.node, options, body);
  }
  private generateCreateFlowQuery(flowName: string): string {
    return this.generateCreateQuery(QueryType.flow, { name: flowName }, {});
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
  private generateReadFlowQuery(flowId: string): string {
    return this.generateReadQuery(QueryType.flow, { id: flowId }, {});
  }
  private generateUpdateOntologyQuery(
    ontologyId: string,
    body: any = {}
  ): string {
    return this.generateUpdateQuery(
      QueryType.ontology,
      { id: ontologyId },
      body
    );
  }
  private generateUpdateFlowQuery(flowId: string, body: any = {}): string {
    return this.generateUpdateQuery(QueryType.flow, { id: flowId }, body);
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
  readFlow(flowId: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.http
        .post(
          environment.queryManager.url,
          this.generateReadFlowQuery(flowId),
          { headers: { "Content-Type": "text/plain" } }
        )
        .subscribe(resolve)
    );
  }
  updateOntology(ontologyId: string) {
    return new Promise((resolve, reject) =>
      this.http
        .post(
          environment.queryManager.url,
          this.generateUpdateOntologyQuery(ontologyId),
          { headers: { "Content-Type": "text/plain" } }
        )
        .subscribe(resolve)
    );
  }
  addEmptyFlowToOntology(ontologyId: string, flowName: string) {
    const flowRef = new QueryRef();
    flowRef.name = flowName;
    return new Promise((resolve, reject) =>
      this.http
        .post(
          environment.queryManager.url,
          this.generateCreateFlowQuery(flowName) +
            "\n" +
            this.generateUpdateOntologyQuery(ontologyId, { flows: [flowRef] }),
          { headers: { "Content-Type": "text/plain" } }
        )
        .subscribe(resolve)
    );
  }

  updateFlow(flowId: any) {
    const flow: Flow = clone(this.flow);
    delete flow.nodes;
    delete flow.sourceNodes;
    delete flow.sinkNodes;
    delete flow.ontologyId;
    let nodes = clone(this.graphService.nodes);
    const edges = clone(this.graphService.edges);
    nodes = nodes.filter(node => node);
    let query = nodes
      .map(node => this.generateCreateNodeQuery(node.nodeType, node))
      .join("\n");
    const sinkNodeRefs = nodes
      .filter(node => this.nodeEditor.sinkNodeTypes.includes(node.nodeType))
      .map(node => {
        const ref = new QueryRef();
        ref.name = node.name;
        return ref;
      })
      .filter(nodeRef => nodeRef != null);
    const sourceNodeRefs = nodes
      .filter(node => this.nodeEditor.sourceNodeTypes.includes(node.nodeType))
      .map(node => {
        const ref = new QueryRef();
        ref.name = node.name;
        return ref;
      })
      .filter(nodeRef => nodeRef != null);
    const middleNodeRefs = nodes
      .filter(
        node =>
          !this.nodeEditor.sinkNodeTypes.includes(node.nodeType) &&
          !this.nodeEditor.sourceNodeTypes.includes(node.nodeType)
      )
      .map(node => {
        const ref = new QueryRef();
        ref.name = node.name;
        return ref;
      })
      .filter(nodeRef => nodeRef != null);
    const paths = edges.map(edge => {
      const path = new Path();
      const from = new QueryRef();
      const to = new QueryRef();
      from.name = edge.from.name;
      to.name = edge.to.name;
      path.from = from;
      path.to = to;
      return path;
    });
    query =
      query +
      "\n" +
      this.generateUpdateFlowQuery(
        flowId,
        Object.assign(flow, {
          sources: sourceNodeRefs,
          sinks: sinkNodeRefs,
          middles: middleNodeRefs,
          paths: paths
        })
      );

    return new Promise((resolve, reject) => {
      console.dir(`Sending query : ${query}`);
      this.http
        .post(environment.queryManager.url, query, {
          headers: { "Content-Type": "text/plain" }
        })
        .subscribe(resolve);
    });
  }
}
