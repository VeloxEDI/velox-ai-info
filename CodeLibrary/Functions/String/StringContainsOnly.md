---
title: "StringContainsOnly"
description: "Checks that non-empty text before its first NUL consists only of members of a supplied TvxChars set."
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - validation
  - character-set
---

```Delphi
Function StringContainsOnly( const S : string; const aValid : TvxChars) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringContainsOnly('2048', ['0'..'9']); // True
end;
```

### Usage

`StringContainsOnly` checks that non-empty text before its first NUL consists only of members of a supplied TvxChars set.

**Parameters**

| Parameter | Meaning |
|---|---|
| `S` | String checked through a NUL-terminated `PChar` scan. |
| `aValid` | `set of Char` containing the accepted ordinal values. |

**Return rules**

- Empty Velox string (`Length(S) = 0`) returns `False`.
- The first scanned character outside `aValid` returns `False` immediately.
- Reaching NUL without seeing an invalid character returns `True`.

### Additional Technical Info
`StringContainsOnly` returns `True` when the source is non-empty and every character scanned before the first NUL belongs to `aValid`. It is a narrow set-membership check, not a numeric, identifier or Unicode-category validator.

The example is fictional and source-reviewed only.

**Critical embedded-NUL behavior**

A non-empty string beginning with `#0` returns `True`, even when `aValid` is empty, because the loop performs no membership test. If NUL occurs later, the entire suffix after it is ignored. For example, a valid prefix followed by `#0` and invalid text can still return `True`.

Do not use this function to validate untrusted or binary-derived text unless embedded NUL has been rejected separately.

**Other limitations**

- Matching is exact and case-sensitive.
- `TvxChars` is a Delphi ordinal set, not a Unicode property set; it cannot express arbitrary Unicode categories or grapheme clusters.
- Whitespace is accepted only when explicitly included.
- The function does not trim, normalise or mutate the source.

**Performance and concurrency**

The prefix is scanned once with constant-time set membership. The function reads no shared state.

**Related entries**

- [`RemoveChars2`](RemoveChars2.md) - uses the same NUL-terminated set scan to filter text.
- [`IsValidVxIdent`](IsValidVxIdent.md) - validates Velox's specific ASCII identifier grammar.

<small>Created 2026-07-15</small>
