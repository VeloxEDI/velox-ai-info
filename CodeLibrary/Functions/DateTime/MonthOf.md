---
title: "MonthOf"
description: "Returns the decoded calendar month number from 1 through 12."
sidebar_position: 104
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - month
  - component
---

```Delphi
Function MonthOf(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 0, 0);
  Value := MonthOf(InputValue); // 7
end;
```

### Usage

`MonthOf` returns the decoded calendar month number from 1 through 12.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose calendar month component is required. |

**Returns**

A `Word` from 1 for January through 12 for December.

**Behaviour**

- The time-of-day component does not affect the result.
- The same month number is returned for every day in that calendar month.
- Valid pre-epoch `TDateTime` values are decoded using Velox's sign-aware date logic.
- No locale, timezone or month-name lookup is involved.

**Important usage notes**

- The result is numeric and one-based; zero is never returned for a successfully decoded date.
- This is a calendar month component, not an elapsed-month count or ISO week-month concept.
- Invalid or non-finite encoded input can raise during decoding.

**Usage notes**

Use the month-name helpers only when converting locale-specific text. `MonthOf` itself is independent of locale.

### Additional Technical Info
`MonthOf` returns the calendar month number encoded in a `TDateTime`, where January is 1 and December is 12.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MonthOf`. It calls `DecodeDate`, retains the decoded month and discards the year and day outputs.

**Side effects**

None.

**Errors**

Velox does not catch or translate date decode exceptions.

**Performance and concurrency**

Constant-time calendar decoding with no external I/O or shared mutable state.

**Related entries**

- [`MonthOfTheYear`](MonthOfTheYear.md) is an exact alias.
- [`MonthNoFromLongName`](MonthNoFromLongName.md) maps a locale-specific name to the same numeric domain.

**External references**

- [Embarcadero `System.DateUtils.MonthOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MonthOf)
- [Free Pascal `MonthOf`](https://www.freepascal.org/docs-html/rtl/dateutils/monthof.html)

<small>Created 2026-07-15</small>
