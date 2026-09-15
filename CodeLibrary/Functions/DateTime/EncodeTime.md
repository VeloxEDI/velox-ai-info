---
title: "EncodeTime"
description: "Encodes validated hour, minute, second and millisecond fields as a time-only TDateTime value."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - encoding
  - milliseconds
  - delphi
---

```Delphi
function EncodeTime(Hour, Min, Sec, MSec: Word): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeTime(14, 30, 45, 125);
end;
```

### Usage

`EncodeTime` encodes validated hour, minute, second and millisecond fields as a time-only TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Hour` | `Word` | Hour `0..23`. |
| `Min` | `Word` | Minute `0..59`. |
| `Sec` | `Word` | Second `0..59`; leap-second value 60 is invalid. |
| `MSec` | `Word` | Millisecond `0..999`. |

**Returns**

A non-negative `TDateTime` fraction between `0` for midnight and just under `1` for `23:59:59.999`.

**Errors**

An out-of-range component raises `EConvertError`; Velox does not catch it.

### Additional Technical Info
`EncodeTime` constructs a time-of-day fraction from hour through millisecond fields. Velox binds the generated script declaration directly to Delphi `System.SysUtils.EncodeTime`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript date library registers the exact Delphi RTL routine. The terminal validates all four fields and converts them to the fraction of a 24-hour day represented by the requested millisecond timestamp.

**Edge cases and quirks**

- `24:00:00.000` is invalid; use the following date's midnight when that boundary is required.
- The result is time-only. Adding it directly to a non-negative encoded date is conventional, but adding it to a negative pre-epoch date gives the wrong result under Delphi's sign convention. Use `EncodeDateTime` for a complete historical timestamp.
- Resolution is one millisecond and the binary floating representation may not store the decimal fraction exactly.
- The function does not apply a timezone, daylight-saving rule or locale.

**Side effects**

None.

**Performance and concurrency**

Constant-time validation and arithmetic with no shared state.

**Related entries**

- [`DecodeTime`](DecodeTime.md) writes the encoded time fields to variables.
- [`EncodeDateTime`](EncodeDateTime.md) safely combines date and time fields, including pre-epoch dates.

**External references**

- [Embarcadero `System.SysUtils.EncodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeTime)
- [Free Pascal `EncodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/encodetime.html)

<small>Created 2026-07-15</small>
