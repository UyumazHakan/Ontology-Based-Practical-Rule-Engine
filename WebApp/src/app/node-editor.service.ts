import { Injectable } from "@angular/core";
export interface NodeInfo {
  name: string;
  fields: { name: string; type: string; optional?: boolean; enum?: string[] }[];
}
@Injectable({
  providedIn: "root"
})
export class NodeEditorService {
  nodeTypes: NodeInfo[] = [
    {
      name: "MqttSink",
      fields: [
        { name: "name", type: "string" },
        {
          name: "sink_type",
          type: "string",
          enum: ["append", "appendWithTimestamp"]
        },
        { name: "host", type: "string" },
        { name: "port", type: "number" },
        { name: "topic", type: "string" },
        { name: "fields", type: "string[]" }
      ]
    },
    {
      name: "MqttSource",
      fields: [
        { name: "name", type: "string" },
        {
          name: "source_type",
          type: "string",
          enum: ["all", "allWithField", "allWithFieldValuePair", "id"]
        },
        { name: "host", type: "string" },
        { name: "port", type: "number" },
        { name: "topic", type: "string" },
        { name: "fields", type: "string[]" }
      ]
    },
    {
      name: "OntologySink",
      fields: [
        { name: "name", type: "string" },
        { name: "host", type: "string", optional: true },
        { name: "port", type: "number", optional: true },
        { name: "fields", type: "string[]", optional: true }
      ]
    },
    {
      name: "OntologySource",
      fields: [
        { name: "name", type: "string" },
        { name: "host", type: "string", optional: true },
        { name: "port", type: "number", optional: true },
        { name: "ontology_clas", type: "string" }
      ]
    }
  ];
  constructor() {}
}
