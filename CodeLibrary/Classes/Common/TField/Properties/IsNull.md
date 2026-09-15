---
title: IsNull
description: Tests whether the current dataset-state buffer contains no value for the field, preserving the distinction from empty text, zero and false.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, isnull, 'null', field-buffer]
---

```Delphi
property IsNull: Boolean read;
```

### Example

```Delphi
function HasCustomerReference(const Data: TvxClientDataSet): Boolean;
begin
  Result := not Data.FieldByName('CustomerRef').IsNull;
end;
```

### Usage

`IsNull` tests whether the current dataset-state buffer contains no value for the field, preserving the distinction from empty text, zero and false.

- Test this property before typed access whenever absence has business meaning.
- Use [`Clear`](../Methods/Clear.md) or assign Variant `Null` to request null in a pending write.
- Do not infer database-column nullability or [`Required`](Required.md) enforcement from the current result.

### Additional Technical Info
`IsNull` tests the field value represented by the dataset's current internal state and active record buffer.

#### Source-backed behaviour

`TField.GetIsNull` calls `GetData` and returns true when that call reports no value. `GetData` reads through the owning dataset except during validation, where it can read the temporary validation buffer. Client datasets obtain blank/null state from DSBase. Consequently the answer follows the active dataset state—browse, edit, insert, old/new/current value, filter or calculation—not an independent database query.

Null is different from `''`, `0`, `False`, an empty blob and Variant `Unassigned`. Typed getters often return those type defaults for null and therefore discard this distinction. A missing dataset raises; conversion is not required merely to test the buffer. The operation is normally constant-time and side-effect free, although provider/lazy blob details are descendant concerns.

#### Official RTL references

- [Embarcadero: TField.IsNull](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.IsNull)
- [Free Pascal: TField.IsNull](https://www.freepascal.org/docs-html/current/fcl/db/tfield.isnull.html)

<small>Created 2026-07-15</small>
