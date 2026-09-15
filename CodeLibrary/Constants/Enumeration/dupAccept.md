---
title: dupAccept
description: "Allows a sorted TStringList insertion even when the active comparator finds an equal existing string."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, duplicates, stringlist, sorted, accept]
---

```Delphi
dupAccept = 1
```

### Example

```Delphi
procedure AllowDuplicateNames(const Names: TStringList);
begin
  Names.Sorted := True;
  Names.Duplicates := dupAccept;
end;
```

### Usage

`dupAccept` allows a sorted TStringList insertion even when the active comparator finds an equal existing string.

### Additional Technical Info
`dupAccept` is ordinal 1 of [`TDuplicates`](../../Types/Enumerations/TDuplicates.md). In a sorted [`TStringList`](../../Classes/Lists/TStringList.md), it allows insertion after `Find` reports an equal existing value.

Equality follows the list's current `CaseSensitive`, locale/use-locale and comparator behavior; it is not guaranteed to mean ordinal byte/code-unit identity. The new string and its associated object reference are both inserted, increasing Count. Relative order among comparator-equal entries should not be treated as stable.

When `Sorted=False`, duplicate policy is not consulted and ordinary append/insert behavior can accept duplicates regardless of this value. Changing the policy does not scan, reorder or remove existing entries.

Use this only where multiplicity is part of the data contract. The example is source-reviewed only; no list was mutated.

**External references**

- [Embarcadero TDuplicates](https://docwiki.embarcadero.com/Libraries/en/System.Classes.TDuplicates) - duplicate policy definitions.
- [Free Pascal TDuplicates](https://www.freepascal.org/docs-html/rtl/classes/tduplicates.html) - compatible enum.

<small>Created 2026-07-15</small>
