---
title: AddBoolean
description: Adds a named owned Boolean node whose compact and formatted representations use exact lowercase JSON literals.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addboolean, boolean, ownership]
---

```Delphi
function AddBoolean(const aName: String;
  const aValue: Boolean): TJSONBoolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddBoolean('enabled', True);
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddBoolean` adds a named owned Boolean node whose compact and formatted representations use exact lowercase JSON literals.

### Additional Technical Info
`AddBoolean` allocates `TJSONBoolean`, assigns its name and exact Boolean payload, then transfers the node to the concrete receiver. A parent object uses `aName` as the field name. An ancestor-typed array retains but does not serialize the name.

Both compact and display serializers emit non-null Booleans as the lowercase JSON tokens `true` or `false`, without quotes. The returned `TJSONBoolean` is a borrowed child; its `Value` can be changed, but it must not be freed independently. Parent deletion, erase/reload or destruction invalidates it.

The method does not parse truth-like text. `aValue` is already a PascalScript Boolean, so strings such as `yes` and numeric flags are not accepted at this boundary. Setting the returned node's inherited `IsNull` later makes an object emit `null`; array compact serialization checks the Boolean value type without a preliminary null check and can still emit its Boolean payload, whereas display output tests null first.

Construction or insertion errors propagate. The implementation has no cleanup if the final owning-list Add raises, so an exceptional insertion can leak the newly allocated node. The receiver and its owned collection are mutable and not thread-safe.

**External references**

- [RFC 8259 section 3: Values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-15</small>
