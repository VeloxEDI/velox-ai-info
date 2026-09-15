---
title: DelimitedText
description: Gets or replaces the list as one delimiter-separated record under configurable delimiter, quote and whitespace rules.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, delimitedtext, parser, quoting]
---

```Delphi
property DelimitedText: string read write;
```

### Example

```Delphi
procedure ParsePipeValues(const Items: TStringList);
begin
  Items.Delimiter := '|';
  Items.QuoteChar := '"';
  Items.StrictDelimiter := True;
  Items.DelimitedText := 'A|"B|C"|';
end;
```

### Usage

`DelimitedText` gets or replaces the list as one delimiter-separated record under configurable delimiter, quote and whitespace rules.

- Choose Delimiter, QuoteChar and StrictDelimiter before assigning.
- Do not use `Delimiter=#0`; null is also the parser terminator. With `QuoteChar=#0`, delimiter-containing values cannot round-trip safely.
- This is not a multi-row CSV, escape-policy or schema-validation API.

### Additional Technical Info
`DelimitedText` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a low-level single-record format whose exact output depends on three other properties.

#### Source-backed behaviour

The getter joins every entry with [`Delimiter`](Delimiter.md). When [`QuoteChar`](QuoteChar.md) is nonzero it quotes values containing the delimiter, quote, or—in non-strict mode—any character `#1..space`, doubling embedded quote characters. A list containing one empty string emits a pair of quote characters; with `QuoteChar=#0`, quoting is disabled and that distinction is lost.

The setter begins an update, clears the list, skips `#1..space` around fields when [`StrictDelimiter`](StrictDelimiter.md) is false, decodes quoted fields, and adds unquoted text up to the delimiter. Repeated delimiters create empty entries and a trailing delimiter adds a final empty entry. Parsing ends at `#0`.

#### Related members

[`CommaText`](CommaText.md) temporarily fixes comma/double quote. [`Delimiter`](Delimiter.md), [`QuoteChar`](QuoteChar.md) and [`StrictDelimiter`](StrictDelimiter.md) define this format.

#### Official RTL references

- [Embarcadero: TStrings.DelimitedText](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.DelimitedText)
- [Free Pascal: TStrings.DelimitedText](https://www.freepascal.org/docs-html/rtl/classes/tstrings.delimitedtext.html)

<small>Created 2026-07-15</small>
