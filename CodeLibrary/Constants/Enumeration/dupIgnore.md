---
title: dupIgnore
description: "Keeps the existing comparator-equal entry in a sorted TStringList and skips inserting the new string/object pair."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, duplicates, stringlist, sorted, ignore]
---

```Delphi
dupIgnore = 0
```

### Example

```Delphi
procedure KeepFirstName(const Names: TStringList);
begin
  Names.Sorted := True;
  Names.Duplicates := dupIgnore;
end;
```

### Usage

`dupIgnore` keeps the existing comparator-equal entry in a sorted TStringList and skips inserting the new string/object pair.

### Additional Technical Info
`dupIgnore` is ordinal 0 and the default policy of [`TDuplicates`](../../Types/Enumerations/TDuplicates.md) for a newly created [`TStringList`](../../Classes/Lists/TStringList.md). During sorted insertion, if `Find` reports an equal string, `AddObject` exits with the existing index and does not call `InsertItem`.

This is keep-first behavior, not replacement. The existing string/object pair remains. The new string and new object reference are not stored; if the caller created the object, it still owns it and must release it. Code that treats the returned existing index as proof the new object was attached can leak or later access the wrong object.

Equality uses current case/locale comparison. When `Sorted=False`, the policy is not consulted and duplicates can be appended. It does not remove duplicates already present or repair a list whose physical order was broken.

The example is source-reviewed only; no list insertion occurred.

**External references**

- [Embarcadero TDuplicates](https://docwiki.embarcadero.com/Libraries/en/System.Classes.TDuplicates) - duplicate policy definitions.
- [Free Pascal TDuplicates](https://www.freepascal.org/docs-html/rtl/classes/tduplicates.html) - compatible enum.

<small>Created 2026-07-15</small>
