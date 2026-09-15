---
title: AsBoolean
description: Reads or writes a field through its concrete descendant's Boolean conversion, with null, text and unsupported-type behaviour determined by that field class.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, boolean, conversion, 'null']
---

```Delphi
property AsBoolean: Boolean read write;
```

### Example

```Delphi
function IsEnabled(const Data: TvxClientDataSet): Boolean;
begin
  Result := (not Data.FieldByName('Enabled').IsNull) and
    Data.FieldByName('Enabled').AsBoolean;
end;
```

### Usage

`AsBoolean` reads or writes a field through its field's Boolean conversion, with null, text and unsupported-type behaviour determined by that field class.

- Prefer this member for [`TBooleanField`](../../../Data/TBooleanField.md) or a field whose `DataType` contract explicitly supports Boolean conversion.
- Do not use truthiness assumptions for arbitrary strings; validate the accepted source representation.
- Treat conversion, range, read-only, not-editing and `OnValidate` failures as normal exceptions.

### Additional Technical Info
`AsBoolean` is the Boolean conversion contract declared by hidden `TField`. The runtime object returned by [`FieldByName`](../../TDataSet/Methods/FieldByName.md) is normally a concrete Delphi field descendant; that descendant, not the PascalScript helper, performs the conversion.

#### Source-backed behaviour

The runtime helper delegates directly to native `TField.AsBoolean`. Base `TField.GetAsBoolean` and `SetAsBoolean` both raise a field-access `EDatabaseError`, so the property is usable only when the actual descendant implements the conversion. `TBooleanField` reads and writes its native Boolean buffer. Delphi string fields also implement a conversion: reading is true only when the first character is `T`, `t`, `Y` or `y`; other text, including `False`, reads false, while Boolean writes use the descendant's string representation.

Concrete numeric and variant fields may provide additional conversions. A null Boolean-capable field normally reads the descendant's default Boolean (`False`), which loses the distinction between null and false; check [`IsNull`](IsNull.md) first when that distinction matters. Writes require a client dataset write state and can invoke field validation and change notifications.

#### Official RTL references

- [Embarcadero: TField.AsBoolean](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsBoolean)
- [Free Pascal: TField.AsBoolean](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asboolean.html)

<small>Created 2026-07-15</small>
