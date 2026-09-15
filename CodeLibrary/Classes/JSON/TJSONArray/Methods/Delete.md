---
title: Delete
description: Deletes and frees the owned child at a zero-based array index.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, delete, ownership]
---

```Delphi
procedure Delete(const aIndex: Integer);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddString('keep');
    Values.AddString('remove');
    if Values.Count > 1 then
      Values.Delete(1);
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

Deletes and frees the owned child at a zero-based array index.

### Additional Technical Info
`Delete` removes the zero-based item at `aIndex`. Because the backing `TObjectList` owns its objects, removal immediately frees that node and all descendants it owns. Any reference to the removed item or its descendants becomes dangling and must not be accessed or freed.

Valid indexes are `0` through [`Count`](../Properties/Count.md) `- 1`. A negative or too-large index raises a Delphi list error; no Boolean or empty sentinel is returned. Validate the index immediately before deletion because earlier removals shift all later positions down by one.

The method does not write the inherited private null-storage bit. This has no observable container-state consequence: `TJSONText.IsNull` always returns false, and deleting the last element produces an empty owned list that serializes as `[]` even after an earlier `IsNull=True` assignment. For identity-based deletion use [`DeleteValue`](DeleteValue.md), with its absent-value error boundary.

**External references**

- [Embarcadero `TObjectList.Delete`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList.Delete)
- [Free Pascal `TObjectList.Delete`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.delete.html) - compatible owning-list context; Velox executes Delphi.

<small>Created 2026-07-20</small>
