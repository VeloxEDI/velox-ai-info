---
title: Yesterday
description: "Returns the Windows host's previous local calendar date at midnight."
sidebar_position: 179
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - local-date
---

```Delphi
Function Yesterday : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Yesterday;
  // Value is the Velox host's previous local date at 00:00:00.000.
end;
```

### Usage

`Yesterday` returns the Windows host's previous local calendar date at midnight.

**Returns**

A `TDateTime` representing the host's previous local calendar date at `00:00:00.000`.

**Behaviour**

The value depends on the Velox execution host, not on the workstation that designed the Flow and not on any source-data timezone. Each call reads the current local date through `Date`.

**Errors**

The function has no arguments and no Velox error function. Any exceptional host date/encoding failure from the RTL propagates.

**Usage notes**

Use `Today` for the current host-local date, or `DateUTC - 1` when the intended boundary is the host's current UTC calendar date rather than its local date.

### Additional Technical Info
Returns the calendar date immediately before the current local date on the Windows computer running the script. The result is encoded at midnight and carries no timezone identifier.

**Implementation**

Velox binds directly to `System.DateUtils.Yesterday`. The installed implementation evaluates `System.SysUtils.Date - 1`. On Windows, `Date` reads the host's local system date and encodes it at midnight; subtracting one changes the encoded calendar date by one day.

**Edge cases and quirks**

- A script running on a host configured for a different timezone can observe a different `Yesterday` from a user elsewhere.
- Repeated calls on opposite sides of local midnight can return different dates. Capture the result once when a Flow requires one stable processing-date basis.
- The result is an untagged `TDateTime`; it does not record the host timezone or UTC offset.
- Calendar-day subtraction is appropriate here because `Date` is midnight. The result does not represent "exactly 24 elapsed hours before now".
- Free Pascal documents the analogous helper, but host clock and platform services are implementation-specific. Velox follows Windows and the installed Delphi RTL.

**Performance and concurrency**

The routine performs one host local-date read and fixed arithmetic. Concurrent calls do not share mutable Velox state, but calls made across the midnight boundary can legitimately differ.

**Related entries**

- [`Today`](Today.md) — returns the current host-local date at midnight.
- [`Tomorrow`](Tomorrow.md) — returns the next host-local calendar date.
- [`DateUTC`](DateUTC.md) — reads the current UTC calendar date at midnight.

**External references**

- [Free Pascal: `Yesterday`](https://www.freepascal.org/docs-html/rtl/dateutils/yesterday.html)
- [Embarcadero DocWiki: `System.DateUtils.Yesterday`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.Yesterday)

<small>Created 2026-07-15</small>
