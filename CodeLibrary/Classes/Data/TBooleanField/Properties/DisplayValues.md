---
title: DisplayValues
description: Configures field-wide True and False phrases and the locale-sensitive prefix parser used by Boolean string access.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, boolean, display, parsing, locale]
---

```Delphi
property DisplayValues: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flag: TBooleanField;
begin
  Flag := TBooleanField(DATA_Self.FieldByName('Enabled'));
  Flag.DisplayValues := 'Enabled;Disabled';
  Value := Flag.AsString;
end;
```

### Usage

`DisplayValues` configures field-wide True and False phrases and the locale-sensitive prefix parser used by Boolean string access.

**Errors**

The setter itself performs bounded string slicing and normally does not reject malformed pairs. Allocation and dataset layout-event errors can propagate. Later string assignment raises a database error for text that matches neither configured prefix.

**Usage notes**

Use unambiguous phrases whose initial characters do not overlap, and assign the display contract once during controlled dataset setup. Use typed `Value` for logic; do not round-trip business data through display strings when a Boolean is available.

### Additional Technical Info
`DisplayValues` defines the text used to display and parse this Boolean field. The format is `TrueText;FalseText`: the phrase before the first semicolon represents True and the phrase after it represents False.

The example changes in-memory field metadata, not record data. It is source-reviewed and was not executed by the documentation workflow.

The raw property defaults to an empty string. Internally, empty means the default phrases `True` and `False`; reading the property still returns empty rather than the expanded pair.

**Implementation**

When a different value is assigned, Delphi stores it verbatim. For a non-empty value it finds the first semicolon with zero-based `IndexOf`:

- True text is the part before the delimiter.
- False text is at most 255 characters after the delimiter; additional semicolons remain part of False text.
- With no delimiter, a fallback split position of 256 makes an ordinary short token the True text and leaves False text empty.

Assigning empty after a custom value reloads `True`/`False`. The setter then raises an active-dataset layout-change event through `TField.PropertyChanged(True)`. Assigning the same raw string is a no-op and emits no event.

Later native string reads return the configured phrase, or empty for null. Native string writes use the input length as a prefix length, compare configured False first and True second through locale-sensitive `AnsiSameText`, and raise when neither phrase matches.

**Edge cases and quirks**

- Prefixes are accepted: with `Enabled;Disabled`, `E` means True and `D` means False. Inputs longer than the complete phrase do not match.
- Overlapping prefixes resolve False-first. For `Yes;Yep`, input `Y` writes False even though it is also a prefix of True. Free Pascal's public description says its implementation tests True first, so do not assume cross-dialect tie behaviour.
- Empty input writes whichever configured phrase is empty, checking False before True. When neither phrase is empty, empty string clears the field to null.
- `;No` makes True text empty; `Yes` normally makes False text empty. If both phrases are empty (`;`), an empty input writes False because False is checked first.
- For a delimiter-free value of 256 or more characters, True is capped at the first 255 characters, character 256 is skipped and False begins at character 257 for up to 255 characters. This follows the source's sentinel split value, not a supported data format.
- Matching uses the process's current locale and is case-insensitive; it is not an ordinal protocol comparison.

**Side effects**

Changes shared presentation/parsing metadata for the field object across records and can notify active dataset controls of a layout change. It does not enter edit state, alter the current Boolean value, post data or persist field metadata back to configuration.

**Performance and concurrency**

Assignment and matching are linear in phrase length and allocate substrings. The mutable phrases have no field-level lock; concurrent readers can observe a changed parser/display contract between operations.

**Related entries**

- [`Value`](Value.md) reads and writes the typed Boolean independently of these phrases.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBooleanField.DisplayValues`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TBooleanField.DisplayValues) - confirms the True-first semicolon format and empty-phrase conventions.
- [Embarcadero DocWiki: `System.SysUtils.AnsiSameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.AnsiSameText) - the locale-sensitive comparison used by Delphi's parser.
- [Free Pascal: `TBooleanField.DisplayValues`](https://www.freepascal.org/docs-html/fcl/db/tbooleanfield.displayvalues.html) and [`AnsiSameText`](https://www.freepascal.org/docs-html/rtl/sysutils/ansisametext.html) - compatible format/comparison context; Free Pascal documents a different True-first match order.

<small>Created 2026-07-15</small>
