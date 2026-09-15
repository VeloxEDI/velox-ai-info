---
title: AddNull
description: Adds a null-marked string node that currently serializes as an empty JSON string instead of null.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, 'null', quirk]
---

```Delphi
function AddNull: TJSONValue;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddNull;
    Value := Values.AsString;  // Current implementation: [""]
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddNull` adds a null-marked string node that currently serializes as an empty JSON string instead of null.

### Additional Technical Info
Despite its name, `AddNull` creates a `TJSONString`, sets `IsNull=True`, appends it and returns it. The array serializer switches on `ValueType`; because the node is `jsString`, it quotes its null-aware blank `AsString`. The emitted value is therefore `""`, not the JSON literal `null`.

This is a material implementation defect. Do not use `AddNull` when an external contract requires JSON null. A real `TJSONNull` produced by parsing `null` has `ValueType=jsNull` and serializes correctly, but this array-specific surface exposes no direct real-null constructor.

The returned node is owned by the array. Do not free it, and do not retain it after deletion, erase, replacement or parent destruction. `IsNull=True` on the returned node does not repair the array serialization defect.

**External references**

- [RFC 8259 section 3: JSON values and null](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
