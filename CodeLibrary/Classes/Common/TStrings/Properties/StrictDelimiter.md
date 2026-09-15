---
title: StrictDelimiter
description: Controls whether DelimitedText treats only the configured delimiter, or also control/space characters, as field boundaries.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, strictdelimiter, whitespace, parsing]
---

```Delphi
property StrictDelimiter: Boolean read write;
```

### Example

```Delphi
procedure PreserveSpaces(const Items: TStringList);
begin
  Items.Delimiter := ',';
  Items.StrictDelimiter := True;
  Items.DelimitedText := ' Alpha ,Beta';
end;
```

### Usage

`StrictDelimiter` controls whether DelimitedText treats only the configured delimiter, or also control/space characters, as field boundaries.

- Set true when leading/trailing spaces are data.
- Set and document it before assigning DelimitedText or CommaText; otherwise identical text can parse differently.
- This Boolean does not add schema, row or escape validation.

### Additional Technical Info
`StrictDelimiter` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It materially changes whitespace parsing and quoting.

#### Source-backed behaviour

The default is false. In non-strict mode the setter skips characters `#1..space` before/between fields, and the getter quotes a field containing those characters. In strict mode only the exact [`Delimiter`](Delimiter.md) separates unquoted fields, and whitespace is preserved without forcing quotes unless another quote condition applies.

Null `#0` remains the input terminator in both modes. [`CommaText`](CommaText.md) changes delimiter/quote temporarily but leaves StrictDelimiter unchanged.

#### Related members

[`DelimitedText`](DelimitedText.md) applies the rule. [`Delimiter`](Delimiter.md) and [`QuoteChar`](QuoteChar.md) complete the format settings.

#### Official RTL references

- [Embarcadero: TStrings.StrictDelimiter](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.StrictDelimiter)
- [Free Pascal: TStrings.StrictDelimiter](https://www.freepascal.org/docs-html/rtl/classes/tstrings.strictdelimiter.html)

<small>Created 2026-07-15</small>
