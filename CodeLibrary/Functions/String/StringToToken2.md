---
title: "StringToToken2"
description: "Creates marker-aware tokens, removing [*] from emitted values and carrying an @ separator into the following token."
sidebar_position: 62
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - tokens
  - markers
---

```Delphi
Function StringToToken2( S : string; aSeparators : TvxSeparators) : TStringList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Tokens: TStringList;
begin
  Tokens := StringToToken2('A@B[*]|C', ['@', '|']);
  try
    Value := Tokens[1]; // @B
  finally
    Tokens.Free;
  end;
end;
```

### Usage

`StringToToken2` creates marker-aware tokens, removing [*] from emitted values and carrying an @ separator into the following token.

**Ownership**

The function always constructs a new `TStringList`, including for empty source. The caller owns it and must call `Free`.

**Exact separator behavior**

When a separator is encountered:

1. if the current token is non-empty before marker removal, its value after case-insensitive replace-all removal of `[*]` is added (and can therefore be empty);
2. if the actual separator is `@`, the next token starts as `'@'`;
3. every other separator resets the next token to empty.

The final non-empty token is emitted after the same marker removal.

**Important quirks**

- `@` is special only when it is also a member of `aSeparators`. Otherwise it is ordinary token text.
- A trailing `@` separator produces a final token equal to `'@'`.
- Consecutive `@` separators can emit standalone `'@'` tokens; they do not behave like ordinary discarded empty fields.
- `[*]` is removed wherever it occurs in an emitted token, not only as a prefix or suffix.
- A field whose complete value is one or more `[*]` markers produces a blank list entry because Velox tests for emptiness before removing the marker.
- Empty input returns an allocated empty list. Tokens are not otherwise trimmed or decoded.

### Additional Technical Info
`StringToToken2` is a specialised tokenizer. It normally discards separators and blank source fields, removes every literal `[*]` marker from emitted tokens, and treats `@` specially by seeding the following token with the `@` character. A marker-only field is an exception: it is non-empty before marker removal, so an empty string is added to the result.

The example is fictional and source-reviewed only.

**Performance and concurrency**

Token construction uses repeated concatenation, and every emitted token performs a replace-all pass for the marker. The returned list is caller-owned and not inherently thread-safe.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - reference for the marker-removal primitive only; the tokenizer is Velox-owned.

<small>Created 2026-07-15</small>
