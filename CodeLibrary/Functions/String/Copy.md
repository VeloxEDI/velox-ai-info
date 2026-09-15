---
title: "Copy"
description: "Returns up to iCount characters from a one-based string position, truncating safely at the source end."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - copy
  - substring
  - indexing
---

```Delphi
function Copy(S: String; iFrom, iCount: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Copy('ABCDEFGHIJ', 4, 3); // DEF
end;
```

### Usage

`Copy` returns up to iCount characters from a one-based string position, truncating safely at the source end.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Source string expression. |
| `iFrom` | `LongInt` | One-based starting position. Use `1` for the first character. |
| `iCount` | `LongInt` | Maximum number of characters to return. |
| Result | `String` | Requested substring, possibly shorter or empty at a boundary. |

**Boundary behaviour in the installed runtime**

| Condition | Result |
|---|---|
| `iFrom = 1` | Starts at the first character. |
| `iFrom < 1` | Normalised to the beginning of the string by the current Velox. Prefer `1` explicitly. |
| `iFrom > Length(S)` | Empty string. |
| `iCount = 0` or negative | Empty string. |
| Range extends past the end | Truncated to the available suffix. |
| Empty `S` | Empty string. |

String positions count code units, not user-perceived Unicode characters. With a wide/Unicode actual value, slicing between the two UTF-16 surrogates of a supplementary character can produce invalid text. The normal public `String` is ANSI in this Velox scripting build, so multibyte text can also be cut at an encoded-character boundary.

### Additional Technical Info
`Copy` returns a substring containing at most `iCount` characters, starting at the one-based position `iFrom`. It does not change the source value.

The example is fictional and source-reviewed only.

**PascalScript dispatch**

This is modified PascalScript standard-function selector 4. Although the generated declaration says `String`, the runtime handler examines the actual value type and invokes Delphi `Copy` for ANSI, `WideString` or `UnicodeString`. Other types are rejected rather than converted automatically.

The result is newly constructed string data. It is not a live view into `S` and changes to a variable later do not update the earlier result.

**External references**

- [Embarcadero DocWiki: `System.Copy`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Copy)
- [Free Pascal: `System.Copy`](https://www.freepascal.org/docs-html/rtl/system/copy.html)

<small>Created 2026-07-15</small>
