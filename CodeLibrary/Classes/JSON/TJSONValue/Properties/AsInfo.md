---
title: AsInfo
description: Reads a Name-colon-value diagnostic string but writes the supplied text only as the underlying value.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, diagnostic, name, conversion]
---

```Delphi
property AsInfo: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.Name := 'status';
    Item.AsString := 'ready';
    Value := Item.AsInfo;  // status: ready
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsInfo` reads a Name-colon-value diagnostic string but writes the supplied text only as the value.

### Additional Technical Info
The getter concatenates the exact [`Name`](Name.md), the two-character separator `': '`, and the null-aware [`AsString`](AsString.md). A blank name still produces a leading `': '`. A null value contributes blank text, while an object or array contributes its complete compact serialization. The result is a diagnostic convenience, not JSON and not escaped for logging, SQL, CSV or another transport.

The writable declaration is asymmetric. Assignment does **not** parse a `name: value` pair and does not change `Name`; it passes the entire supplied String to the ordinary virtual value setter. For example, `Item.AsInfo := 'status: ready'` stores that complete text in a `TJSONString`, while the name remains unchanged. On a scalar/container of another class, normal [`AsString`](AsString.md) parse, replacement and failure behavior applies.

Do not round-trip the getter through the setter or use this text as a stable key. Object/array output can be large, contain controls, reveal all current values and inherit serializer defects. Building the result allocates a String proportional to the name plus serialized value; there is no redaction or synchronization.

<small>Created 2026-07-15</small>
