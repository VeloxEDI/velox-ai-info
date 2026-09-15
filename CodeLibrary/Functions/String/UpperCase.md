---
title: "UpperCase"
description: "Returns an uppercase copy with ASCII-only mapping for normal String and UnicodeString values but locale-aware mapping for a WideString actual value."
sidebar_position: 69
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - uppercase
  - ascii
  - locale
---

```Delphi
function UpperCase(S: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := UpperCase('Velox EDI'); // VELOX EDI
end;
```

### Usage

Returns an uppercase copy with ASCII-only mapping for normal String and UnicodeString values but locale-aware mapping for a WideString actual value.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to copy and convert to uppercase. ANSI, `WideString` and `UnicodeString` values are accepted. |
| Result | `String` | Uppercase copy. Empty input returns empty. |

### Additional Technical Info
`UpperCase` returns an uppercased copy and leaves the input unchanged. For the normal PascalScript `String` type in this build, it changes only ASCII `a` through `z` to `A` through `Z`; all other characters are retained unchanged.

The example is fictional and source-reviewed only.

**Actual-type dispatch**

This is modified PascalScript standard-function selector 10:

- ANSI `String` uses PascalScript `FastUpperCase`, an explicit ASCII ordinal loop.
- `UnicodeString` calls the installed Delphi `UpperCase`, which also maps only seven-bit ASCII `a`-`z` in this source version.
- `WideString` calls Delphi `WideUpperCase`; on Windows this uses the current user locale, so international behavior can differ from the other two branches.

The ordinary public `String` path is therefore deterministic for ASCII identifiers and does not uppercase accented or non-Latin letters. Do not assume full Unicode case folding. If locale-aware conversion is required for an ANSI script value, review [`AnsiUpperCase`](AnsiUpperCase.md), including its service-account locale and code-page limitations.

Case conversion alone is not safe canonicalisation for security identifiers or language-neutral equality. Unicode casing can be length-changing and locale-specific; neither the normal ASCII branch nor simple Windows uppercasing implements complete Unicode case folding.

**Related entries**

- [`LowerCase`](LowerCase.md) - corresponding lowercasing behavior and the same actual-type distinction.
- [`AnsiUpperCase`](AnsiUpperCase.md) - locale-aware ANSI conversion.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.UpperCase`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.UpperCase)
- [Free Pascal: `SysUtils.UpperCase`](https://www.freepascal.org/docs-html/rtl/sysutils/uppercase.html)

<small>Created 2026-07-15</small>
