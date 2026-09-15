---
title: CommaText
description: Gets or replaces all strings using comma delimiters and double-quote escaping while preserving the configured delimiter and quote settings.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, commatext, csv, quoting]
---

```Delphi
property CommaText: string read write;
```

### Example

```Delphi
procedure ParseCommaValues(const Items: TStringList);
begin
  Items.CommaText := 'Alpha,"Beta, Inc.",""';
end;
```

### Usage

`CommaText` gets or replaces all strings using comma delimiters and double-quote escaping while preserving the configured delimiter and quote settings.

- Do not treat this as an RFC-defined multi-record CSV reader: it represents one list record and has no row/header/schema model.
- Set `StrictDelimiter` deliberately before parsing significant whitespace.
- Assignment is destructive and not rollback-safe after the old entries are cleared.

### Additional Technical Info
`CommaText` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a convenience view over [`DelimitedText`](DelimitedText.md), not a complete CSV file parser.

#### Source-backed behaviour

For either read or write, the RTL saves current `Delimiter` and `QuoteChar`, temporarily sets them to comma and double quote, delegates to DelimitedText, and restores both in `finally`. [`StrictDelimiter`](StrictDelimiter.md) is **not** changed, so its current value still controls whitespace treatment.

The getter quotes fields containing delimiter, quote or—when strict mode is false—characters `#1` through space, and doubles embedded quote characters. One empty entry becomes `""`; an empty list becomes an empty string. The setter clears and reparses the list, including trailing/repeated comma empty fields.

#### Related members

[`DelimitedText`](DelimitedText.md) uses configurable characters. [`Text`](Text.md) is line-oriented. [`Strings`](Strings.md) accesses the parsed fields.

#### Official RTL references

- [Embarcadero: TStrings.CommaText](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.CommaText)
- [Free Pascal: TStrings.CommaText](https://www.freepascal.org/docs-html/rtl/classes/tstrings.commatext.html)

<small>Created 2026-07-15</small>
