---
title: QuoteChar
description: Specifies the single quote character used to escape fields in DelimitedText and defaults to a double quote.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, quotechar, escaping, delimitedtext]
---

```Delphi
property QuoteChar: Char read write;
```

### Example

```Delphi
procedure ConfigureQuotedFields(const Items: TStringList);
begin
  Items.QuoteChar := '"';
  Items.Delimiter := ',';
end;
```

### Usage

`QuoteChar` specifies the single quote character used to escape fields in DelimitedText and defaults to a double quote.

- Use a non-null character that the external format defines.
- Do not assume backslash escaping; embedded quote characters are doubled.
- Changing QuoteChar does not reparse existing values until DelimitedText is assigned.

### Additional Technical Info
`QuoteChar` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It affects delimited formatting only and does not alter stored strings.

#### Source-backed behaviour

`TStrings.Create` initializes QuoteChar to `"`. During [`DelimitedText`](DelimitedText.md) output, fields requiring quotes are wrapped and embedded quote characters are doubled. During input, a field beginning with QuoteChar is parsed with Delphi's quoted-string routine.

Setting `#0` disables quoting in the getter and quoted-field recognition in the setter. That can make delimiter-containing, quote-containing or empty values fail to round-trip distinctly. [`CommaText`](CommaText.md) temporarily uses double quote and restores this value.

#### Related members

[`DelimitedText`](DelimitedText.md) implements quoting. [`CommaText`](CommaText.md) fixes this setting temporarily.

#### Official RTL references

- [Embarcadero: TStrings.QuoteChar](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.QuoteChar)
- [Free Pascal: TStrings.QuoteChar](https://www.freepascal.org/docs-html/rtl/classes/tstrings.quotechar.html)

<small>Created 2026-07-15</small>
