---
title: DisplayLabel
description: Gets or sets the optional presentation label used instead of FieldName and broadcasts a layout change when altered on an active dataset.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, displaylabel, presentation, metadata]
---

```Delphi
property DisplayLabel: string read write;
```

### Example

```Delphi
procedure LabelCustomerReference(const Data: TvxClientDataSet);
begin
  Data.FieldByName('CustomerRef').DisplayLabel := 'Customer reference';
end;
```

### Usage

`DisplayLabel` gets or sets the optional presentation label used instead of FieldName and broadcasts a layout change when altered on an active dataset.

- Keep technical field identity in `FieldName`; use this only for human-readable labelling.
- Do not depend on a mutable label in parsing, mapping or error classification.
- Expect an active dataset's data-aware presentation to refresh when the value changes.

### Additional Technical Info
`DisplayLabel` is optional presentation metadata for controls, errors and other consumers of [`DisplayName`](DisplayName.md). It does not rename the dataset field or its source column.

#### Source-backed behaviour

The getter returns `DisplayName`: an explicit stored label when non-empty, otherwise [`FieldName`](FieldName.md). On assignment, a value exactly equal to `FieldName` is normalised to an empty stored label. A changed stored value calls `PropertyChanged(True)`, which broadcasts `deLayoutChange` when the owning dataset is active.

Because the runtime property helper has no extra logic, callback/UI consumers can react synchronously and their errors can propagate. The property affects diagnostic wording too: native field conversion and required-value errors commonly insert `DisplayName` into their messages. It does not change serialization keys, SQL names or `FieldByName` lookup.

#### Official RTL references

- [Embarcadero: TField.DisplayLabel](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DisplayLabel)
- [Free Pascal: TField.DisplayLabel](https://www.freepascal.org/docs-html/current/fcl/db/tfield.displaylabel.html)

<small>Created 2026-07-15</small>
