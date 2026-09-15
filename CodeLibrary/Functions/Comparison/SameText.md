---
title: "SameText"
description: "Reports whether two strings are equal without case sensitivity using Delphi's ordinal text rules."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - equality
  - case-insensitive
---

```Delphi
Function SameText( const S1, S2 : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SameText('Ready', 'READY');
end;
```

### Usage

`SameText` reports whether two strings are equal without case sensitivity using Velox's ordinal text rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S1` | `string`, `const` | First complete string. |
| `S2` | `string`, `const` | Second complete string. |

**Returns**

`True` when the strings have equal length and every UTF-16 code unit compares equal after ASCII `a` through `z` are folded to uppercase; otherwise `False`.

**Behaviour**

Two empty strings are same. Case differences within the ASCII alphabet are ignored. Length, whitespace, punctuation, embedded null code units and all non-ASCII code-unit differences remain significant.

**Errors**

There is no normal content-dependent exception path. Values that cannot convert to `string` can fail before entry.

**Usage notes**

This routine is appropriate for case-insensitive ASCII protocol tokens. Choose an explicitly normalised and locale-defined comparison for international natural-language matching.

### Additional Technical Info
`SameText` compares two complete strings without case sensitivity under Delphi's ordinal comparison rules. It is equivalent to testing whether the exposed [`CompareText`](CompareText.md) result is zero.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to the two-parameter overload of `System.SysUtils.SameText`. Current Delphi source returns `CompareText(S1, S2) = 0`. That overload performs ordinal comparison and case-folds only ASCII lowercase letters. Velox does not expose the overload that accepts `TLocaleOptions`.

**Edge cases and quirks**

- This overload is ordinal, not user-locale comparison. It intentionally differs from [`MatchText`](MatchText.md), whose current terminal path uses `AnsiSameText` and the user-default locale for non-ASCII text on Windows.
- Non-ASCII case pairs such as accented letters are not generally folded by this implementation.
- Unicode normalisation is not performed. Canonically equivalent strings with different code-unit sequences can compare different.
- Comparison uses UTF-16 code units rather than grapheme clusters.
- The name does not imply trimming: `'READY '` and `'ready'` are different.

**Side effects**

None.

**Performance and concurrency**

Comparison is linear in the shorter string and can stop at the first unequal code unit. Identical managed-string references take a fast path. There is no allocation or mutable shared state.

**Related entries**

- [`CompareText`](CompareText.md) returns the underlying ordinal relationship.
- [`MatchText`](MatchText.md) searches a candidate array using a different locale-aware terminal path.
- [`SameHash`](SameHash.md) performs case-sensitive non-empty equality.

**External references**

- [Embarcadero `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.SameText)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible API context; current Delphi ordinal source defines Velox's exact case fold.

<small>Created 2026-07-15</small>
