---
title: FieldByName
description: Returns a concrete client-dataset field by its physical dataset name and raises a database error when that name is absent.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, fieldbyname, physical-name]
---

```Delphi
function FieldByName(const FieldName: string): TvxField;
```

### Example

```Delphi
function OrderNumber(const View: TdaSQLQueryDataView): string;
begin
  Result := View.FieldByName('OrderNumber').AsString;
end;
```

### Usage

`FieldByName` returns a client-dataset field by its physical dataset name and raises a database error when that name is absent.

- Use [`FieldExists`](FieldExists.md) for optional schema.
- Use this required form when a missing configured field should fail the flow immediately.
- Never free the returned reference, and reacquire it after fields are rebuilt.

### Additional Technical Info
`FieldByName` performs a required lookup against the concrete client dataset's `TFields` collection.

#### Source-backed behaviour

The hidden base returns nil. Both visible descendants call `FQuery.Fields.FieldByName(FieldName)`, which performs the Delphi field-collection lookup and raises `EDatabaseError` when absent. The return is registered as `TvxField`, but the object remains the native concrete field created from dataset metadata; the overlay does not change ownership or storage.

This method expects the physical dataset field name (`SQLFieldName`/generated field name), not necessarily a report/DataPipeline alias. The default [`Fields`](../Properties/Fields.md) property first resolves an alias and then calls this method. Lookup is case-insensitive in the underlying field dictionary, but callers should preserve configured spelling for clarity.

#### Official terminal references

- [Embarcadero: TFields.FieldByName](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByName)
- [Free Pascal: TFields.FieldByName](https://www.freepascal.org/docs-html/current/fcl/db/tfields.fieldbyname.html)

<small>Created 2026-07-15</small>
