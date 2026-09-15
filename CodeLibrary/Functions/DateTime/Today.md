---
title: "Today"
description: "Returns the Windows host's current local calendar date at midnight."
sidebar_position: 144
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - today
  - windows
  - local-date
---

```Delphi
Function Today : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Today; // Current local date on the executing Velox host, at midnight
end;
```

### Usage

`Today` returns the Windows host's current local calendar date at midnight.

**Returns**

A `TDateTime` for the host-local current year, month and day at 00:00:00.000.

**Behaviour**

- The operating system's current local timezone and daylight-saving configuration determine which calendar date is “today”.
- The time portion is exactly zero.
- The result contains no timezone or local/UTC marker.
- Repeated calls across local midnight can return different dates.

**Errors**

The normal Windows date read does not raise. Any unexpected encoder failure propagates without Velox translation.

**Usage notes**

Use `Now` for the same host-local date plus current time. Store one `Today` result at flow start when all records must share one processing date.

### Additional Technical Info
`Today` returns the executing Windows host's current local calendar date with all time fields set to zero.

The example is source-reviewed and intentionally environment-dependent. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.Today`, whose installed implementation returns `System.SysUtils.Date`. On Windows, `Date` takes one `GetLocalTime` snapshot and encodes only its year, month and day fields.

**Edge cases and quirks**

- `Today` is evaluated on the machine executing the Velox process, not on a user's workstation or in a source system's timezone.
- A long-running flow that calls it on both sides of midnight can observe two dates. Capture the value once when consistency matters.
- Host clock or timezone changes can also change the result.
- The function returns a calendar date, not the UTC date. Use an explicit UTC design when business rules require UTC boundaries.
- Free Pascal's same-name function is compatible at the API level, but installed Delphi's Windows local-clock path defines Velox behaviour.

**Side effects**

None beyond reading the operating-system clock.

**Performance and concurrency**

Constant-time clock read and date encoding. Safe for concurrent ordinary calls, although each call observes its own instant and host configuration.

**Related entries**

- [`Now`](Now.md) returns local date and time.
- [`StartOfTheDay`](StartOfTheDay.md) removes time from an existing value.

**External references**

- [Embarcadero `System.DateUtils.Today`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.Today)
- [Free Pascal `Today`](https://www.freepascal.org/docs-html/rtl/dateutils/today.html)

<small>Created 2026-07-15</small>
