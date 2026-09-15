---
title: DeleteValue
description: Finds a child by object identity, then deletes and frees it, raising when it is absent.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, delete, identity, ownership]
---

```Delphi
procedure DeleteValue(const aValue: TJSONValue);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Added: TJSONValue;
begin
  Values := TJSONArray.Create;
  try
    Added := Values.AddString('temporary');
    Values.DeleteValue(Added);
    Added := nil;  // The node was freed by the array.
    Value := Values.Count;
  finally
    Values.Free;
  end;
end;
```

### Usage

`DeleteValue` finds a child by object identity, then deletes and frees it, raising when it is absent.

### Additional Technical Info
`DeleteValue` calls the backing list's `IndexOf` and then delegates to indexed deletion. Matching uses the exact object reference, not JSON content, name or [`IsEqual`](../../TJSONValue/Methods/IsEqual.md). A separate clone with identical text is not a match.

The array owns a matching node and frees it during deletion. Set any caller variable holding that node to `nil` and discard descendant references. Do not call `Free` before or after this method.

If `aValue` is `nil`, belongs to another array, was already removed or is merely an equal clone, `IndexOf` returns `-1`; indexed deletion then raises a list-range error. The method has no harmless not-found path. Confirm identity by iterating `Items` before calling when absence is possible.

**External references**

- [Embarcadero `TList.IndexOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TList.IndexOf)
- [Embarcadero `TObjectList.Delete`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList.Delete)
- [Free Pascal `TObjectList`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.html) - compatible identity/ownership context.

<small>Created 2026-07-20</small>
