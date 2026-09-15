---
title: Required
description: Gets or sets a field metadata flag that Velox repurposes to force explicit SQL NULL output rather than reliably enforcing a non-null value.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, required, 'null', sql-persistence]
---

```Delphi
property Required: Boolean read write;
```

### Example

```Delphi
procedure ForceExplicitNull(const Data: TvxClientDataSet; const Name: string);
begin
  Data.Edit;
  Data.FieldByName(Name).Required := True;
  Data.FieldByName(Name).Clear;
end;
```

### Usage

`Required` gets or sets a field metadata flag that Velox repurposes to force explicit SQL NULL output rather than reliably enforcing a non-null value.

- Validate business-required values explicitly before persistence.
- Set this flag to force null only within the documented DataView update workflow; it mutates field metadata and can affect later writes.
- Confirm database constraints separately and restore/configure the flag intentionally between reused flows.

### Additional Technical Info
In stock Delphi, `Required` describes whether a non-null ordinary data field should be required. In the compiled Velox VCL and DataView persistence path, its operational meaning is deliberately different.

#### Source-backed behaviour

The property directly reads/writes `FRequired`; there is no inactive check or automatic validation on assignment. Velox comments out `CheckRequiredFields` in the compiled modified `TDataSet.InternalPost`, so `Post` does not reject a null merely because this flag is true. `TvxClientDataSet` also normally disables constraints when opened.

Velox ReportBuilder/DataView SQL generation tests `Required` when deciding whether an empty/null field is included. If true and the value is null/empty, it emits SQL `NULL`; otherwise optional null values can be omitted or, for some numeric paths, represented by a fallback. `TvxField.ForceNull` is implemented solely by setting `Required := True`. DataView field setup commonly resets the flag to false first.

Thus this is both schema metadata and a Velox persistence-control flag. It does not prove the database column accepts null, nor does false prove null is allowed.

#### Official RTL references

- [Embarcadero: TField.Required](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Required)
- [Free Pascal: TField.Required](https://www.freepascal.org/docs-html/current/fcl/db/tfield.required.html)

<small>Created 2026-07-15</small>
