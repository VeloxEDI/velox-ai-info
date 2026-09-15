---
title: AddBoolean
description: Appends an owned JSON Boolean node and returns its borrowed mutable reference.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, boolean]
---

```Delphi
function AddBoolean(const aValue: Boolean): TJSONBoolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddBoolean(True);
    Values.AddBoolean(False);
    Value := Values.AsString;  // [true,false]
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddBoolean` appends an owned JSON Boolean node and returns its borrowed mutable reference.

### Additional Technical Info
`AddBoolean` allocates a `TJSONBoolean`, stores the supplied value, appends it and returns the node. Compact serialization uses the lowercase JSON literals `true` and `false`.

The array owns the returned node. Its `Value` can be changed while it remains in the array, but the reference must not be freed and becomes invalid after deletion, erase, successful content replacement or parent destruction.

This method accepts a Boolean value only; it does not parse text such as `'true'`. When reading untrusted JSON, validate the parsed node's `ValueType` rather than relying on truthy string conventions.

**External references**

- [RFC 8259 section 3: Values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
