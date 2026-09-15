---
title: Index
description: Gets or changes the field's zero-based position in its owning field collection, clamping assignments and broadcasting field/layout changes.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, index, field-order, collection]
---

```Delphi
property Index: Integer read write;
```

### Example

```Delphi
function FirstVisibleField(const Data: TvxClientDataSet): Boolean;
begin
  Result := Data.FieldByName('Code').Index = 0;
end;
```

### Usage

`Index` gets or changes the field's zero-based position in its owning field collection, clamping assignments and broadcasting field/layout changes.

- Prefer stable field names over numeric positions in mapping code.
- Reorder once during setup, not while iterating the same `Fields` collection.
- Expect data-aware consumers and field-list listeners to refresh synchronously.

### Additional Technical Info
`Index` is the field object's current position in its owning `TFields` list. It is not a SQL index, key definition, record number or [`FieldNo`](FieldNo.md).

#### Source-backed behaviour

The getter searches the parent object field's child list when one exists, otherwise the dataset's field list; a detached field returns `-1`. The setter asks the owning collection to move the field. Negative assignments clamp to zero and values at or beyond the count clamp to the last valid position. If the field is absent, the setter does nothing. A real move deletes then inserts the same reference, broadcasts a layout change and reports a field-list change.

The setter does not call `CheckInactive`, so an active dataset's presentation/order metadata can change. Existing `TField` object references remain valid, but code using numeric `Fields[...]` positions observes the new order immediately. Provider/native field ordinals are not renumbered by this list move.

#### Official RTL references

- [Embarcadero: TField.Index](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Index)
- [Free Pascal: TField.Index](https://www.freepascal.org/docs-html/current/fcl/db/tfield.index.html)

<small>Created 2026-07-15</small>
