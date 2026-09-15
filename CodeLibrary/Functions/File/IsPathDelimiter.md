---
title: "IsPathDelimiter"
description: "Tests whether a one-based string position contains the platform path delimiter."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - delimiter
  - indexing
---

```Delphi
Function IsPathDelimiter( const S : string; Index : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsPathDelimiter('C:\Fictional', 3);
  // True: the third character is a backslash
end;
```

### Usage

`IsPathDelimiter` tests whether a one-based string position contains the platform path delimiter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | String whose indexed character is to be tested. |
| `Index` | `Integer` | One-based string position. Zero, negative and positions beyond `Length(S)` are accepted and return `False`. |

**Returns**

`True` only when `Index` is in range, the character equals the platform delimiter and the RTL classifies that position as a single-byte/MBCS-safe character; otherwise `False`.

**Behaviour**

- Indexing is Pascal-style and one-based: the first character is position 1.
- On Windows, a backslash at an in-range position returns `True`.
- An empty string or any out-of-range index returns `False`.
- A forward slash returns `False` in Velox on Windows.

**Errors**

Out-of-range indices do not raise; they return `False`. Argument conversion and unexpected runtime failures can still occur before entry.

**Usage notes**

Use the function when reproducing Velox path-delimiter semantics. For a general “slash or backslash” check, test the intended characters explicitly.

### Additional Technical Info
`IsPathDelimiter` tests whether the character at the one-based `Index` in `S` is the platform `PathDelim`. On the current Windows Velox build, that delimiter is backslash.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The wrapper calls installed `System.SysUtils.IsPathDelimiter`. The current RTL checks `Index >= Low(string)`, `Index <= High(S)`, `S[Index] = PathDelim`, and `ByteType(S, Index) = mbSingleByte`. The bounds tests occur before indexing, so invalid positions return `False` rather than raising through this function.

**Edge cases and quirks**

- Some Embarcadero descriptions mention `'/' or '\\'` generically, but the installed routine compares the single platform `PathDelim`; for this Windows product that is backslash.
- The `ByteType` condition is retained from MBCS-aware RTL code. Script strings are Unicode, but Velox still executes this exact installed terminal implementation.
- The function recognises one character only. It does not validate a full path, UNC prefix, drive designator or separator placement.
- Mixed-separator or URL text should use an explicitly appropriate parser rather than this platform test.

**Side effects**

None.

**Performance and concurrency**

Constant-time with no allocation or mutable shared state.

**Related entries**

- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) uses this test before appending.
- [`ExcludeTrailingPathDelimiter`](ExcludeTrailingPathDelimiter.md) uses it before removing a final character.
- [`EnsureWebPathDelimiter`](EnsureWebPathDelimiter.md) addresses web-style delimiter requirements through Velox code.

**External references**

- [Embarcadero `System.SysUtils.IsPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IsPathDelimiter)
- [Free Pascal `IsPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/ispathdelimiter.html) - compatible one-based API context; the installed Delphi build defines Velox's precise delimiter and `ByteType` test.

<small>Created 2026-07-15</small>
