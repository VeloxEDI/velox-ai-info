---
title: "GetDayth"
description: "Appends Velox's limited ordinal suffix to an integer, special-casing only the values 1, 2 and 3."
sidebar_position: 48
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - integer
  - ordinal
  - suffix
  - formatting
---

```Delphi
Function GetDayth(aDay: Integer): String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetDayth(3); // '3rd'
end;
```

### Usage

`GetDayth` appends Velox's limited ordinal suffix to an integer, special-casing only the values 1, 2 and 3.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDay` | `Integer` | Any signed integer. No calendar-day range is enforced. |

**Returns**

`1st`, `2nd` or `3rd` for the three explicitly handled inputs. Every other integer is formatted with `th`, such as `4th`, `11th`, `21th`, `22th`, `-1th` or `0th`.

**Errors**

All values of the declared `Integer` type are handled. Normal result-string allocation failures are the only practical runtime failure path.

**Usage notes**

Do not use this helper when grammatically correct general ordinals are required. Its limited behaviour is retained for compatibility with existing maps.

### Additional Technical Info
`GetDayth` converts an integer to decimal text and appends a small Velox-defined suffix. It is suitable only for the literal values 1, 2 and 3 plus values for which `th` is acceptable; it is not a complete English ordinal formatter.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The common Velox helper uses a `case` statement containing exactly three branches. Each branch calls Delphi `IntToStr(aDay)` and appends `st`, `nd` or `rd`; the `else` branch appends `th`.

**Edge cases and quirks**

- Compound ordinals are not analysed. `21`, `22`, `23`, `101`, `102` and `103` all receive `th`, even where normal English would use another suffix.
- Values 11, 12 and 13 happen to receive their normal English `th` suffix because they take the generic branch.
- Negative values and zero are accepted and are not meaningful calendar validation results.
- The identifier's “Day” wording does not restrict the input to `1..31`.
- Formatting is invariant decimal text; it does not insert locale-specific grouping.

**Side effects**

None.

**Performance and concurrency**

Constant-time integer conversion and a small string allocation, with no shared state.

**External references**

- [Embarcadero `System.SysUtils.IntToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToStr)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html)

<small>Created 2026-07-15</small>
