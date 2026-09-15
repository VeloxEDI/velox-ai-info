---
title: ValueByIndex
description: Returns the borrowed mutable child at a zero-based physical index, preserving insertion order and duplicate occurrences.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, value, index]
---

```Delphi
property ValueByIndex[const aIndex: Integer]: TJSONValue read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
  Item: TJSONValue;
begin
  Payload := TJSONObject.CreateFromString('{"first":1,"second":2}');
  try
    if Payload.ValueCount > 0 then
    begin
      Item := Payload.ValueByIndex[0];
      Value := Item.Name + '=' + Item.AsString;
    end;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`ValueByIndex` returns the borrowed mutable child at a zero-based physical index, preserving insertion order and duplicate occurrences.

### Additional Technical Info
`ValueByIndex[index]` returns the actual child at a zero-based physical position. Order is insertion/parser order, including every duplicate-name occurrence. The property reference cannot be replaced, but the returned node and its `Name`/value are mutable.

Valid indexes are zero through [`ValueCount`](ValueCount.md) minus one. Negative and too-large indexes raise a Delphi list exception. Deletion shifts later indexes down.

The result is borrowed. The object owns it and frees it on indexed/name deletion, erase, successful load/copy replacement or destruction. Never free it separately or use it after one of those operations.

Changing `Name` can create duplicates or unsafe unescaped field names; no index or uniqueness structure is maintained. Use this property when duplicates must be inspected explicitly rather than collapsed by first-name lookup.

**External references**

- [Embarcadero `TObjectList.Items`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Items)
- [Free Pascal `TObjectList`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.html) - compatible indexed ownership context.

<small>Created 2026-07-20</small>
