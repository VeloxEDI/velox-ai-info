---
title: "GetStringHead"
description: "Returns the text before the first occurrence of one separator character, or the complete input when no separator exists."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - head
  - separator
---

```Delphi
function GetStringHead(const S: string; Sep: Char): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetStringHead('customer:1007:active', ':'); // customer
end;
```

### Usage

`GetStringHead` returns the text before the first occurrence of one separator character, or the complete input when no separator exists.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `string` | Source text. |
| `Sep` | `Char` | One case-sensitive separator character. |
| Result | `string` | Prefix before the first separator, or all of `S` when absent. |

**Exact edge behavior**

- A separator at position 1 returns an empty string.
- A separator at the final position returns everything before it.
- Repeated separators have no special handling; the first ends the result.
- Empty input returns empty.
- `Sep` is one character, not a delimiter set or substring.
- No trimming, unquoting or escape processing occurs.

With no match it retains the complete copy. It has no external side effects.

Use [`BreakString`](BreakString.md) when both head and tail or a multi-character separator are required.

### Additional Technical Info
`GetStringHead` returns the portion of `S` before the first exact occurrence of the single character `Sep`. The separator and all following text are excluded. If no separator exists, the complete input is returned.

The example is fictional and source-reviewed only.

<small>Created 2026-07-15</small>
