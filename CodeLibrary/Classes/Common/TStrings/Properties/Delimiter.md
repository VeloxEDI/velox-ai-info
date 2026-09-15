---
title: Delimiter
description: Specifies the single character separating fields in DelimitedText and defaults to a comma.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, delimiter, serialization]
---

```Delphi
property Delimiter: Char read write;
```

### Example

```Delphi
procedure ConfigurePipes(const Items: TStringList);
begin
  Items.Delimiter := '|';
  Items.StrictDelimiter := True;
end;
```

### Usage

`Delimiter` specifies the single character separating fields in DelimitedText and defaults to a comma.

- Use a non-null character not expected unquoted in data.
- Set [`StrictDelimiter`](StrictDelimiter.md) explicitly when whitespace must be preserved.
- Changing the property does not reparse or transform current entries.

### Additional Technical Info
`Delimiter` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Changing it configures later delimited reads/writes; it does not immediately alter existing strings.

#### Source-backed behaviour

`TStrings.Create` initializes Delimiter to comma. The value is stored directly with no validation or notification. [`DelimitedText`](DelimitedText.md) uses it for joining and parsing; [`CommaText`](CommaText.md) temporarily overrides it and restores the original value.

Delimiter is one UTF-16 `Char`, not a string token. `#0` is unsafe because the parser also uses null as end-of-input. If the delimiter appears inside data, correct quoting requires a nonzero [`QuoteChar`](QuoteChar.md).

#### Related members

[`DelimitedText`](DelimitedText.md) consumes the setting. [`QuoteChar`](QuoteChar.md) escapes delimiter-containing fields.

#### Official RTL references

- [Embarcadero: TStrings.Delimiter](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Delimiter)
- [Free Pascal: TStrings.Delimiter](https://www.freepascal.org/docs-html/rtl/classes/tstrings.delimiter.html)

<small>Created 2026-07-15</small>
