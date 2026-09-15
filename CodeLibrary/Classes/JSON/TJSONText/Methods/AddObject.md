---
title: AddObject
description: Creates a named owned child object and returns a borrowed reference, including the empty-object compact serialization defect.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addobject, object, ownership, empty]
---

```Delphi
function AddObject(const aName: String): TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document, Detail: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Detail := Document.AddObject('detail');
    Detail.AddString('status', 'ready');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddObject` creates a named owned child object and returns a borrowed reference, including the empty-object compact serialisation defect.

### Additional Technical Info
`AddObject` creates an empty `TJSONObject`, assigns `aName`, transfers it to the receiver and returns the same child for population. The parent owns it and all descendants later inserted into it; the result is borrowed and must not be freed separately.

The native method has a blank-name default, but the PascalScript declaration requires `aName`. Objects serialize the name as a field. An array held as `TJSONText` can receive a named object through this overload, but array output ignores the stored child name.

Populate the result before requesting compact output. A non-null empty object has a serializer defect: it removes its opening brace as though it were a trailing comma and emits only `}`. Formatted [`AsDisplayText`](../Properties/AsDisplayText.md) emits a complete empty object over two lines. Object names are inserted without JSON escaping in both forms.

Deleting the field/array entry, erasing or reloading the parent, or freeing the parent recursively frees this object and invalidates retained references. Creation and insertion are not exception-guarded; an owning-list insertion failure can leak the new object.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero `TObjectList.OwnsObjects`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.OwnsObjects)
- [Free Pascal `TObjectList.OwnsObjects`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.ownsobjects.html) - compatible ownership context.

<small>Created 2026-07-15</small>
