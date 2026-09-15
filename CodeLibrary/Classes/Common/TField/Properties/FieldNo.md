---
title: FieldNo
description: Returns the concrete provider/backend field ordinal after Delphi object-field offset adjustment; it is not the zero-based Fields collection index.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, fieldno, ordinal, provider]
---

```Delphi
property FieldNo: Integer read;
```

### Example

```Delphi
function BackendOrdinal(const Data: TvxClientDataSet; const Name: string): Integer;
begin
  Result := Data.FieldByName(Name).FieldNo;
end;
```

### Usage

`FieldNo` returns the provider/backend field ordinal after object-field offset adjustment; it is not the zero-based Fields collection index.

- Use `FieldName` for business mappings; treat this number as schema metadata for diagnostics.
- Never assume it is zero-based, contiguous or stable across query/schema/provider changes.
- Do not use it to index `Fields`; use `Index` or `Fields[...]` for collection position.

### Additional Technical Info
`FieldNo` identifies the field position used by the dataset/provider's low-level record APIs. It is distinct from [`Index`](Index.md).

#### Source-backed behaviour

The getter begins with the internally assigned `FFieldNo`. For ordinary top-level, blob or non-data fields it returns that value. For a child data field it applies the field's own positive object offset, or walks parent object fields until it finds a positive offset and adds `Parent.Offset * (Parent.Size + 1)`. This supports flattened/object-field layouts.

Client-dataset code passes this number to DSBase operations such as `GetField`, `PutField` and `VerifyField`; positive values are normally native stored-field ordinals. Calculated/lookup fields may have non-positive numbers. Reordering the public field collection with `Index` does not necessarily change `FieldNo`.

#### Official RTL references

- [Embarcadero: TField.FieldNo](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.FieldNo)
- [Free Pascal: TField.FieldNo](https://www.freepascal.org/docs-html/current/fcl/db/tfield.fieldno.html)

<small>Created 2026-07-15</small>
