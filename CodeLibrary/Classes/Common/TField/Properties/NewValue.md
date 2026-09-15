---
title: NewValue
description: Reads or writes the client dataset's pending change-buffer value for an ordinary data field, distinguishing unchanged from explicit Null.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, newvalue, delta, change-log]
---

```Delphi
property NewValue: Variant read write;
```

### Example

```Delphi
function PendingStatus(const Data: TvxClientDataSet): Variant;
begin
  Result := Data.FieldByName('Status').NewValue;
end;
```

### Usage

`NewValue` reads or writes the client dataset's pending change-buffer value for an ordinary data field, distinguishing unchanged from explicit Null.

- Use only in code that explicitly understands client-dataset delta/reconciliation semantics.
- Distinguish `Unassigned` (not changed/not available) from `Null` (changed to database null).
- Use ordinary [`Value`](Value.md) for normal map processing of the active pending record.

### Additional Technical Info
`NewValue` addresses dataset state `dsNewValue`, used by client datasets to represent a pending/delta value rather than the ordinary active-record view.

#### Source-backed behaviour

Reading calls `GetStateFieldValue(dsNewValue, Field)`. `TCustomClientDataSet` selects its new-value buffer (or temporarily uses the active buffer), asks DSBase for the blank status, returns `Unassigned` for `BLANK_NOTCHANGED`, `Null` for `BLANK_NULL`, and otherwise converts the value through the concrete field. Non-stored field kinds return `Null`.

Writing calls `SetStateFieldValue`. It does nothing unless `FieldKind = fkData`; for a data field it temporarily switches dataset state to `dsNewValue`, assigns through `AsVariant`, then restores the old state. Client `SetFieldData` suppresses the normal field-change event in `dsNewValue`, but conversion/provider errors still propagate. This is low-level change-log behaviour and does not itself apply an update to a database.

#### Official RTL references

- [Embarcadero: TField.NewValue](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.NewValue)
- [Free Pascal: TField.NewValue](https://www.freepascal.org/docs-html/current/fcl/db/tfield.newvalue.html)

<small>Created 2026-07-15</small>
