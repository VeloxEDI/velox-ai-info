---
title: Fields
description: Resolves a ReportBuilder DataPipeline field alias to its physical dataset field and returns that live field as the default indexed property.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, fields, alias, default-property]
---

```Delphi
property Fields[aFieldName: string]: TvxField read;
```

### Example

```Delphi
function CustomerReference(const View: TdaSQLQueryDataView): string;
begin
  Result := View['Customer Reference'].AsString;
end;
```

### Usage

`Fields` resolves a ReportBuilder DataPipeline field alias to its physical dataset field and returns that live field as the default indexed property.

- Use this default property when scripts are intentionally authored against configured report aliases.
- Use `FieldByName`/`FieldExists` for physical schema names.
- Do not free or retain the field after the dataset fields are recreated.

### Additional Technical Info
`Fields[...]` is the default DataView property. Unlike [`FieldByName`](../Methods/FieldByName.md), its input is a DataPipeline/report field alias.

#### Source-backed behaviour

The PascalScript helper delegates to `GetFieldForAlias`. That method calls `DataPipelines[0].FieldNameForFieldAlias(aFieldName)`. When a physical name is returned, it calls `FieldByName` and casts the live native `TField` to the `TvxField` API overlay. If resolution returns an empty string, it raises `EDatabaseError` with “Field '...' not found”.

The returned object is dataset-owned and represents the current record. Alias mapping can differ from `SQLFieldName`/physical field name and can change with DataView configuration. The overlay exposes Velox helpers but does not make an incompatible native field safe for every cast-based helper.

#### Official terminal references

- [Embarcadero: TFields.FieldByName](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByName)
- [Free Pascal: TFields.FieldByName](https://www.freepascal.org/docs-html/current/fcl/db/tfields.fieldbyname.html)

<small>Created 2026-07-15</small>
