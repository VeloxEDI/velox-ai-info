---
title: DisplayFormat
description: Gets or sets the DateTimeToString pattern used for DisplayText without changing AsString or the stored date/time value.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, datetime, display, format, locale]
---

```Delphi
property DisplayFormat: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  DateTimeValue: TDateTimeField;
begin
  DateTimeValue := TDateTimeField(Dataview.Query.FieldByName('ProcessedAt'));
  DateTimeValue.DisplayFormat := 'yyyy-mm-dd hh:nn:ss';
  Value := DateTimeValue.DisplayText;
end;
```

### Usage

`DisplayFormat` gets or sets the DateTimeToString pattern used for DisplayText without changing AsString or the stored date/time value.

**Errors**

The setter accepts any string, and ordinary pattern mistakes generally do not raise. Non-finite/invalid date values can fail while the formatter decodes the numeric value, and custom text handlers can raise their own errors.

**Usage notes**

Prefer a governed configured format for UI/report display. For interchange, use explicit invariant conversion rather than mutating a dataset field's shared display property.

### Additional Technical Info
`DisplayFormat` stores the Delphi `DateTimeToString` pattern used when this field produces `DisplayText`. It is a presentation property only: it does not change the typed value, `AsString`, edit text, database column or persistence state.

The example formats a display value using a configuration-known `ftDateTime` field. The cast is valid only for an actual `TDateTimeField`/date/time descendant. It is source-reviewed and was not executed by the documentation workflow.

The default/raw value is empty. The getter returns exactly the stored pattern; it does not return the effective default format.

**Implementation**

`DisplayText` first checks the generic field's `OnGetText` handler. If assigned, that handler supplies the result and this class formatter is bypassed. Otherwise `TDateTimeField.GetText` reads the current value. Null produces empty text. For non-null data, a non-empty `DisplayFormat` is selected only when the call is for display text, then `DateTimeToString` performs formatting.

`AsString` and edit text call the same routine with the display flag False, so they ignore this property. Their subtype defaults are ShortDateFormat for `ftDate`, LongTimeFormat for `ftTime`, and the empty/`c` combined DateTimeToString format for `ftDateTime`.

The setter stores a changed pattern and calls `PropertyChanged(False)`. If the field's dataset is active, that sends `deDataSetChange`; it is not a layout-change event and does not place the dataset in edit state.

**Format patterns**

Patterns use Delphi date/time specifiers. Common forms include `d`/`dd` for day, `ddd`/`dddd` for localised day names, `m`/`mm`/`mmm`/`mmmm` for month, `yy`/`yyyy` for year, `h`/`hh` for hour, `n`/`nn` for minute, `s`/`ss` for second, and `z`/`zzz` for milliseconds. `/` and `:` emit the current locale's separators. `am/pm`, `a/p` and `ampm` select 12-hour output; quoted text is literal. `m`/`mm` immediately after `h`/`hh` means minutes, so `n`/`nn` is clearer.

The `c` pattern uses the current short date plus long time and can omit the time when the fractional part is zero. Date/month names, separators and AM/PM strings remain locale-sensitive even when the surrounding pattern is fixed unless literals/numeric components avoid them.

**Edge cases and quirks**

- Assignment does not validate the pattern. The formatter is permissive: unrecognised characters are copied literally, and an unmatched quote makes the remaining text literal. Pattern mistakes therefore tend to produce surprising output rather than a setter error.
- DisplayFormat has no effect on `AsString`; use `DisplayText` or an explicit formatting function when the pattern must apply.
- Null always displays as empty through this formatter, regardless of the pattern.
- An `OnGetText` handler overrides the formatter and can make the stored pattern appear ineffective.
- Changing a field-wide property affects every consumer of that field object and emits a dataset-change event when active. Restore temporary formats if other code expects the configured value.
- Locale tokens can make output differ by machine, service account or runtime settings. Do not use DisplayText as a protocol/database key.

**Side effects**

Reading the raw property has none. Assignment mutates field metadata and can notify active dataset listeners; reading DisplayText can run a custom `OnGetText` handler.

**Performance and concurrency**

Property access and formatting are constant-time. The property is shared mutable metadata without locking; changing it concurrently or during nested formatting is unsafe.

**External references**

- [Embarcadero DocWiki: `TDateTimeField.DisplayFormat`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDateTimeField.DisplayFormat) - Delphi declaration, display-only behaviour and pattern reference.
- [Free Pascal: `TDateTimeField.DisplayFormat`](https://www.freepascal.org/docs-html/fcl/db/tdatetimefield.displayformat.html) - compatible display-property overview.

<small>Created 2026-07-15</small>
