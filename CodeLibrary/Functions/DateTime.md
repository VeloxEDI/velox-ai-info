---
title: "Date & Time"
description: "Date and time functions for clocks, calendar decomposition, comparison, spans and timestamp conversions."
sidebar_position: 9
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - calendar
  - timezone
  - delphi
---

The Date & Time functions expose Velox helpers and selected Delphi runtime operations for constructing, comparing, decomposing, formatting and converting `TDateTime` values. Use this group when a script needs calendar components, elapsed spans, local or UTC clock values, ISO week information, or an interchange timestamp.

## Value model

Velox scripts use Delphi's `TDateTime` representation: a floating-point day count whose epoch is 30 December 1899. The integral part identifies a date and the fractional magnitude identifies a time of day. One day is `1.0`; one hour is `1 / 24`. Values do not contain a timezone, locale or daylight-saving marker.

That model has practical consequences:

- local, UTC and timezone-neutral values are all the same type, so the script must preserve their meaning;
- arithmetic does not consult timezone or daylight-saving rules, and direct subtraction has a further pre-epoch trap: Delphi's negative fractional-time convention means raw differences across different dates before 30 December 1899 are not necessarily chronological durations;
- most Delphi routines work at millisecond resolution even though the underlying `Double` can contain smaller differences; and
- values before the 1899 epoch use Delphi's negative-value convention, where the time-of-day is represented by the magnitude of the fractional part.

## Choosing an entry

- Use `CompareDate`, `CompareTime` or `CompareDateTime` according to whether the calendar date, time of day, or full timestamp matters.
- Use `DayOfTheWeek` and the ISO decode functions when Monday must be day `1`. `DayOfWeek` uses the older Sunday-first numbering instead.
- Use `DaysBetween` for complete millisecond-normalised 24-hour units. `DaySpan` preserves a raw fractional difference but requires particular care with pre-epoch values.
- Use `Date` for the Velox host's local date and `DateUTC` for the current UTC date. Neither result records which clock produced it.
- Treat `DateTimeToUnix` as a timezone-neutral numeric conversion. The Velox-exposed implementation does not convert local time to UTC.

## Important behaviour

Several entries are direct bindings to the Delphi 37.0 runtime installed with the product, while `DateUTC` and the script-level `DateTimeToUnix` have Velox/PascalScript implementations. Similar names therefore do not prove identical overloads or error behaviour. Each child page identifies the actual terminal implementation.

Formatting entries can observe process-wide locale settings. Clock entries observe the Windows host clock. Pure component and arithmetic entries neither attach timezone information nor compensate for daylight-saving transitions. Validate calendar fields before calling low-level routines that index date tables; not every Delphi helper performs its own range check.
