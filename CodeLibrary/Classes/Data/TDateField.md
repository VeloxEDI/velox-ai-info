---
title: TDateField
description: Represents a dataset-owned calendar-date field whose inherited TDateTime access has date-only, nullable and locale-sensitive semantics.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, date, field, 'null']
---

```Delphi
TDateField = class(TDateTimeField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  DateValue: TField;
begin
  // Replace OrderDate with a configured ftDate field in this SQL view.
  DateValue := Dataview.Query.FieldByName('OrderDate');
  if DateValue.IsNull then
    Value := Null
  else
    Value := DateValue.AsDateTime;
end;
```

### Usage

`TDateField` represents a dataset-owned calendar-date field whose TDateTime access has date-only, nullable and locale-sensitive semantics.

**Acquisition and ownership**

Scripts do not construct `TDateField`. A dataset creates the appropriate field object from `ftDate` metadata when it opens/builds its schema. Obtain it through `Fields`, `FieldByName`, the current Velox `Field` context or another Velox-provided reference. The object belongs to its dataset and current schema; do not free or retain it across dataset close/rebuild/destruction.

members such as `Value`, `AsDateTime`, `AsString`, `AsVariant`, `DisplayFormat`, `IsNull` and `Clear` therefore live under `TDateTimeField` or `TField`, not under this class path.

**Usage notes**

Use `IsNull` plus a typed date value for decisions and mapping. Use `DisplayText` only for presentation. Keep edit/post/apply and database transaction ownership with the surrounding Velox process.

### Additional Technical Info
`TDateField` is Delphi's dataset field class for a calendar date without a time value. Velox registers it as an empty script subclass of `TDateTimeField`; it changes the native field type/storage, while all script-visible value, string, display and field-lifecycle members remain inherited and are documented at their declaring ancestor paths.

The example preserves null instead of allowing a null date to collapse to numeric zero. It is source-reviewed and was not executed by the documentation workflow.

**Native representation**

The native constructor sets `DataType` to `ftDate`. `GetDataSize` returns four bytes, while inherited date/time I/O converts through an eight-byte Delphi `TDateTime` (`Double`) buffer. The dataset/provider is responsible for converting between that script-facing value and its date-only native representation.

A valid date value normally has no fractional-day time component. Do not depend on a time fraction written through a generic `TDateTime` surface; an `ftDate` dataset/provider may discard it during conversion or persistence.

**Null and value behaviour**

- `Value`/`AsDateTime` returns `0` when the field is null. Delphi date zero is 30 December 1899, so this result is ambiguous unless `IsNull` is checked first.
- `AsVariant` returns Variant `Null` for a null field and a date Variant otherwise.
- Text access returns an empty string for null.
- `Clear`/an empty string writes null through the owning dataset. A write still requires a writable dataset/edit state and normal post/apply/transaction handling.

**Parsing and formatting**

Inherited string assignment calls `StrToDate` for this `ftDate` subtype. Parsing follows the current Delphi format settings, including date order, separator, month names and two-digit-year window. An empty string clears; whitespace or malformed/non-local text is parsed rather than treated as empty and can raise.

`AsString` requests non-display text, so it uses the current short-date format and does not apply `DisplayFormat`. `DisplayText` can use a non-empty inherited `DisplayFormat`; changing that format sends an active dataset-change notification but does not change the stored date.

**Edge cases and quirks**

- Null and the real date 30 December 1899 both produce numeric zero through `Value`/`AsDateTime`; always preserve `IsNull` when the distinction matters.
- Locale-dependent text is unsuitable as a stable integration format. Prefer typed values, or explicitly format/parse an agreed invariant representation in script.
- This class stores no timezone or offset and performs no UTC/local conversion. A calendar date should not be shifted as though it were an instant.
- Field references and their current values follow the dataset cursor. Navigation changes the record they expose; schema recreation invalidates the objects.
- Date range and invalid-value behaviour ultimately depend on Delphi conversion plus the dataset/provider/database column.

**Performance and concurrency**

Typed access and formatting are constant-time. Text conversion is more expensive but small. Fields and their dataset cursor are mutable and unsynchronised; keep access within the owning Velox flow/thread and snapshot scalar values before helpers that navigate.

**External references**

- [Embarcadero DocWiki: `Data.DB.TDateField`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDateField) - authoritative Delphi class and date-without-time semantics.
- [Free Pascal: `TDateField`](https://www.freepascal.org/docs-html/fcl/db/tdatefield.html) - compatible class/type overview; Velox executes the Delphi implementation described above.

<small>Created 2026-07-15</small>
