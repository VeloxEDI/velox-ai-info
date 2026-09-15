---
title: AddNull
description: Adds a named null-marked String node whose compact array representation incorrectly differs from object and display output.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addnull, 'null', string, serialization]
---

```Delphi
function AddNull(const aName: String): TJSONValue;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddNull('completedAt');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddNull` adds a named null-marked String node whose compact array representation incorrectly differs from object and display output.

### Additional Technical Info
`AddNull` does not create `TJSONNull`. It creates `TJSONString`, assigns `aName`, sets inherited `IsNull=True` and transfers the child to the receiver. The result is correctly declared as `TJSONValue`, but its runtime `ValueType` remains `jsString` even while it semantically represents null.

For a `TJSONObject`, compact and formatted serializers check `IsNull` before String type and emit JSON `null`. For a `TJSONArray` reached through this ancestor, compact serialization switches on `ValueType` first and emits `""`; [`AsDisplayText`](../Properties/AsDisplayText.md) checks null first and emits `null`. Selecting compact versus display output can therefore change the data value, not merely whitespace.

The returned node is borrowed and owned by its parent. Writing `AsString` to it calls the String setter, clears the null flag and turns the placeholder into an ordinary string. Deleting/reloading/freeing the parent invalidates any retained reference.

`aName` is used as an object key but ignored in array output. Object field names are not escaped, so quote, backslash or control characters can still make the containing JSON invalid. Allocation or final insertion failure propagates and can leak the newly allocated String node.

**External references**

- [RFC 8259 section 3: JSON null](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-15</small>
