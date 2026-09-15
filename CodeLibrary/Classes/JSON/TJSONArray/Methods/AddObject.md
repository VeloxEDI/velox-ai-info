---
title: AddObject
description: Creates and appends an owned JSON object and returns a borrowed reference for field population.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, object, ownership]
---

```Delphi
function AddObject: TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Item: TJSONObject;
begin
  Values := TJSONArray.Create;
  try
    Item := Values.AddObject;
    Item.AddString('reference', 'DEMO-1001');
    Item.AddBoolean('active', True);
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddObject` creates and appends an owned JSON object and returns a borrowed reference for field population.

### Additional Technical Info
`AddObject` constructs an empty `TJSONObject`, assigns an unused blank child name, appends it and returns it for population. The parent array owns the object and every descendant subsequently owned by that object.

Do not free the returned reference. Deleting its array entry, erasing/replacing/freeing the array or clearing an owning ancestor frees the object recursively and leaves retained references dangling.

The protected add step writes the inherited private null-storage bit to false before appending. That write has no public state effect: `TJSONText.IsNull` is fixed to false for every array and the serializer always processes the owned items. Do not leave the returned object empty: the current object serializer unconditionally removes its last character as though it were a trailing comma, so an empty object emits `}` instead of `{}` and makes the array invalid JSON. Add at least one field before serializing.

Object field names are inserted between quotes without escaping. A name containing quote, backslash or control characters can also produce invalid JSON. Restrict names to the endpoint's reviewed schema and validate the final representation before sending it.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero `TObjectList.OwnsObjects`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList.OwnsObjects)

<small>Created 2026-07-20</small>
