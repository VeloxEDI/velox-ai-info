---
title: FieldExists
description: Tests whether the concrete client dataset contains a physical field name without raising for an ordinary miss.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, fieldexists, schema]
---

```Delphi
function FieldExists(const aFieldName: string): Boolean;
```

### Example

```Delphi
function HasOptionalNote(const View: TdaSQLQueryDataView): Boolean;
begin
  Result := View.FieldExists('OptionalNote');
end;
```

### Usage

`FieldExists` tests whether the client dataset contains a physical field name without raising for an ordinary miss.

- Use for genuinely optional/versioned schema, then access the field once.
- Treat required configuration fields as errors instead of silently skipping them.
- Do not use this as value validation; inspect the returned field and `IsNull` separately.

### Additional Technical Info
`FieldExists` is the non-raising physical-name probe for a concrete query DataView.

#### Source-backed behaviour

The hidden base returns false. Both visible descendants override it with `Assigned(FQuery.FindField(aFieldName))`. `FindField` searches ordinary and aggregate fields and returns nil for an absent name. It does not resolve DataPipeline aliases; use the same physical naming rules as [`FieldByName`](FieldByName.md).

A false result can also reflect that fields have not yet been created/opened for the current view configuration, so lifecycle matters. A true result says only that a field object exists; it does not prove a value is non-null, writable, or mapped to a database column. The call is a metadata lookup and does not move the record cursor.

#### Official terminal references

- [Embarcadero: TDataSet.FindField](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindField)
- [Free Pascal: TDataSet.FindField](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.findfield.html)

<small>Created 2026-07-15</small>
