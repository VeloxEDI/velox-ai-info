---
title: VariableByCode
description: Returns the first variable whose code matches the supplied string case-insensitively, or nil when none matches.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable-group, lookup, default-property]
---

```Delphi
property VariableByCode[const Code: String]: TvxVariable read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var Item: TvxVariable;
begin
  // Replace V_MyGroup and OrderType with configured names.
  Item := V_MyGroup['OrderType'];
  if Item <> nil then
    Value := Item.AsString
  else
    Value := Null;
end;
```

### Usage

`VariableByCode` returns the first variable whose code matches the supplied string case-insensitively, or nil when none matches.

**Duplicates and lifetime**

Configuration tooling is intended to keep codes unique case-insensitively. If malformed/imported configuration contains duplicates, the first child silently wins. No trimming is performed, so whitespace remains part of the code.

The returned [`TvxVariable`](../../../Config/TvxVariable.md) is borrowed. The group lock is released before the caller reads/writes it; the variable uses its own locking for many members, but group save/delete/cache reload can free/replace the object. Do not retain or free it.

Reading a variable can reveal decrypted or sensitive global content, while writing can affect unrelated executions. Missing-code tag processing behaves differently: it raises an exception rather than returning nil.

### Additional Technical Info
`VariableByCode` is the read-only string indexer on [`TvxVariableGroup`](../../TvxVariableGroup.md).

It is also the class's default property, so these forms are equivalent:

```Delphi
Item := V_MyGroup.VariableByCode['OrderType'];
Item := V_MyGroup['OrderType'];
```

**Lookup algorithm**

While holding the group lock, Velox scans children from index zero and compares each variable Code with the supplied value using case-insensitive `SameText`. It returns the first match. If no child matches, it returns nil; absence is not an exception at this layer.

The lookup is linear, so repeated access is O(VariableCount). Store the returned reference only for immediate local use when several members are needed, and always nil-check it.

<small>Created 2026-07-15</small>
