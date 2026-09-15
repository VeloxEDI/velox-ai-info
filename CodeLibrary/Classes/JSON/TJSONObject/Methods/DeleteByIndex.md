---
title: DeleteByIndex
description: Removes and frees one owned child at a zero-based physical index and shifts every later index down.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, delete, index]
---

```Delphi
procedure DeleteByIndex(const aIndex: Integer);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"first":1,"second":2}');
  try
    if Payload.ValueCount > 0 then
      Payload.DeleteByIndex(0);
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`DeleteByIndex` removes and frees one owned child at a zero-based physical index and shifts every later index down.

### Additional Technical Info
`DeleteByIndex` removes the child at the zero-based physical index and frees that node recursively because the backing `TObjectList` owns its entries.

Valid indexes are zero through [`ValueCount`](../Properties/ValueCount.md) minus one. A negative or too-large index raises a Delphi list exception. Check the count when input can be empty or indexes come from external data.

Deletion shifts all later physical indexes down by one. It does not reorder remaining entries otherwise. This method is the precise way to remove a particular duplicate-name occurrence identified through `ValueByIndex`.

Every reference to the deleted node or its descendants becomes invalid immediately. The object remains usable and retains its own name. Its container state remains fixed non-null: `IsNull` reads false and serialization processes the remaining fields even if the inherited private null-storage bit was previously set.

**External references**

- [Embarcadero `TObjectList.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Delete)
- [Embarcadero `TObjectList.Items`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Items)

<small>Created 2026-07-20</small>
