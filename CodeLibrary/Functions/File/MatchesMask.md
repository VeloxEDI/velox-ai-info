---
title: "MatchesMask"
description: "Matches a string against Delphi's case-insensitive file-mask syntax."
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - mask
  - wildcard
  - matching
---

```Delphi
Function MatchesMask( const Filename, Mask : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MatchesMask('ORDER-2026.csv', 'order-????.csv');
end;
```

### Usage

`MatchesMask` matches a string against Velox's case-insensitive file-mask syntax.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Filename` | `string`, `const` | Complete candidate string to match. It is not opened or interpreted as a path. |
| `Mask` | `string`, `const` | Velox mask expression. Invalid syntax raises `EMaskException`. |

**Returns**

`True` when the whole candidate matches the whole mask; otherwise `False`.

**Mask syntax**

| Form | Meaning |
|---|---|
| `text` | Literal characters, compared case-insensitively by the exposed overload. |
| `?` | Exactly one character. |
| `*` | Zero or more characters, with backtracking to the next mask state. |
| `[abc]` | One character present in the set. |
| `[a-z]` | One character in the inclusive range. |
| `[!abc]` | One character not present in the set. |

**Behaviour**

- Matching is anchored to the complete string, not a substring search.
- Literal and set comparisons are case-insensitive under Velox routine's `UpCase` rules.
- `*` can match an empty suffix; `?` and every set consume exactly one character.
- Bracket sets use no commas or spaces as separators: those characters are literals if present.
- The first character after `[` is `!` to negate a set.

**Usage notes**

Use this function for Velox file-mask compatibility, not for path security. A successful lexical match says nothing about whether a file exists or whether its contents match its extension. If one mask is reused for many values in performance-sensitive code, the script API still recompiles it on every call.

### Additional Technical Info
`MatchesMask` compares the complete `Filename` string with a Delphi file mask. The exposed overload is case-insensitive and supports literal characters, `*`, `?`, bracketed character sets/ranges and negated sets. Despite the parameter name, `Filename` can be any string; no file-system lookup occurs.

The example returns `True`. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox's `SysUtilsImport.MatchesMask` wrapper calls `System.Masks.MatchesMask(Filename, Mask)`. The installed two-argument overload delegates to `MatchesMask(..., False)`, constructs `TMask`, compiles the mask twice (first to size its state array and then to populate it), and runs a PChar-based state machine. `*` attaches a skip-to/backtracking flag to the following state; a fixed stack stores alternative candidate positions.

**Edge cases and quirks**

- An unterminated/empty set, a range beginning with `-`, and other malformed set syntax raise `EMaskException` rather than returning `False`.
- The implementation permits at most 30 skip-to cards (wildcard backtracking states). A mask exceeding that limit raises the same invalid-mask exception.
- A `?` encountered while a preceding `*` still has a pending skip-to state is not emitted as a separate one-character state. Consequently `*?x` is compiled like `*x`, and a trailing `*?` behaves like `*`; do not rely on `?` to require one character when it immediately follows `*`.
- This syntax is not a regular expression. Regex escapes, groups, alternation and quantifiers do not apply.
- The matcher uses null-terminated `PChar` traversal. An embedded `#0` in either managed string terminates what the state machine sees, so suffix data after it is not reliably part of the match.
- Case folding is the installed Delphi `UpCase` behaviour, not Unicode normalisation or culture-aware full case folding. International text and canonically equivalent sequences need explicit testing/normalisation.
- Multiple `*`/complex alternatives can require backtracking. Keep externally supplied masks short and governed.

**Side effects**

None beyond temporary allocations for the compiled mask, character sets and backtracking stack.

**Errors**

Invalid mask syntax or more than 30 skip-to cards raises `EMaskException`. Argument conversion and allocation failures can also propagate.

**Performance and concurrency**

Each call recompiles the mask and allocates state. Straight literal masks are roughly linear; wildcard backtracking can inspect candidate positions repeatedly. The routine has no mutable global matching state and is safe to call concurrently with independent arguments.

**Related entries**

- [`FileExists`](FileExists.md) checks one literal path against the file system and does not interpret wildcards.
- [`ExtractFileName`](ExtractFileName.md) can isolate a path's name before matching.
- [`MatchPattern`](../Comparison/MatchPattern.md) is a different Velox wildcard algorithm with different syntax and limits.

**External references**

- [Embarcadero `System.Masks.MatchesMask`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Masks.MatchesMask)
- [Free Pascal `FPMasks.MatchesMask`](https://www.freepascal.org/daily/packages/fpindexer/fpmasks/matchesmask.html) - same-named compatibility context only; its published signature does not establish Delphi's mask grammar or Velox's installed state machine.

<small>Created 2026-07-15</small>
