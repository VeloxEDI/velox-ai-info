---
title: Clear
description: Assigns database null to a stored field in the current writable record buffer, subject to the concrete field and dataset validation path.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, clear, 'null', dataset-edit]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ClearOptionalComment(const Data: TvxClientDataSet);
begin
  Data.Edit;
  Data.FieldByName('Comment').Clear;
  Data.Post;
end;
```

### Usage

`Clear` assigns database null to a stored field in the current writable record buffer, subject to the field and dataset validation path.

- Call `Edit`, `Append` or `Insert` before clearing an ordinary stored field.
- Test [`IsNull`](../Properties/IsNull.md) after the call when later logic distinguishes null from an empty string or zero.
- Do not assume [`Required`](../Properties/Required.md) rejects the null: Velox disables that base post check and gives the flag a persistence-specific meaning.

### Additional Technical Info
`Clear` is declared by hidden ancestor `TField` and is used through a concrete field returned by a dataset such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It clears one pending field value; it does not remove a field, erase a dataset or by itself persist a database update.

#### Source-backed behaviour

The compiled modified `TField.Clear` checks whether the field's `FieldKind` is in its dataset's `StoredFieldKinds`. If so, it calls `SetData` with a nil value buffer. For a client dataset that reaches `TCustomClientDataSet.SetFieldData`, the dataset must be in a write mode, read-only and field validation rules are applied, DSBase verifies the field, the active record buffer is set to null and a field-change event is emitted. The pending record still needs `Post`; Velox client-dataset `Post` commits the client buffer, not necessarily the backing database.

`TBlobField` overrides this operation with its blob-stream implementation. Non-stored calculated or lookup fields can make the base call a no-op. A detached base field is not a useful script object: the implementation dereferences its dataset before it can issue the normal missing-dataset error.

#### Official RTL references

- [Embarcadero: TField.Clear](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Clear)
- [Free Pascal: TField.Clear](https://www.freepascal.org/docs-html/current/fcl/db/tfield.clear.html)

<small>Created 2026-07-15</small>
