---
title: GetFieldNames
description: Replaces a supplied TStrings list with current field names or updated field-definition names.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, getfieldnames, schema, list]
---

```Delphi
procedure GetFieldNames(List: TStrings);
```

### Example

```Delphi
procedure ReadFieldNames(const Data: TvxClientDataSet; const Names: TStringList);
begin
  Data.GetFieldNames(Names);
end;
```

### Usage

`GetFieldNames` replaces a supplied TStrings list with current field names or updated field-definition names.

- Pass a caller-owned `TStringList` and free it in the owning scope.
- Expect the target to be cleared.
- Treat names as schema metadata, not trusted SQL fragments.

### Additional Technical Info
`GetFieldNames` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The caller owns the target list and must pass a live concrete `TStrings` descendant.

#### Source-backed behaviour

When current field components exist, the modified base calls `List.SetStrings(FieldList)`; otherwise it calls `FieldDefs.Update` and then copies `FieldDefList`. `SetStrings` clears the target and copies names, so prior target contents are replaced rather than appended.

Updating field definitions can ask the concrete dataset/provider for metadata and can fail even without opening all record data. A nil target dereferences and raises.

#### Related members

[`FieldCount`](../Properties/FieldCount.md) counts instantiated fields. [`FindField`](FindField.md) and [`FieldByName`](FieldByName.md) resolve a selected name.

#### Official RTL references

- [Embarcadero: TDataSet.GetFieldNames](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.GetFieldNames)
- [Free Pascal: TDataSet.GetFieldNames](https://www.freepascal.org/docs-html/fcl/db/tdataset.getfieldnames.html)

<small>Created 2026-07-15</small>
