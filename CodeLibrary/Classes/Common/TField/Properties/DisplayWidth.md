---
title: DisplayWidth
description: Gets or sets the requested presentation-column width, falling back to the concrete field's default when the stored value is zero or negative.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, displaywidth, layout, metadata]
---

```Delphi
property DisplayWidth: Integer read write;
```

### Example

```Delphi
procedure WidenDescription(const Data: TvxClientDataSet);
begin
  Data.FieldByName('Description').DisplayWidth := 40;
end;
```

### Usage

`DisplayWidth` gets or sets the requested presentation-column width, falling back to the field's default when the stored value is zero or negative.

- Use positive values for explicit widths and zero to request normal default behaviour.
- Do not use it as a data-length constraint or allocation size.
- Expect active data-aware views to refresh when it changes; avoid repeated changes in record-processing loops.

### Additional Technical Info
`DisplayWidth` is presentation metadata used by data-aware consumers. It does not truncate, pad or validate the field's stored value.

#### Source-backed behaviour

The getter returns the stored width only when it is greater than zero; otherwise it calls the concrete field's virtual `GetDefaultWidth`. Base default width is 10, while descendants can derive another value from type or schema. The setter stores any integer without range validation. A changed value calls `PropertyChanged(True)`, which broadcasts a layout-change event when the dataset is active.

Because zero and negative values both select the default on read, assigning `-1` does not round-trip as `-1`. The stored/default distinction is internal. This property is independent of [`Size`](Size.md), `DataSize`, database column length and formatted text length.

#### Official RTL references

- [Embarcadero: TField.DisplayWidth](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DisplayWidth)
- [Free Pascal: TField.DisplayWidth](https://www.freepascal.org/docs-html/current/fcl/db/tfield.displaywidth.html)

<small>Created 2026-07-15</small>
