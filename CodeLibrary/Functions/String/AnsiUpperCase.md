---
title: "AnsiUpperCase"
description: "Returns a locale-aware uppercase copy after the PascalScript ANSI value passes through Delphi Unicode conversion."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - uppercase
  - locale
  - ansi
---

```Delphi
function AnsiUpperCase(S: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AnsiUpperCase('Velox EDI'); // 'VELOX EDI' in ordinary Latin locales
end;
```

### Usage

`AnsiUpperCase` returns a locale-aware uppercase copy after the Velox scripting ANSI value passes through Velox Unicode conversion.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | ANSI Velox scripting string to convert. |
| Result | `String` | Uppercase ANSI copy. Empty input returns an empty string. |

### Additional Technical Info
`AnsiUpperCase` returns an uppercased copy of a PascalScript `String`. Conversion follows the current Windows user locale rather than a fixed, invariant rule. The source value is not changed.

The example is fictional and source-reviewed only.

**Implementation**

This is modified PascalScript standard-function selector 38. The current runtime represents the public `String` type as `AnsiString`. It converts the input to Delphi's Unicode `string`, calls the installed `System.SysUtils.AnsiUpperCase`, then casts the result back to the ANSI script string.

The installed Windows terminal uses the process's current user locale. This has operational consequences:

- language-sensitive characters can map differently under the Designer user and the Velox service account;
- conversion back to ANSI uses the active code page and may be lossy;
- output is environment-dependent rather than a stable invariant normalisation; and
- behaviour can differ from [`UpperCase`](UpperCase.md), which applies simpler casing rules.

Use it for display or human-text comparison only when the execution account's locale is part of the design. Do not use it for cryptographic material, protocol identifiers, persistent keys or machine-independent canonicalisation.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.AnsiUpperCase`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.AnsiUpperCase)
- [Free Pascal: `SysUtils.AnsiUpperCase`](https://www.freepascal.org/docs-html/rtl/sysutils/ansiuppercase.html)

<small>Created 2026-07-15</small>
