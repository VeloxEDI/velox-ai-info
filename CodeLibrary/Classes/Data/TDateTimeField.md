---
title: TDateTimeField
description: Represents a dataset-owned combined date-and-time field with typed TDateTime value and display-only formatting properties.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, datetime, field, 'null']
---

```Delphi
TDateTimeField = class(TField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  DateTimeValue: TField;
begin
  // Replace ProcessedAt with a configured ftDateTime field.
  DateTimeValue := Dataview.Query.FieldByName('ProcessedAt');
  if DateTimeValue.IsNull then
    Value := Null
  else
    Value := DateTimeValue.AsDateTime;
end;
```

### Usage

`TDateTimeField` represents a dataset-owned combined date-and-time field with typed TDateTime value and display-only formatting properties.

**Acquisition and ownership**

Scripts do not construct this class. A dataset creates its date/time field objects when opening or building a schema; obtain them through the current view/dataset, `Fields`, `FieldByName` or the active field context. They belong to that dataset and expose its current record. Navigation changes their values, and close/schema rebuild/destruction invalidates retained references.

Scripts can read or write `Value: TDateTime` and `DisplayFormat: string`. Use `TDateField` for date-only fields and `TTimeField` for time-only fields. Scripts cannot construct these field objects directly.

**Usage notes**

Use typed values plus an explicit timezone convention in integration designs. Preserve null explicitly, keep edit/post/apply ownership with the Velox process and reserve `DisplayFormat` for human-readable output.

### Additional Technical Info
`TDateTimeField` is Delphi's dataset field class for a combined calendar date and clock time. Velox exposes its typed `Value` and display-only `DisplayFormat` properties. Generic dataset-field operations come from the hidden `TField` ancestor and are not duplicated under this path.

The example preserves database null and returns the typed value without converting through locale-dependent text. It is source-reviewed and was not executed by the documentation workflow.

**Native representation**

The native constructor sets `DataType` to `ftDateTime`. Both DataSize and I/O size are eight bytes. `TDateTime` is a `Double`: its integral portion identifies a day relative to 30 December 1899 and its fractional portion represents a time within a day.

The class stores no timezone, offset or daylight-saving identity. It represents a local/unspecified civil value unless the surrounding integration defines another convention. It performs no UTC conversion.

**Value and null behaviour**

The typed `Value` property and inherited `AsDateTime` use the same getter/setter. A null read returns numeric zero through either property, which is indistinguishable from the real value 30 December 1899 unless `IsNull` is checked. `AsVariant` preserves null as Variant `Null`; text surfaces return an empty string.

Writing numeric zero stores a real date/time zero; it does not clear the field. Use `Clear` through the inherited field surface when null is required. Writes pass through the owning dataset's edit/validation/post/apply and provider/database conversion paths.

**Text and display behaviour**

Empty string assignment clears. A non-empty `ftDateTime` string uses `StrToDateTime` with current format settings. The date-only descendant uses `StrToDate`; the time-only descendant uses `StrToTime` and accepts a leading minus sign.

`AsString` and edit text request non-display formatting and ignore `DisplayFormat`. `DisplayText` uses a non-empty `DisplayFormat`, unless a dataset field `OnGetText` handler overrides the class formatter. With no display format, native defaults are short date for `TDateField`, long time for `TTimeField`, and the standard combined `c`-style representation for this class.

**Edge cases and quirks**

- Null-to-zero collapse is the main typed-access trap. Preserve `IsNull` or use `AsVariant` when null has business meaning.
- Locale-dependent parsing/output is not a stable integration format. Prefer typed mapping or explicit invariant conversion.
- Value assignment performs no class-level finite/range/timezone validation before passing the Double to the dataset. NaN, infinity or out-of-range civil values can fail later in formatting, provider conversion or database constraints.
- `TDateField`/`TTimeField` provider conversion can discard the component their subtype does not represent; do not use them as interchangeable full timestamps.
- `DisplayFormat` changes presentation and sends an active dataset-change notification; it does not modify or post the stored value.

**Performance and concurrency**

Typed access and formatting are constant-time. The field, reusable I/O buffer, dataset cursor and display property are mutable and unsynchronised. Use them only in the owning Velox flow/thread and snapshot scalar values before helpers that may navigate.

**External references**

- [Embarcadero DocWiki: `Data.DB.TDateTimeField`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDateTimeField) - authoritative Delphi class and combined date/time semantics.
- [Free Pascal: `TDateTimeField`](https://www.freepascal.org/docs-html/fcl/db/tdatetimefield.html) - compatible class/property overview; Velox executes the Delphi implementation described above.

<small>Created 2026-07-15</small>
