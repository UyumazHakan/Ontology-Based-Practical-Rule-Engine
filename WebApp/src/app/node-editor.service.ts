import { EventEmitter, Injectable } from "@angular/core";
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
          name: "sinkType",
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
          name: "sourceType",
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
        { name: "ontologyClass", type: "string" }
      ]
    },
    {
      name: "Filter",
      fields: [
        { name: "name", type: "string" },
        { name: "field", type: "string[]" },
        { name: "fn", type: "string" }
      ]
    },
    {
      name: "Reduce",
      fields: [
        { name: "name", type: "string" },
        { name: "initial", type: "string" },
        { name: "field", type: "string[]" },
        { name: "fn", type: "string" }
      ]
    },
    {
      name: "Map",
      fields: [
        { name: "name", type: "string" },
        { name: "sourceMap", type: "string[]" },
        { name: "sinkMap", type: "string[]" },
        { name: "fn", type: "string" }
      ]
    },
    {
      name: "Grouping",
      fields: [
        { name: "name", type: "string" },
        { name: "groupby", type: "string[]" },
        { name: "limit", type: "number" }
      ]
    },
    {
      name: "ElasticsearchSource",
      fields: [
        { name: "name", type: "string" },
        {
          name: "sinkType",
          type: "string",
          enum: ["create", "append", "appendWithTimestamp", "replace"]
        },
        { name: "host", type: "string" },
        { name: "port", type: "number" },
        { name: "topic", type: "string" },
        { name: "fields", type: "string[]" }
      ]
    }
  ];
  sinkNodeTypes = ["MqttSink", "OntologySink"];
  sourceNodeTypes = ["MqttSource", "OntologySource"];
  flowEmitter = new EventEmitter();
  constructor() {}
}
