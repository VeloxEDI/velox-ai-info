---
title: "LowerCase"
description: "Returns a lowercase copy with ASCII-only mapping for normal String and UnicodeString values but locale-aware mapping for a WideString actual value."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - lowercase
  - ascii
  - locale
---

```Delphi
function LowerCase(S: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LowerCase('Velox EDI'); // velox edi
end;
```

### Usage

Returns a lowercase copy with ASCII-only mapping for normal String and UnicodeString values but locale-aware mapping for a WideString actual value.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to copy and convert to lowercase. ANSI, `WideString` and `UnicodeString` values are accepted. |
| Result | `String` | Lowercase copy. Empty input returns empty. |

### Additional Technical Info
`LowerCase` returns a lowercased copy of a string and leaves the input unchanged. For the normal PascalScript `String` type in this build, it changes only ASCII `A` through `Z` to `a` through `z`; all other bytes are retained unchanged.

The example is fictional and source-reviewed only.

**Actual-type dispatch**

This is modified PascalScript standard-function selector 11:

- ANSI `String` uses PascalScript `FastLowerCase`, an explicit ASCII ordinal loop.
- `UnicodeString` calls installed Delphi `LowerCase`, which also maps only seven-bit ASCII `A`-`Z`.
- `WideString` calls Delphi `WideLowerCase`; on Windows this uses `CharLowerBuffW` and the current user locale, so its international behavior can differ from the other two branches.

The ordinary public `String` path is therefore deterministic for ASCII identifiers and does not lowercase accented/non-Latin letters. Do not assume full Unicode case folding. If human-text locale mapping is required for a normal ANSI script value, review [`AnsiLowerCase`](AnsiLowerCase.md), including its service-account locale and code-page limitations.

Case conversion alone is not a safe canonicalisation for security identifiers or language-neutral equality: Unicode case folding can change length and has locale-specific rules that neither the normal ASCII branch nor a simple Windows lowercasing call fully represents.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.LowerCase`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.LowerCase)
- [Free Pascal: `SysUtils.LowerCase`](https://www.freepascal.org/docs-html/rtl/sysutils/lowercase.html)

<small>Created 2026-07-15</small>
