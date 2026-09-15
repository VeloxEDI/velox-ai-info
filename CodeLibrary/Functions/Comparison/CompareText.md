---
title: "CompareText"
description: "Compares two strings without case sensitivity using Delphi's ordinal text rules."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - case-insensitive
  - ordering
---

```Delphi
Function CompareText( const S1, S2 : string) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := CompareText('NZ', 'nz') = 0;
end;
```

### Usage

`CompareText` compares two strings without case sensitivity using Velox's ordinal text rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S1` | `string`, `const` | Left-hand string. |
| `S2` | `string`, `const` | Right-hand string. |

**Returns**

- a value less than zero when `S1` sorts before `S2`;
- zero when the strings compare equal under this routine's case rules; or
- a value greater than zero when `S1` sorts after `S2`.

Test the sign or compare with zero. Do not depend on a particular nonzero magnitude.

**Behaviour**

The operation is deterministic and does not use the Windows user locale. ASCII case pairs compare equal. Other Unicode letters are not guaranteed to be case-folded, and canonically equivalent Unicode sequences are not normalised.

Empty strings compare equal to one another. An empty string sorts before a nonempty string. Embedded `#0` characters are part of a Velox string and are compared rather than treated as a terminator.

**Errors**

The function has no normal data-dependent exception path. Standard memory/runtime failures remain possible outside its comparison contract.

**Usage notes**

Use this function for stable technical identifiers where ASCII-insensitive ordinal ordering is intended. If a partner specification requires a culture, Unicode normalisation or a particular collation, normalise and compare under that explicit contract instead.

### Additional Technical Info
`CompareText` compares two strings without distinguishing ASCII letter case and returns their ordering. Velox registers the two-string `System.SysUtils.CompareText` overload directly; it does not call a Velox wrapper or a locale-parameter overload.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import is bound directly to Delphi's `System.SysUtils.CompareText(const S1, S2: string)` implementation. Current Delphi source compares corresponding UTF-16 code units ordinally and folds only ASCII `a` through `z` to their uppercase values during the comparison. If the common prefix compares equal, length determines the result.

**Edge cases and quirks**

- Case-insensitive here means the current routine's ordinal ASCII folding, not full Unicode case-insensitive matching.
- Accented letters and scripts outside ASCII can compare differently from a user's linguistic expectation.
- Precomposed and decomposed Unicode representations can compare differently even when rendered alike.
- `CompareText` returns ordering. Use `CompareText(A, B) = 0` for equality rather than converting the result to Boolean.
- This implementation differs from case-insensitive routines in `System.StrUtils` that can use ANSI/locale-aware transforms or string-helper comparison paths.

**Side effects**

None. Input strings are not modified.

**Performance and concurrency**

Time is proportional to the common compared prefix, up to the length of the shorter string. The operation does not allocate transformed copies and uses no shared mutable state.

**Related entries**

- [`ContainsText`](ContainsText.md) searches using a different Delphi text path.
- [`EndsText`](EndsText.md) tests a case-insensitive suffix and treats an empty suffix as a match.
- [`Comparison`](../Comparison.md) summarises the group's different text rules.

**External references**

- [Embarcadero `System.SysUtils.CompareText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CompareText)
- [Free Pascal `CompareText`](https://www.freepascal.org/docs-html/rtl/sysutils/comparetext.html) — compatibility reference; current Delphi source defines Velox's exact behaviour.

<small>Created 2026-07-15</small>
