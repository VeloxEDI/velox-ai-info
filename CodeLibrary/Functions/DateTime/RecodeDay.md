---
title: "RecodeDay"
description: "Replaces the day-of-month field while preserving all other encoded components."
sidebar_position: 113
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - day
  - recode
---

```Delphi
Function RecodeDay(const AValue: TDateTime; const ADay: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 15, 250);
  Value := RecodeDay(InputValue, 25); // 25 July 2026 at 09:30:15.250
end;
```

### Usage

`RecodeDay` replaces the day-of-month field while preserving all other encoded components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose year, month and time fields are preserved. |
| `ADay` | `Word`, `const` | Replacement day valid for the base year/month, or `65535` to preserve the base day. |

**Returns**

A newly encoded value with the resolved day and every other decoded component preserved.

**Behaviour**

- The time is preserved to millisecond resolution.
- Leap-year and month-length rules come from the preserved base year and month.
- `AValue` is not modified.
- Valid pre-epoch output is composed using sign-aware encoding.

**Important usage notes**

- A day outside the base month is rejected rather than clamped. For example, recoding a February value to day 30 raises.
- `65535` is DateUtils' leave-as-is sentinel and produces a logical no-op. The named constant is not exposed to scripts.
- Zero is not a valid day and does not mean preserve.
- The routine does not add or subtract days; use a day-increment function for interval arithmetic.

**Usage notes**

Validate external day values against the resolved month or handle `EConvertError` explicitly.

### Additional Technical Info
`RecodeDay` replaces the day-of-month field and preserves the encoded year, month and time fields. The replacement must exist in the base value's calendar month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeDay`. It calls the shared `RecodeDateTime` terminal with `ADay` and the internal leave-as-is sentinel for every other field. The terminal decodes, resolves, validates through `TryEncodeDateTime`, and raises on failure.

**Side effects**

None on success. Locale globals are read only if an exception message must be formatted.

**Errors**

An invalid day or unsuitable base value raises `EConvertError`; Velox does not catch it. Failure-message punctuation depends on global `FormatSettings`.

**Performance and concurrency**

Constant-time decoding and encoding. Successful calls have no shared mutable state; only failure-message formatting reads global locale data.

**Related entries**

- [`RecodeDate`](RecodeDate.md) replaces year, month and day together.
- [`RecodeDateTime`](RecodeDateTime.md) documents the shared sentinel and encoder path.
- [`IncDay`](IncDay.md) performs interval arithmetic instead of field replacement.

**External references**

- [Embarcadero `System.DateUtils.RecodeDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeDay)
- [Free Pascal `RecodeDay`](https://www.freepascal.org/docs-html/rtl/dateutils/recodeday.html)

<small>Created 2026-07-15</small>
