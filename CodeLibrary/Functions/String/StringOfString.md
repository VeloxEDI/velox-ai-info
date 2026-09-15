---
title: "StringOfString"
description: "Returns a complete source string concatenated with itself a requested number of times using exact preallocation."
sidebar_position: 58
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - repeat
  - concatenate
---

```Delphi
Function StringOfString( const aText : string; aCount : longint) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringOfString('ab', 3); // ababab
end;
```

### Usage

`StringOfString` returns a complete source string concatenated with itself a requested number of times using exact preallocation.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `aText` | Complete text block to repeat. Embedded NUL and all other code units are copied. |
| `aCount` | Signed repetition count. |
| Result | `aText` repeated `aCount` times; empty when the source is empty or the effective allocation is empty. |

**Important behavior and quirks**

- No separator is inserted. [`Join`](Join.md) is more appropriate for an array of distinct values.
- Empty `aText` returns an empty string for any count.
- A zero or ordinary negative count produces no copy iterations and, in the current string allocator, an empty result.
- `Length(aText) * aCount` is computed as a signed integer before allocation. Large values can overflow or request impractical memory; Velox performs no explicit guard.
- Copying is by UTF-16 code units and preserves embedded NUL. Later pointer-based consumers may stop at that NUL even though the repeated result has a larger Velox length.

### Additional Technical Info
`StringOfString` concatenates `aCount` copies of `aText` without a separator. It calculates the complete target length once, allocates the result and copies the source block into each successive position.

The example is fictional and source-reviewed only.

**How it works**

Velox computes `C := Length(aText)`, calls `SetLength(Result, C * aCount)`, obtains a pointer to the result and repeats a `Move` of `C * SizeOf(Char)` bytes while `aCount > 0`.

**Performance and concurrency**

For valid sizes, allocation occurs once and each output code unit is copied once. The result necessarily consumes `Length(aText) * aCount` code units. The function reads no shared state.

**Related entries**

- [`DupeString`](DupeString.md) - Delphi StrUtils repeated-string implementation with similar purpose.
- [`StringOfChar`](StringOfChar.md) - specialised single-character fill.

<small>Created 2026-07-15</small>
