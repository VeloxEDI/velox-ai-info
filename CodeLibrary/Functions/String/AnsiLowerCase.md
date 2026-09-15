---
title: "AnsiLowerCase"
description: "Returns a locale-aware lowercase copy after the PascalScript ANSI value passes through Delphi Unicode conversion."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - lowercase
  - locale
  - ansi
---

```Delphi
function AnsiLowerCase(S: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AnsiLowerCase('Velox EDI'); // 'velox edi' in ordinary Latin locales
end;
```

### Usage

`AnsiLowerCase` returns a locale-aware lowercase copy after the Velox scripting ANSI value passes through Velox Unicode conversion.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | ANSI Velox scripting string to convert. |
| Result | `String` | Lowercase ANSI copy. Empty input returns an empty string. |

### Additional Technical Info
`AnsiLowerCase` returns a lowercased copy of a PascalScript `String`. Conversion follows the current Windows user locale rather than a fixed, invariant rule. The source value is not changed.

The example is fictional and source-reviewed only.

**Implementation**

This is modified PascalScript standard-function selector 37. For the current build, the runtime's public `String` value is `AnsiString`. The handler converts that value to Delphi's native Unicode `string`, calls the installed `System.SysUtils.AnsiLowerCase`, and casts the result back to the PascalScript ANSI string.

On Windows, the installed Delphi routine uses the current process/user locale through the operating-system case-mapping service. Consequently:

- results for language-sensitive characters can differ between Designer and a service account;
- the ANSI-to-Unicode-to-ANSI round trip uses the active code page and can lose a mapped character that the code page cannot represent;
- one input character is not guaranteed to have a language-invariant relationship with one output character; and
- behaviour can differ from [`LowerCase`](LowerCase.md), which is intended for simple non-locale-aware casing.

Use this routine for human text whose locale behaviour is acceptable. Do not use locale-sensitive casing to generate stable identifiers, protocol keys, signatures or cross-machine comparison keys. For ASCII Velox identifiers, use the identifier-specific rules instead.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.AnsiLowerCase`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.AnsiLowerCase)
- [Free Pascal: `SysUtils.AnsiLowerCase`](https://www.freepascal.org/docs-html/rtl/sysutils/ansilowercase.html)

<small>Created 2026-07-15</small>
