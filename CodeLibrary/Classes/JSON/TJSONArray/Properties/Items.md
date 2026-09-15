---
title: Items
description: Returns the borrowed mutable child at a zero-based index through the array's default property.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, items, index, ownership]
---

```Delphi
property Items[const aIndex: Integer]: TJSONValue read; default;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.LoadFromString('[{"reference":"DEMO-1001"}]');
    if (Values.Count > 0) and (Values[0].ValueType = jsObject) then
      Value := Values[0].AsObject['reference'].AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`Items` returns the borrowed mutable child at a zero-based index through the array's default property.

### Additional Technical Info
`Items[index]` returns the actual child object stored at the zero-based index. It is the default property, so `Array[index]` and `Array.Items[index]` are equivalent. The property reference cannot be replaced directly, but the returned node and its descendants are mutable.

The reference is borrowed. The array owns it and frees it on indexed/identity deletion, erase, successful load replacement or parent destruction. Never free it separately and never use it after one of those operations. To keep an independent tree, call inherited `Clone` and take ownership of that result.

Valid indexes are zero through [`Count`](Count.md) minus one. Negative or too-large indexes raise a Delphi list error. Deletion shifts later indexes down.

Use `ValueType` or `IsNull` before accessing a type-specific view. `AsArray`/`AsObject` use Delphi checked casts and raise for the wrong node class; conversion properties can also raise for malformed remote text. Names stored on array items are not used when the parent serializes them.

**External references**

- [Embarcadero default array properties](https://docwiki.embarcadero.com/RADStudio/Athens/en/Properties_(Delphi))
- [Embarcadero `TList.Items`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TList.Items)
- [Free Pascal `TList.Items`](https://www.freepascal.org/docs-html/rtl/classes/tlist.items.html) - compatible indexed-list context.

<small>Created 2026-07-20</small>
