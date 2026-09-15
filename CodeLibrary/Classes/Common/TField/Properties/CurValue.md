---
title: CurValue
description: Reads the client dataset's current reconciled state value for a stored field, distinguishing an unavailable or unchanged value from explicit database Null.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, curvalue, change-log, variant]
---

```Delphi
property CurValue: Variant read;
```

### Example

```Delphi
function CurrentServerValue(const Data: TvxClientDataSet): Variant;
begin
  Result := Data.FieldByName('Status').CurValue;
end;
```

### Usage

`CurValue` reads the client dataset's current reconciled state value for a stored field, distinguishing an unavailable or unchanged value from explicit database Null.

- Test `VarIsEmpty`/`VarIsClear` for `Unassigned` separately from `VarIsNull`.
- Use ordinary `Value` for the active pending record; use this member only in change-log/reconciliation logic that understands client-dataset state buffers.
- Do not assume it performs a new database query or reflects a concurrent server change.

### Additional Technical Info
`CurValue` reads a field using dataset state `dsCurValue`. It is a client-dataset change/reconciliation view, not a synonym for the current record's ordinary [`Value`](Value.md).

#### Source-backed behaviour

`TField.GetCurValue` delegates to `DataSet.GetStateFieldValue(dsCurValue, Self)`. The base dataset temporarily changes its internal state, calls the concrete field's `AsVariant`, then restores the previous state; non-stored field kinds return `Null`. `TCustomClientDataSet` adds DSBase blank-state handling: `BLANK_NOTCHANGED` becomes `Unassigned`, `BLANK_NULL` becomes `Null`, and only a present value is converted through the field.

When no current-value buffer is available, the client override also yields `Unassigned`. Therefore callers must not interpret every non-value as database null. The temporary state change is internal and restored with `finally`, but descendant getters and conversion exceptions can still propagate.

#### Official RTL references

- [Embarcadero: TField.CurValue](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.CurValue)
- [Free Pascal: TField.CurValue](https://www.freepascal.org/docs-html/current/fcl/db/tfield.curvalue.html)

<small>Created 2026-07-15</small>
