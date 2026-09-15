---
title: "ContainsText"
description: "Reports whether text contains a substring using Delphi's case-insensitive text comparison."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - substring
  - case-insensitive
---

```Delphi
Function ContainsText( const AText, ASubText : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ContainsText('Velox integration', 'INTEGRATION');
end;
```

### Usage

`ContainsText` reports whether text contains a substring using Velox's case-insensitive text comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AText` | `string`, `const` | Complete text to search. |
| `ASubText` | `string`, `const` | Substring to find. Parameter order is text first, substring second. |

**Returns**

`True` when the case-insensitive transformed substring occurs at a one-based position in the transformed text; otherwise `False`.

**Behaviour**

ASCII case variants normally match. The match can start at any character. The function returns only presence, not the match position or count.

An empty substring returns `False` in the current path because Velox's `AnsiPos('', AText)` returns zero. This differs from many mathematical definitions of an empty substring and from [`EndsText`](EndsText.md), where an empty suffix returns `True`.

**Errors**

There is no normal content-dependent exception. Large allocations can fail under general memory pressure.

**Usage notes**

Use this routine for human-facing case-insensitive containment when the deployed Velox/Windows case rules are acceptable. For technical identifiers or protocol fields, define the required normalisation and comparison explicitly.

### Additional Technical Info
`ContainsText` reports whether `ASubText` occurs anywhere within `AText` using Delphi's case-insensitive `System.StrUtils` routine. Velox binds directly to the RTL implementation.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import points directly to `System.StrUtils.ContainsText`, which calls `AnsiContainsText`. Current Delphi source uppercases both strings with `AnsiUpperCase`, searches with `AnsiPos`, and tests whether the returned position is greater than zero.

This implementation can allocate uppercase copies of both inputs. Its case mapping can use Windows/user-locale behaviour; the subsequent substring search is ordinal over the transformed strings.

**Edge cases and quirks**

- Parameter order is `AText, ASubText`; reversing them changes the search.
- Case behaviour is not the ordinal ASCII-only implementation used by [`CompareText`](CompareText.md). Locale-specific mappings can affect results.
- Unicode case mappings that expand, contract or have context-sensitive forms can produce results that differ from full Unicode case-folding expectations.
- The function does not normalise Unicode. Visually equivalent precomposed and decomposed strings may not match.
- Empty text with a nonempty substring returns `False`; an empty substring also returns `False`, including when both arguments are empty.
- The routine is a substring test, not token, word, path or identifier matching. For example, searching for `cat` can match inside `concatenate`.

**Side effects**

None. The supplied strings are not modified; temporary transformed strings are local to the call.

**Performance and concurrency**

Uppercasing is proportional to both input lengths and creates temporary strings. Substring-search cost depends on the transformed lengths and match position. The function has no private shared state, but case mapping can depend on process/user locale state.

**Related entries**

- [`CompareText`](CompareText.md) performs ordinal case-insensitive ordering.
- [`EndsText`](EndsText.md) tests a suffix and has different empty-input behaviour.
- [`Comparison`](../Comparison.md) compares the group's text semantics.

**External references**

- [Embarcadero `System.StrUtils.ContainsText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.ContainsText)
- [Free Pascal `ContainsText`](https://www.freepascal.org/docs-html/rtl/strutils/containstext.html) — compatible routine reference; Delphi's current implementation defines Velox's exact case path.

<small>Created 2026-07-15</small>
