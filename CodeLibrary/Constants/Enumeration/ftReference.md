---
title: ftReference
description: Identifies a database REF value exposed through a specialised nested-dataset reference field.
sidebar_position: 121
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, reference, ref, nested]
---

```Delphi
ftReference = 28
```

### Example

```Delphi
function IsDatabaseReference(Field: TField): Boolean;
begin
  Result := Field.DataType = ftReference;
end;
```

### Usage

`ftReference` identifies a database REF value exposed through a specialised nested-dataset reference field.

### Additional Technical Info
`ftReference` is ordinal 28 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TReferenceField`, a `TDataSetField` descendant with `ReferenceTableName` metadata and nested-dataset behavior.

It is a database object/reference concept, not a Pascal pointer, URL or foreign-key scalar. Identity, dereferencing, update behavior, dangling references and transaction visibility are provider/database contracts. Do not serialize an internal reference representation or assume it remains valid outside its session.

Use schema-supported identity values for cross-system mappings. Keep a Null reference distinct from a referenced row whose fields are Null.

The example only inspects metadata and was source-reviewed; no reference dereference, nested dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TReferenceField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TReferenceField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; REF support is provider-specific.

<small>Created 2026-07-15</small>
