---
title: "Tomorrow"
description: "Returns the Windows host's next local calendar date at midnight."
sidebar_position: 145
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - tomorrow
  - local-time
  - windows
---

```Delphi
Function Tomorrow: TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Tomorrow;
end;
```

### Usage

`Tomorrow` returns the Windows host's next local calendar date at midnight.

**Returns**

The host's next local date at `00:00:00.000` as an untagged `TDateTime`.

**Behaviour**

- A call made on 18 July returns midnight at the start of 19 July according to the host calendar.
- The result changes when the host-local date crosses midnight.
- Adding a whole encoded day avoids daylight-saving elapsed-time arithmetic; the function returns a calendar date without a timezone tag.

**Important usage notes**

- The value comes from the Velox host, not a client workstation, source document or trading partner timezone.
- Two calls around local midnight can return different dates. Capture one result when a flow requires a stable processing date.
- The function does not attach a timezone or UTC marker. Formatting or later conversion depends on the surrounding convention.
- It is equivalent to `Date + 1`, not `Now + 1`: the time portion is always zero.

**Errors**

No normal application error is expected. Operating-system clock availability and invalid host state are not handled by a Velox function.

### Additional Technical Info
`Tomorrow` returns the calendar date immediately after the Windows host's current local date. The result is midnight at the start of that next day, not the current time plus 24 elapsed hours.

The example is environment-dependent and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils scripting import binds directly to Delphi 37.0 `System.DateUtils.Tomorrow`. The terminal calls `System.SysUtils.Date` to take one local Windows date snapshot and adds one whole encoded day.

**Side effects**

Reads the host's local system date. It does not change the clock or persistent state.

**Performance and concurrency**

Constant-time with one host-clock read. It is re-entrant, but results can differ across a midnight or concurrent host clock/timezone change.

**Related entries**

- [`Today`](Today.md) returns the current host-local date.
- [`Yesterday`](Yesterday.md) returns the preceding host-local date.
- [`Now`](Now.md) includes the current local time.

**External references**

- [Embarcadero `System.DateUtils.Tomorrow`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.Tomorrow)
- [Free Pascal `Tomorrow`](https://www.freepascal.org/docs-html/rtl/dateutils/tomorrow.html)

<small>Created 2026-07-15</small>
