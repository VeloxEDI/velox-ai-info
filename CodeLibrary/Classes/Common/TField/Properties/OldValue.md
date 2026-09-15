---
title: OldValue
description: Reads the field through the dataset's original-value state, returning Unassigned during insert/set-key and depending on retained client change-log data.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, oldvalue, delta, original-value]
---

```Delphi
property OldValue: Variant read;
```

### Example

```Delphi
function OriginalStatus(const Data: TvxClientDataSet): Variant;
begin
  Result := Data.FieldByName('Status').OldValue;
end;
```

### Usage

`OldValue` reads the field through the dataset's original-value state, returning Unassigned during insert/set-key and depending on retained client change-log data.

- Capture comparison values explicitly before `Post` when a flow depends on them.
- Test Variant state before comparison and distinguish `Unassigned` from `Null`.
- Use governed audit data, not this transient buffer, for historical or compliance questions.

### Additional Technical Info
`OldValue` reads the field using dataset state `dsOldValue`. It is intended for update/change-log comparison, not as a historical database audit.

#### Source-backed behaviour

`TField.GetOldValue` returns `Unassigned` immediately while the dataset is in `dsInsert` or `dsSetKey`. Otherwise it delegates to `GetStateFieldValue(dsOldValue, Self)`, which temporarily changes dataset state, reads `AsVariant` for stored field kinds and restores the previous state. Non-stored field kinds return `Null`.

The value exists only when the concrete dataset retains an old/original buffer. Velox normally opens `TvxClientDataSet` with `LogChanges=False` outside edit mode, and DataView code comments explicitly note cases where `OldValue` is no longer useful after posting. Therefore an apparently current/equal/unavailable result is not evidence that a business value never changed. No database query or audit lookup occurs.

#### Official RTL references

- [Embarcadero: TField.OldValue](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.OldValue)
- [Free Pascal: TField.OldValue](https://www.freepascal.org/docs-html/current/fcl/db/tfield.oldvalue.html)

<small>Created 2026-07-15</small>
