---
title: AddArray
description: Creates a named child array, transfers it to the receiver's ownership and returns a borrowed reference for immediate population.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addarray, ownership, array]
---

```Delphi
function AddArray(const aName: String): TJSONArray;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Lines: TJSONArray;
begin
  Document := TJSONObject.Create;
  try
    Lines := Document.AddArray('lines');
    Lines.AddString('first');
    Lines.AddString('second');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddArray` creates a named child array, transfers it to the receiver's ownership and returns a borrowed reference for immediate population.

### Additional Technical Info
`AddArray` constructs an empty `TJSONArray`, assigns `aName`, passes it to the receiver's concrete Add implementation and returns it. The parent object or array takes ownership; the result is borrowed and must not be freed separately.

The native method defaults `aName` to an empty string, but the PascalScript declaration does not preserve that default. Scripts must pass the argument. For a `TJSONObject`, the name becomes the serialized field name. If an array is held through a `TJSONText` variable and this named ancestor overload is called, the child retains the name internally but array serializers ignore child names.

The returned array can be populated immediately. Deleting it from the parent, erasing/reloading the parent or freeing the parent recursively frees the array and its descendants; any retained reference then dangles. Adding a nested container is constant-time before its later descendants, while serialization and destruction scale with the complete subtree.

There is no exception cleanup around construction followed by insertion. An allocation or owning-list insertion failure propagates, and a failure during final insertion can leak the newly created array. The receiver must be a live concrete `TJSONObject` or `TJSONArray`; raw `TJSONText` cannot supply the abstract Add primitive.

Empty output depends on context and format. The child array compact form is `[]`, while [`AsDisplayText`](../Properties/AsDisplayText.md) emits `[ ]`. The enclosing object still has the known unescaped-field-name defect, so validate `aName` before sending JSON to a strict consumer.

**External references**

- [RFC 8259 section 5: Arrays](https://www.rfc-editor.org/rfc/rfc8259#section-5)
- [Embarcadero `TObjectList.OwnsObjects`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.OwnsObjects)
- [Free Pascal `TObjectList.OwnsObjects`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.ownsobjects.html) - compatible ownership context.

<small>Created 2026-07-15</small>
