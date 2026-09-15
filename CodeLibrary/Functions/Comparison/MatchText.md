---
title: "MatchText"
description: "Reports whether text equals any value in a string array using Delphi's case-insensitive text comparison."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - array
  - case-insensitive
---

```Delphi
Function MatchText( const AText : string; const AValues : TStringArray) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Allowed: TStringArray;
begin
  SetLength(Allowed, 2);
  Allowed[0] := 'Ready';
  Allowed[1] := 'Complete';
  Value := MatchText('complete', Allowed);
end;
```

### Usage

`MatchText` reports whether text equals any value in a string array using Velox's case-insensitive text comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | Text to find. It is not trimmed or otherwise normalised. |
| `AValues` | `TStringArray`, `const` | Candidate strings inspected from the lowest to the highest array index. |

**Returns**

`True` at the first case-insensitive full-string match; `False` when the array is empty or no element matches.

**Behaviour**

Order affects only how soon the function can return. Duplicate candidates do not change the Boolean result. Empty text can match an empty array element. Whitespace, punctuation and embedded null characters remain part of the managed strings and are compared.

**Errors**

There is no normal content-dependent exception path. An invalid/uninitialised array value or a value that cannot be converted to the declared parameter type can fail in the script runtime before the Velox function is entered.

**Usage notes**

For stable protocol tokens, prefer a defined ASCII vocabulary and document whether surrounding whitespace is valid. Use [`SameText`](SameText.md) for one candidate or [`MatchPattern`](MatchPattern.md) for Velox wildcard matching.

### Additional Technical Info
`MatchText` reports whether `AText` equals at least one element of `AValues` without case sensitivity. It compares complete strings; it does not search for substrings or patterns.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.MatchText`. Current Delphi source calls `AnsiMatchText`, then `AnsiIndexText`, which scans the array and applies `System.SysUtils.AnsiSameText` to each candidate. On Windows, non-ASCII comparison uses the user-default locale with the ignore-case flag; current source has a faster ordinal path for equal/ASCII text.

The PascalScript declaration uses the registered dynamic-array type `TStringArray` in place of Delphi's open-array syntax. The array is passed read-only.

**Edge cases and quirks**

- A nil or zero-length dynamic array returns `False`.
- Case-insensitive comparison is locale-aware for non-ASCII text on Windows. A mapping can therefore depend on the account and locale under which the Velox process runs.
- The comparison does not perform Unicode normalisation; canonically equivalent sequences can remain different.
- There is no trim, wildcard or substring behaviour. For example, `'Ready '` does not match `'ready'`.
- Free Pascal documents a compatible API, but its locale and Unicode implementation is not evidence for the deployed Delphi RTL.

**Side effects**

None. Neither the target text nor the array is modified.

**Performance and concurrency**

The scan is linear in the number of candidates and stops at the first match. Each comparison is proportional to the compared text length and can enter an operating-system locale routine for non-ASCII text. The function has no private shared mutable state; process/user locale remains an environmental dependency.

**Related entries**

- [`SameText`](SameText.md) compares one pair using ordinal ASCII case folding.
- [`MatchPattern`](MatchPattern.md) supports `*` and `?` wildcards.
- [`ContainsText`](ContainsText.md) searches within one string.

**External references**

- [Embarcadero `System.StrUtils.MatchText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.MatchText)
- [Free Pascal `MatchText`](https://www.freepascal.org/docs-html/rtl/strutils/matchtext.html) - compatible API context; the current Delphi locale path defines Velox behaviour.

<small>Created 2026-07-15</small>
