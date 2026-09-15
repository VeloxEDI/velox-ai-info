---
title: FieldName
description: Gets or renames the field's technical dataset identifier, with inactive-dataset and case-insensitive uniqueness rules for substantive changes.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, fieldname, rename, schema]
---

```Delphi
property FieldName: string read write;
```

### Example

```Delphi
function CurrentFieldName(const Data: TvxClientDataSet; const Name: string): string;
begin
  Result := Data.FieldByName(Name).FieldName;
end;
```

### Usage

`FieldName` gets or renames the field's technical dataset identifier, with inactive-dataset and case-insensitive uniqueness rules for substantive changes.

- Treat names as schema established before opening and avoid runtime renaming in normal flows.
- Update every external mapping/query/configuration reference if a persistent field is renamed.
- Do not rely on case-only renames generating the same field-list events as substantive changes.

### Additional Technical Info
`FieldName` is the programmatic name used by `FieldByName`, field dictionaries, mappings and many serialization paths.

#### Source-backed behaviour

Every assignment first calls `CheckInactive`; an open or opening dataset normally raises. A change that is not case-insensitively equal to the old name is treated as major: the owning collection rejects blank or duplicate names, removes the old lower-case dictionary key, assigns the new name, adds its lower-case key and reports a field-list change. A case-only rename assigns the new spelling but skips dictionary removal/addition and the `Changed` notification because the lower-case key is unchanged.

If the stored `DisplayLabel` exactly equals the assigned name, the setter clears that label so effective [`DisplayName`](DisplayName.md) still falls back to the field name. Renaming only changes dataset metadata; it does not rename a database column, SQL alias or configured mapping elsewhere.

#### Official RTL references

- [Embarcadero: TField.FieldName](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.FieldName)
- [Free Pascal: TField.FieldName](https://www.freepascal.org/docs-html/current/fcl/db/tfield.fieldname.html)

<small>Created 2026-07-15</small>
