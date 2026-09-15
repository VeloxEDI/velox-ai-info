---
title: Name
description: Stores the raw case-preserving object-field name without validation, escaping or uniqueness enforcement.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, name, object-field, escaping]
---

```Delphi
property Name: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Item: TJSONValue;
begin
  Document := TJSONObject.Create;
  try
    Item := Document.AddString('oldName', 'ready');
    Item.Name := 'status';
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

Stores the raw case-preserving object-field name without validation, escaping or uniqueness enforcement.

### Additional Technical Info
`Name` is a raw Unicode String stored on every `TJSONValue`. An owning `TJSONObject` uses each child's current name as its field name. Assignment is immediate: renaming a borrowed child changes subsequent object lookup/serialization without removing or re-inserting it. Duplicate names are allowed, and case-insensitive object lookup returns the first physical match.

No validation, normalization or escaping is applied. The object compact and display serializers place the name between quotation marks but do not escape quotation marks, reverse solidus or controls. Unsafe names can therefore produce invalid or misleading JSON. Validate field names before assignment. The original case is preserved even though object lookup uses case-insensitive `SameText`.

Array serializers ignore child names, so changing an array item's `Name` has no output effect. A root value's name is likewise not included in its own `AsString`; it becomes relevant only if that value is later inserted/copied as an object child. [`Clone`](../Methods/Clone.md) and compatible [`CopyFrom`](../Methods/CopyFrom.md) preserve the exact name.

Changing `Name` does not alter payload, null state, `ValueType` or ownership. The operation is constant-time apart from managed String assignment and provides no synchronization for concurrent object lookup/serialization.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [RFC 8259 section 7: Strings](https://www.rfc-editor.org/rfc/rfc8259#section-7)

<small>Created 2026-07-15</small>
