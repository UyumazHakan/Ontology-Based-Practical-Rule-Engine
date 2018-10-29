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
    = seq:querySequence { return {"seq":seq}}

querySequence "seq"
    = query "\n" querySequence
/ query

query
    = header:queryHeader body:queryBody"\n"* { return Object.assign(header,body)}


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

queryOptions "options"
    = "(" options:_queryOptions ")" {return {"options":options}}

_queryOptions
    = option:queryOption "," options:_queryOptions {return Object.assign(option,options);}
/ queryOption

queryOption
    = name:name ":" value:primitive {return makeObject(name, value)}
/  name:name { return makeObject(name, true); }

queryBody
    = "{" _ pairs:keyValuePairs? _ "}" {return pairs;}

keyValuePairs
    = pair:keyValuePair "," pairs:keyValuePairs {return Object.assign(pair,pairs);}
/ keyValuePair

keyValuePair
    = name:name ":" value:value {return makeObject(name, value)}

name
    = letters:[a-zA-z]* { return makeString(letters); }

value
    = object
    / array
    / primitive

values
    = value _ "," _ values
/ value

object
    = "{" _ keyValuePairs? _ "}"

array
    = "[" _ values _ "]"

primitive
    = number
    / string
    / boolean

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

