---
title: OptString
description: Returns any present non-null node's AsString view and uses the required default only for absence or semantic null.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, optional, string]
---

```Delphi
function OptString(const aName, aDefault: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"reference":"DEMO-1001"}');
  try
    Value := Payload.OptString('reference', 'UNKNOWN');
  finally
    Payload.Free;
  end;
end;
```

### Usage

`OptString` returns any present non-null node's AsString view and uses the required default only for absence or semantic null.

### Additional Technical Info
`OptString` performs a side-effect-free, case-insensitive first-match lookup. The PascalScript declaration requires `aDefault`, which is returned only when the field is absent or the matched node is null.

The node need not be a `TJSONString`. A String yields raw unquoted text, a Boolean yields `true`/`false`, Integer and Double nodes use their Delphi formatting, and arrays/objects return compact serialized text. Structured results inherit duplicate-name, empty-object, escaping and locale defects.

A present non-null empty String returns `''`, not the default. Missing lookup does not insert a null field. Duplicate names select the first physical value.

Use `FindValue` plus `ValueType` when the caller requires an actual JSON String rather than a textual view of any node.

**External references**

- [RFC 8259 section 3: JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
