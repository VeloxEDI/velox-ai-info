---
title: FindValue
description: Returns the first case-insensitive borrowed field match or nil without mutating the object on a miss.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, find, lookup]
---

```Delphi
function FindValue(const aName: String): TJSONValue;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
  Item: TJSONValue;
begin
  Payload := TJSONObject.CreateFromString('{"Reference":"DEMO-1001"}');
  try
    Item := Payload.FindValue('reference');
    if Assigned(Item) and not Item.IsNull then
      Value := Item.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`FindValue` returns the first case-insensitive borrowed field match or nil without mutating the object on a miss.

### Additional Technical Info
`FindValue` scans in insertion order and returns the first child whose `Name` matches `aName` with case-insensitive `SameText`. It returns nil when no field matches.

This is the safe observational lookup. A miss does not create a field, unlike default [`Values[name]`](../Properties/Values.md). A present null field returns its actual non-nil node, so check both assignment and `IsNull` when null and absence must be distinguished.

The returned reference is borrowed. The object owns it; never free it separately. It becomes invalid after matching deletion, erase, successful load/copy replacement or parent destruction.

Duplicate names are permitted. Only the first case-insensitive match is returned. Iterate [`ValueByIndex`](../Properties/ValueByIndex.md) when physical duplicates or exact spelling matter.

**External references**

- [Embarcadero `SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible comparison context.

<small>Created 2026-07-20</small>
