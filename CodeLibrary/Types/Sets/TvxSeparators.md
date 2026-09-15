---
title: TvxSeparators
description: Defines the independent 8-bit separator characters used by Velox token-list helper functions.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, set, separator, token, string]
---

```Delphi
TvxSeparators = set of Char
```

### Example

```Delphi
procedure ReadTokens(const Source: String);
var
  Tokens: TStringList;
begin
  Tokens := StringToTokenAllowBlank(Source, [',', ';']);
  try
    // Each comma or semicolon ends one field.
  finally
    Tokens.Free;
  end;
end;
```

### Usage

`TvxSeparators` defines the independent 8-bit separator characters used by Velox token-list helper functions.

#### Character and parsing boundaries

- The current script `Char`/set domain is eight-bit while script `String` is Unicode. Separators above ordinal 255 cannot be represented by this type.
- The tokenizer implementations index by String length, so unlike the `TvxChars` helpers they do not stop merely because an embedded `#0` is present. `#0` acts as a separator only if included in the set.
- No function understands quoting, escaping, multi-character delimiters or nested syntax. A separator inside quoted-looking text is still a separator.
- Tokens are assembled one character at a time. Validate input length/count before using these helpers with untrusted large content.
- An empty separator set returns one token for nonempty source (`StringToToken2` still removes its `[*]` marker); for empty source, each returns an allocated empty list.

### Additional Technical Info
`TvxSeparators` is registered by the Velox common importer. Every member is an independent separator character; `[',', ';']` means split at either comma or semicolon, not at the two-character sequence `,;`.

The set is passed to three functions that always return a newly allocated `TStringList`. The caller owns that list and must free it.

| Function | Blank fields | Additional behavior |
|---|---|---|
| [`StringToToken`](../../Functions/String/StringToToken.md) | Drops leading, trailing and consecutive blanks | Returns ordinary unmodified nonblank tokens. |
| [`StringToTokenAllowBlank`](../../Functions/String/StringToTokenAllowBlank.md) | Preserves them for nonempty input | Always adds the final token; empty source is the special case returning zero items. |
| [`StringToToken2`](../../Functions/String/StringToToken2.md) | Drops blank tokens | Removes every case-insensitive `[*]`; when the separator is `@`, the next token begins with `@`. |

**Related Code Library entries**

- [Char](../DataTypes/Char.md) - the current 8-bit script character boundary.
- [Sets](../Sets.md) - set constructors and membership rules.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi set semantics.
- [Free Pascal set types](https://www.freepascal.org/docs-html/ref/refsu16.html) - compatible ordinal-domain limit.
- [Free Pascal set operators](https://www.freepascal.org/docs-html/ref/refsu49.html) - compatible membership operations.

<small>Created 2026-07-15</small>
