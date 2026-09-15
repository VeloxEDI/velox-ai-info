---
title: dupError
description: "Rejects a comparator-equal insertion into a sorted TStringList by raising a duplicate-string exception before insertion."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, duplicates, stringlist, sorted, exception]
---

```Delphi
dupError = 2
```

### Example

```Delphi
procedure RejectDuplicateNames(const Names: TStringList);
begin
  Names.Sorted := True;
  Names.Duplicates := dupError;
end;
```

### Usage

`dupError` rejects a comparator-equal insertion into a sorted TStringList by raising a duplicate-string exception before insertion.

### Additional Technical Info
`dupError` is ordinal 2 of [`TDuplicates`](../../Types/Enumerations/TDuplicates.md). When a sorted [`TStringList`](../../Classes/Lists/TStringList.md) finds an equal existing value, `Add`/`AddObject` raises the Delphi duplicate-string/list error before inserting the new pair.

Equality uses the active list comparator, including case and locale settings. A spelling that is distinct ordinally can therefore be rejected as equal. Configure comparison, `Duplicates` and `Sorted` before population so all entries follow one contract.

The failed insertion does not transfer/store the new associated object. If the caller created that object, the caller still owns it and must release it on the exception path. Earlier successful additions remain; bulk population is not transactional.

With `Sorted=False`, the duplicate policy is normally ignored. The example is source-reviewed only; no duplicate exception was raised.

**External references**

- [Embarcadero TDuplicates](https://docwiki.embarcadero.com/Libraries/en/System.Classes.TDuplicates) - `dupError` definition.
- [Free Pascal TDuplicates](https://www.freepascal.org/docs-html/rtl/classes/tduplicates.html) - compatible policy.

<small>Created 2026-07-15</small>
