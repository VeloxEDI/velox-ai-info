---
title: Erase
description: Frees every owned array item while retaining the same always-non-null array object for reuse.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, erase, clear, ownership]
---

```Delphi
procedure Erase;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddString('old');
    Values.Erase;
    Values.AddString('new');
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`Erase` frees every owned array item while retaining the same always-non-null array object for reuse.

### Additional Technical Info
`Erase` calls `fItems.Clear`. The owning list immediately frees every child recursively and sets [`Count`](../Properties/Count.md) to zero. The `TJSONArray` object itself remains usable, but all previously returned item/descendant references become invalid.

The method does not change `Name` or the inherited private null-storage bit. The stored bit is not a public array state: `TJSONText.IsNull` always returns false and `AsString` serializes an erased array as `[]`, even if a caller previously assigned `IsNull=True`. No null reset is required before reuse. The script `NotNull` property is misbound and also reads false, so use `not Values.IsNull` when a positive predicate is required.

Inherited virtual `Clear` dispatches to the array override, which simply calls this same `Erase` implementation rather than the ancestor behavior that marks a scalar null. `Clear` and `Erase` are therefore equivalent for arrays in this product version.

**External references**

- [Embarcadero `TObjectList.Clear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList.Clear)
- [Free Pascal `TObjectList.Clear`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.clear.html) - compatible owning-list context.

<small>Created 2026-07-20</small>
