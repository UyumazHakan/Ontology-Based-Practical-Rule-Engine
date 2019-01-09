{
    function makeString(o) {
        return o.join("");
    }
    function makeInteger(o) {
        return parseInt(makeString(o),10);
    }
    function makeFloat(o) {
        return parseFloat(makeString(o));
    }
    function makeObject(name, value) {
        const o = {};
        o[name] = value;
        return o;
    }
}

start
    = _ seq:querySequence {return {seq:seq}}

querySequence "seq"
    = query:query _ seq:querySequence? {return seq ? [query].concat(seq): [query]}

query
    = header:queryHeader body:queryBody?_ { return Object.assign(header,body)}


queryHeader
    = command:queryCommand _ type:queryType _  options:queryOptions _ { return {"header":Object.assign(command,type,options)}}
/ command:queryCommand _ type:queryType _ { return {"header":Object.assign(command,type)}}

queryCommand
    = "$" _queryCommand:_queryCommand { return _queryCommand; }

_queryCommand
    = "create" { return {"command":text()};}

queryType
    = "[" _queryType:_queryType "]" { return {"type":_queryType}; }

_queryType
    = "flow"
    / "node"
    / "ontology"

queryOptions "options"
    = "(" options:_queryOptions ")" {return {"options":options}}

_queryOptions
    = option:queryOption _  "," _ options:_queryOptions {return Object.assign(option,options);}
/ queryOption

queryOption
    = nodeType:nodeType {return makeObject("type", nodeType)}
    / option
    
options
	= first:option _  "," _ rest:options { return Object.assign(first,rest)}
    / option

option
 	= name:name _  "="  _ value:primitive {return makeObject(name, value)}
/  name:name{ return makeObject(name, true); }

nodeType 
	= "\"" value: nodeType "\"" {return value}
    / "\'" value: nodeType "\'" {return value}
    / "MqttSink"
    / "MqttSource"
    / "Filter"
    / "Map"
    / "Reduce"
    / "OntologySource"
    / "OntologySink"
    / "Grouping" { return text()}
queryBody
    = "{" _ pairs:keyValueOrRefPairs? _ "}" {return {body:pairs};}
    
keyValueOrRefPairs
    = _ pair:keyValueOrRefPair _  "," _ pairs:keyValueOrRefPairs _ {return Object.assign(pair,pairs);}
/ pair:keyValueOrRefPair _  ","? _ { return pair}

keyValuePairs
    = _ pair:keyValuePair _ "," _ pairs:keyValuePairs _ {return Object.assign(pair,pairs);}
/ pair:keyValuePair _ ","? _ {return pair;}

keyValueOrRefPair
    = name:name _ ":" _ value:valueOrRef {return makeObject(name, value)}

keyValuePair
    = name:name _ ":" _ value:value {return makeObject(name, value)}

name
    = string
    / letters:[a-zA-z]+ { return makeString(letters); }


valueOrRef 
	= value
    / valueOrRefTuple
    / ref
    

valueOrRefs
    = first:valueOrRef _ "," _ rest:valueOrRefs {return [first].concat(rest)}
/ last:valueOrRef _ ","? _{return [last]}

valueOrRefTuple
	= "(" _ first:valueOrRef _ "," _ second:valueOrRef ")" { return {type:"tuple", value:{first:first,second:second}}}

value
    = value:object {return {type:"object", value:value}}
    / value:array {return {type:"array", value:value}}
    / value:primitive

values
    = first:value _ "," _ rest:values {return [first].concat(rest)}
/ last:value {return [last]}

ref
	= "$ref(" _ options:options? _ ")" {return {type:"ref", value:options}}

object
    = "{" _ pairs:keyValuePairs? _ "}" {return pairs}

array
    = "[" _ values:valueOrRefs? _ "]" { return values}

primitive
    = value:number {return {type:"number", value:value}}
    / value:string {return {type:"string", value:value}}
    / value:boolean {return {type:"boolean", value:value}}

string "string"
    = "\"" letters:doubleStringCharacter* "\""  { return makeString(letters); }
/ "\'" letters:singleStringCharacter* "\'"  { return makeString(letters); }

doubleStringCharacter
    = !('"' / "\\") char:. { return char; }
/ "\\" sequence:EscapeSequence { return sequence; }

singleStringCharacter
    = !("'" / "\\") char:. { return char; }
/ "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
    = "'"
    / '"'
    / "\\"
    / "b"  { return "\b";   }
/ "f"  { return "\f";   }
/ "n"  { return "\n";   }
/ "r"  { return "\r";   }
/ "t"  { return "\t";   }
/ "v"  { return "\x0B"; }

number "number"
    = digits:[0-9]+ { return makeInteger(digits); }

boolean "boolean"
    = "true" {return true;}
/ "false" {return false;}

    


_ "whitespace"
    = [ \t\r\n]*

