---
title: TTimeField
description: Represents a dataset-owned time-of-day field with inherited TDateTime value and display formatting behavior.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, time, field, 'null']
---

```Delphi
TTimeField = class(TDateTimeField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  CutoffTime: TTimeField;
begin
  // Replace CutoffTime with a configured ftTime field.
  CutoffTime := TTimeField(Dataview.Query.FieldByName('CutoffTime'));
  if CutoffTime.IsNull then
    Value := Null
  else
    Value := CutoffTime.Value;
end;
```

### Usage

`TTimeField` represents a dataset-owned time-of-day field with TDateTime value and display formatting behaviour.

**Usage notes**

Use this class for a configured time-of-day field. Preserve null explicitly, attach date/timezone semantics in the surrounding model and leave edit/post/apply/transaction ownership with the Velox flow.

### Additional Technical Info
`TTimeField` is Delphi's dataset field class for a clock time without a date. Velox registers it as an empty script subclass of `TDateTimeField`: it changes native data type/storage and inherited string behavior, but adds no script-visible member of its own.

The example preserves database null and returns the typed value without locale-dependent text conversion. Its cast requires the configured field to be an actual `TTimeField`. It is source-reviewed and was not executed by the documentation workflow.

**Exposed surface and inheritance**

Compiler registration adds no method, property or constructor. Inherited `Value`, `DisplayFormat`, `AsDateTime`, `AsString`, `AsVariant`, `IsNull`, `Clear` and the generic field surface remain documented under their declaring `TDateTimeField` or hidden `TField` ancestor paths.

Scripts do not construct this class. Obtain it from a host dataset/view through `Fields`, `FieldByName` or the current field context. The dataset owns it, navigation changes the record value it represents, and close/schema rebuild/destruction can invalidate a retained reference.

**Native representation**

The constructor sets `DataType` to `ftTime`. Native DataSize is four bytes, while inherited script-facing I/O uses an eight-byte `TDateTime`/Double buffer. Delphi's current buffer conversion turns the Double into a timestamp, keeps only the millisecond-of-day component in a signed four-byte integer and reapplies a negative sign. Whole days are therefore discarded modulo 24 hours and the native value has millisecond precision; a provider/database can impose further restrictions.

The value represents a clock time without calendar date, timezone or UTC offset. It is not an instant and is not a reliable elapsed-duration type. Define timezone and date context elsewhere in the integration.

**Value and null behavior**

Inherited `Value` and `AsDateTime` return the same `TDateTime`. A null read collapses to numeric zero, which is indistinguishable from midnight unless `IsNull` is checked. `AsVariant` instead preserves null as Variant `Null`, and text surfaces return empty text.

Writing zero stores midnight; it does not clear the field. Use inherited `Clear` for database null. Typed writes pass a Double to the dataset's converted `SetFieldData` path without class-local range, date-part, finite-value or timezone validation. The default conversion performs the signed modulo-day/millisecond reduction described above; edit state, validation, posting, applying updates and provider/database constraints determine the final result.

**String parsing and formatting**

Empty string assignment clears the field. Any other value uses current format settings and `StrToTime`. If the first character is `-`, the implementation removes it, parses the remaining text and negates the resulting time; a lone minus or invalid/locale-mismatched text raises conversion error.

`AsString`/edit text use the current long-time format and ignore `DisplayFormat`. `DisplayText` can use a non-empty inherited `DisplayFormat`, unless a field `OnGetText` handler overrides formatting. After `DateTimeToString`, the implementation prepends `-` whenever the numeric time is negative. A format that already contains a literal minus can therefore display two minus characters.

Changing `DisplayFormat` affects presentation only and sends an active dataset-change notification. It does not edit or post the stored value.

**Edge cases and quirks**

- Null and midnight both read as zero through Value; preserve `IsNull` or Variant Null.
- The explicit negative-text extension becomes a signed native millisecond-of-day value in Delphi's current buffer path, but a provider/database may reject, normalise or lose the sign. Do not use this as a portable duration encoding.
- A typed value containing whole days is reduced modulo 24 hours by the default conversion (`1.5` becomes the same time-of-day as `0.5`); its date/day component is silently lost before persistence.
- Locale-sensitive strings are unsuitable as stable integration interchange. Prefer typed mapping or explicit invariant conversion.
- Conversion rounds the TDateTime value to milliseconds, and provider/database storage can reduce precision further.

**Performance and concurrency**

Typed access is constant-time apart from provider conversion; text parsing/formatting grows with text/pattern length. The field buffer, dataset cursor and display settings are mutable and unsynchronised. Use them in the owning Velox flow/thread and snapshot scalars before navigation.

**External references**

- [Embarcadero DocWiki: `Data.DB.TTimeField`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TTimeField) - authoritative Delphi time-without-date class contract.
- [Embarcadero DocWiki: `System.TDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TDateTime) - numeric representation and negative-value cautions.
- [Free Pascal: `TTimeField`](https://www.freepascal.org/docs-html/fcl/db/ttimefield.html) - compatible class overview; Velox executes the Delphi implementation described above.

<small>Created 2026-07-15</small>
