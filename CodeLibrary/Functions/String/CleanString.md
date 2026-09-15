---
title: "CleanString"
description: "Returns only printable ASCII code units from space through tilde, discarding controls and all non-ASCII text."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - ascii
  - sanitisation
  - data-loss
---

```Delphi
Function CleanString(const S: String): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := CleanString('A' + #9 + 'B' + #13 + #10 + 'C'); // 'ABC'
end;
```

### Usage

`CleanString` returns only printable ASCII code units from space through tilde, discarding controls and all non-ASCII text.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to filter. |
| Result | `string` | Retained printable ASCII characters in their original order. |

Spaces are preserved. Tabs, CR, LF and every other control character are removed rather than replaced. DEL (`#127`) is also removed.

**Unicode and data-loss boundary**

Despite the broad name, this is not a general text-cleaning or Unicode-normalisation routine. Accented Latin letters, Māori macrons, smart punctuation, currency symbols, emoji and every other code unit above 126 are discarded. A supplementary Unicode character is represented by a surrogate pair and both halves are discarded.

Examples of exact filtering:

| Input | Result |
|---|---|
| `' A B '` | `' A B '` |
| `'A' + #9 + 'B'` | `'AB'` |
| `'café'` | `'caf'` |
| empty string | empty string |

Use this helper only when an external format explicitly requires printable ASCII and silent character removal is acceptable. It is unsuitable for names, addresses, messages or other user text. If a delimiter is needed where a disallowed character occurs, replace that delimiter before filtering; this function does not preserve word boundaries.

### Additional Technical Info
`CleanString` filters a string to the printable seven-bit ASCII range. It retains each UTF-16 code unit whose ordinal is from 32 (`' '`) through 126 (`'~'`) inclusive and discards everything else.

The example is fictional and source-reviewed only.

**Implementation and cost**

The Velox implementation scans the input once and appends accepted code units to the result. It performs no logging, locale lookup, mapping, trimming or replacement. Runtime is linear in the input length; repeated string appends can create allocation overhead for large values.

<small>Created 2026-07-15</small>
