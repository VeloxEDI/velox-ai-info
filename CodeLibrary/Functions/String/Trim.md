---
title: "Trim"
description: "Returns a copy without leading or trailing Delphi control and space characters."
sidebar_position: 68
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - trim
  - whitespace
---

```Delphi
function Trim(S: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Trim('  Velox EDI  '); // Velox EDI
end;
```

### Usage

`Trim` returns a copy without leading or trailing Velox control and space characters.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to trim. ANSI, `WideString` and `UnicodeString` values are accepted. |
| Result | `String` | Trimmed copy. Empty or entirely trimmable input returns empty. |

For the current Velox RTL, trimming removes character values at or below ordinary space (`#32`) from both ends. This covers ASCII space and control characters such as tab, carriage return and line feed. It is not general Unicode whitespace normalisation: for example, non-breaking and other Unicode spaces are not removed merely because Unicode classifies them as whitespace.

### Additional Technical Info
`Trim` returns a copy with leading and trailing Delphi trim characters removed. Interior characters are preserved.

The example is fictional and source-reviewed only.

**Actual-type dispatch**

This is modified PascalScript standard-function selector 12:

- a `UnicodeString` actual value calls Delphi's Unicode `Trim` overload;
- a `WideString` actual value calls the WideString overload; and
- the ANSI string branch converts through the native Delphi string type for trimming and converts the result back.

The input value is not modified. Only the returned copy changes, and sequences inside the retained boundaries remain byte-for-byte/code-unit-for-code-unit intact.

**Performance and concurrency**

The implementation scans the boundaries and returns a copied result. The ANSI branch performs additional string conversions. No shared state is mutated.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.Trim`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.Trim)
- [Free Pascal: `Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) - compatibility context; Velox runs Delphi's overloads.

<small>Created 2026-07-15</small>
