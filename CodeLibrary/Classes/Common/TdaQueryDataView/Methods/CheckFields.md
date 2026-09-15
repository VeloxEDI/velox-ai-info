---
title: CheckFields
description: Concatenates selected physical field values from a comma-tokenized name list as a change hint, retaining the collision and null-loss limits of CheckAll.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, field-list, change-detection]
---

```Delphi
function CheckFields(aFieldNames: string): string;
```

### Example

```Delphi
function AddressChangeInput(const View: TdaSQLQueryDataView): string;
begin
  Result := View.CheckFields('Address1,Address2,PostCode');
end;
```

### Usage

`CheckFields` concatenates selected physical field values from a comma-tokenized name list as a change hint, retaining the collision and null-loss limits of CheckAll.

- Supply an explicit stable field order and physical names.
- Use a canonical framed serialisation for durable hashes, deduplication keys or security decisions.
- Validate the list at configuration time with [`FieldExists`](FieldExists.md).

### Additional Technical Info
`CheckFields` is the selected-field counterpart to [`CheckAll`](CheckAll.md). Its result is suitable only as an input to tolerant change detection, not as a canonical composite key.

#### Source-backed behaviour

The method reuses the view's cached `TvxStringAppend`, resets it, tokenizes `aFieldNames` with Velox `StringToToken` using comma as the separator, then appends `FieldByName(token).AsString` in supplied token order. The temporary `TStringList` is freed in `finally`, and the partially built data is assigned to the local result even if field lookup/conversion raises; the exception still propagates so the caller does not receive that partial value normally.

No separator, length, name, type or null marker is inserted between values. Composite collisions and null/empty collapse remain. This method uses physical dataset names through `FieldByName`, not the DataPipeline aliases accepted by the default [`Fields`](../Properties/Fields.md) property. The cached builder makes concurrent calls on one view unsafe.

#### Official terminal references

- [Embarcadero: TField.AsString](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsString)
- [Free Pascal: TField.AsString](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asstring.html)

<small>Created 2026-07-15</small>
