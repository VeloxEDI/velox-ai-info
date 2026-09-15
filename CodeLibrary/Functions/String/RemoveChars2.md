---
title: "RemoveChars2"
description: "Filters out members of a TvxChars set with a native pointer scan that stops at the first NUL character."
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - character-set
  - nul
---

```Delphi
Function RemoveChars2( const S : string; const aCharsToRemove : TvxChars) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RemoveChars2('AB-12 34', ['-', ' ']); // AB1234
end;
```

### Usage

`RemoveChars2` removes every character listed in a `TvxChars` set, but stops at the first embedded NUL character.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `S` | Source string. Empty input returns empty immediately. |
| `aCharsToRemove` | `set of Char`; every represented set member is filtered out. |
| Result | Concatenation of accepted characters before the first NUL. |

**Exact scan behavior**

Any text after an embedded NUL is omitted from the result. Reject or normalise such input when the complete string must be processed.

**Important behavior and quirks**

- An embedded `#0` terminates processing. The NUL and the complete suffix after it are omitted, even if those later characters are not in the removal set.
- Empty input and a string beginning with NUL both return empty.
- Membership is exact and case-sensitive.
- `TvxChars` is a Velox `set of Char`, so it represents only the set ordinal domain supported by the compiled type. It is not a Unicode category or grapheme set.
- The routine appends one character at a time. It does not modify `S` or the set.

**Selection guidance**

Use [`RemoveChars`](RemoveChars.md) when the removal values are naturally supplied as a string and embedded NUL data must not silently hide the suffix. Use `RemoveChars2` for a small, trusted character set and ordinary text known not to contain NUL.

### Additional Technical Info
`RemoveChars2` returns the source characters that are not members of `aCharsToRemove`. It performs a single membership scan through a NUL-terminated `PChar` view of the string.

The example is fictional and source-reviewed only.

**Performance and concurrency**

Membership testing is constant-time, but repeated result concatenation can reallocate/copy as the result grows. The function reads no shared state.

<small>Created 2026-07-15</small>
