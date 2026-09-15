---
title: "PosEx"
description: "Returns the first exact substring position at or after a one-based offset, or zero for no match or an invalid offset."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - search
  - substring
  - offset
---

```Delphi
Function PosEx(const SubStr, S: string; Offset: Integer): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := PosEx('ab', 'ab--ab--ab', 3); // 5
end;
```

### Usage

`PosEx` returns the first exact substring position at or after a one-based offset, or zero for no match or an invalid offset.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `SubStr` | `string` | Non-empty, case-sensitive substring to find. |
| `S` | `string` | Source text. |
| `Offset` | `Integer` | One-based position at which searching begins. The character before it is not considered as a possible match start. |
| Result | `Integer` | First one-based match at or after the offset, or `0`. |

`Offset = 1` is equivalent to [`Pos`](Pos.md). An offset below 1 or beyond the source length returns `0`. Empty `SubStr` returns `0` in the Velox. A substring can extend through the final source character but cannot start before `Offset`.

Search is ordinal, case-sensitive and operates on string code units; it performs no locale mapping, normalisation, regex interpretation or decoding.

To find successive non-overlapping matches, begin the next search at `PreviousPosition + Length(SubStr)` and stop when the result is zero. For overlapping matches, advance by one instead. Always special-case an empty substring to avoid a loop whose progression rule does not match the search contract.

### Additional Technical Info
`PosEx` searches `S` for the first exact occurrence of `SubStr` whose start is at or after the one-based `Offset`. It returns the one-based position or `0` when no qualifying match exists.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.PosEx`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.PosEx)
- [Free Pascal: `StrUtils.PosEx`](https://www.freepascal.org/docs-html/rtl/strutils/posex.html)

<small>Created 2026-07-15</small>
