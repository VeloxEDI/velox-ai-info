---
title: Values
description: Returns the first case-insensitive borrowed value and inserts an owned null-marked String when the requested name is missing.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, values, default-property]
---

```Delphi
property Values[const aName: String]: TJSONValue read; default;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.Create;
  try
    Payload['status'].AsString := 'ready';
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`Values` returns the first case-insensitive borrowed value and inserts an owned null-marked String when the requested name is missing.

### Additional Technical Info
`Values[name]` is the default property, so `Object[name]` is equivalent. It searches in insertion order using case-insensitive `SameText` and returns the first matching child as a borrowed mutable `TJSONValue`.

On a miss, the getter mutates the object. It calls inherited `AddNull(name)`, creates an owned `TJSONString`, preserves the requested spelling in its `Name`, marks it null, appends it and returns that node. `ValueCount` increases and serialization now includes `"name":null`. Use [`FindValue`](../Methods/FindValue.md) or [`Contains`](../Methods/Contains.md) for an observational lookup.

The example intentionally uses the side effect as a string setter: missing lookup creates a String node and `AsString := 'ready'` clears its null flag. Other conversion setters still operate on that same `TJSONString`; for example, `Object['count'].AsInteger := 2` stores String text and serializes as `"count":"2"`, not a JSON number. Use typed add helpers for typed nodes.

The returned reference is parent-owned. Never free it separately, and do not retain it after deletion, erase, successful replacement or parent destruction. Duplicate names return the first physical field. A null existing field is returned as-is; it is not replaced.

Names are later serialized without escaping. Validate `aName` before using this property with external input.

**External references**

- [RFC 8259 section 4: Objects and name uniqueness](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero default array properties](https://docwiki.embarcadero.com/RADStudio/Florence/en/Properties_(Delphi))
- [Free Pascal default properties](https://www.freepascal.org/docs-html/ref/refse38.html) - compatible Object Pascal property context.

<small>Created 2026-07-20</small>
