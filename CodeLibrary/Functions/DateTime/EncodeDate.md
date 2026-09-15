---
title: "EncodeDate"
description: "Encodes validated Gregorian year, month and day fields as a midnight TDateTime value."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - encoding
  - tdatetime
  - delphi
---

```Delphi
function EncodeDate(Year, Month, Day: Word): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeDate(2028, 2, 29); // Leap-day midnight
end;
```

### Usage

`EncodeDate` encodes validated Gregorian year, month and day fields as a midnight TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Year` | `Word` | Gregorian year `1..9999`. |
| `Month` | `Word` | Calendar month `1..12`. |
| `Day` | `Word` | One-based day valid for the supplied month and year; February accepts 29 only in a leap year. |

**Returns**

A `TDateTime` for `00:00:00.000` at the start of the requested date. Dates before Velox's 30 December 1899 epoch have a negative whole-number representation.

**Errors**

An invalid year, month or day raises `EConvertError`. Velox does not catch or translate the exception.

### Additional Technical Info
`EncodeDate` constructs a Delphi `TDateTime` at midnight from calendar year, month and day fields. Velox binds the script declaration directly to Delphi `System.SysUtils.EncodeDate`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript date library exposes the exact four-byte `Word` inputs and registers Delphi's `System.SysUtils.EncodeDate` as the runtime terminal. The RTL validates the fields and converts the Gregorian date to Delphi's day-count representation. No time, timezone or locale is consulted.

**Edge cases and quirks**

- The year range is `1..9999`; year zero is not supported.
- The valid `Day` range depends on both `Month` and leap-year status. The routine does not normalise values such as day 32 into the following month.
- Midnight is a timezone-neutral encoded value. `EncodeDate` does not mean local midnight or UTC midnight until the surrounding integration assigns that interpretation.
- Free Pascal provides the same basic contract, but the installed Delphi RTL is the authority for Velox exception and representation behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic with no allocation or shared mutable state.

**Related entries**

- [`EncodeDateTime`](EncodeDateTime.md) adds time fields to the date.
- [`DecodeDate`](DecodeDate.md) extracts the corresponding calendar fields.

**External references**

- [Embarcadero `System.SysUtils.EncodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeDate)
- [Free Pascal `EncodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/encodedate.html)

<small>Created 2026-07-15</small>
