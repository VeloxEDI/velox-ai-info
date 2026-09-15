---
title: "StripQuotes"
description: "Removes one matching outer character pair and collapses doubled occurrences of that character inside."
sidebar_position: 65
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - quotes
  - unescape
---

```Delphi
Function StripQuotes( const aValue : string; aChar : Char) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StripQuotes('"A""B"', '"'); // A"B
end;
```

### Usage

`StripQuotes` removes one matching outer character pair and collapses doubled occurrences of that character inside.

**Return rules**

- Empty input returns empty.
- Unbalanced or differently wrapped input returns unchanged; interior doubled characters are not collapsed.
- A one-character input equal to `aChar` is treated as both opening and closing and returns empty.
- Two wrapping characters with no interior also return empty.
- Balanced input returns the interior after replace-all unescaping of doubled `aChar`.

**Important behavior and quirks**

- `aChar` can be any character; the function does not restrict it to apostrophe or double quote.
- The interior replace uses `rfIgnoreCase`. This is irrelevant for punctuation quotes, but becomes material when a letter is supplied as `aChar`: doubled case variants can also match.
- Single unescaped occurrences inside the function are preserved. The function validates neither CSV nor Pascal/SQL quoting grammar.
- Only one outer layer is removed per call.

### Additional Technical Info
`StripQuotes` transforms a string only when its first and last characters both exactly equal `aChar`. It removes that one outer pair, then replaces every doubled `aChar + aChar` in the interior with one `aChar`.

The example is fictional and source-reviewed only. Pascal string literals are delimited by apostrophes, so the double-quote characters in the example are literal data.

**Performance and concurrency**

Balanced input is copied and then scanned by `StringReplace`; unbalanced input returns directly. No shared state is used.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - reference for the doubled-character collapse only.

<small>Created 2026-07-15</small>
