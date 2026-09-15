---
title: "UTCOffsetString"
description: "Formats the host's current local UTC offset as a signed hours-and-minutes string."
sidebar_position: 157
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - utc-offset
  - timezone
  - windows
---

```Delphi
Function UTCOffsetString: String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := UTCOffsetString; // For example, +12:00; host dependent
end;
```

### Usage

`UTCOffsetString` formats the host's current local UTC offset as a signed hours-and-minutes string.

**Returns**

A signed string such as `+12:00`, `+05:30`, `-04:00` or `+00:00`.

**Behaviour**

- A host currently at UTC+12 returns `+12:00`.
- A host currently west of UTC returns a minus sign.
- Zero offset is explicitly formatted as `+00:00`, not `Z`, `UTC` or `GMT`.

**Errors**

No Velox-level error handling surrounds timezone lookup or formatting; unexpected platform/runtime errors propagate.

### Additional Technical Info
`UTCOffsetString` returns the Velox host's current local offset from UTC in fixed signed `HH:MM` form. It describes the offset applicable to `Now` on that host, not an offset for a supplied historical or future date.

The example is environment-dependent and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools import binds to `vxDateTools.UTCOffsetString`. The helper reads `TTimeZone.Local.UtcOffset`; installed Delphi 37.0 implements that property as `GetUtcOffset(Now)`. Velox negates the returned `TTimeSpan`, truncates `TotalMinutes` to an integer bias, inverts the sign selection back to local-minus-UTC notation, and formats absolute hours/minutes through `vxFormat('%s%.02d:%.02d', ...)` using system-default format settings.

**Edge cases and quirks**

- The result is time-dependent. Daylight-saving transitions and host timezone changes can alter it between records.
- There is no input date, so it cannot provide the correct historical/future offset for an arbitrary transaction timestamp.
- `TotalMinutes` is truncated toward zero. Any theoretical sub-minute component is discarded; contemporary timezone offsets are normally minute-aligned.
- The function returns an offset string only, not an ISO 8601 timestamp or timezone identifier. It cannot encode ambiguity or daylight/standard provenance.
- `TTimeZone.Local` is process-global cached timezone infrastructure; operating-system timezone changes during a process lifetime can affect results according to Delphi's refresh behaviour.

**Side effects**

Reads the host clock and local timezone rules. It does not change either one.

**Performance and concurrency**

Constant-time timezone lookup and short formatting allocation. Calls are re-entrant, but their values can change with the clock or host timezone configuration.

**Related entries**

- [`UTCtoLocal`](UTCtoLocal.md) applies a separately sampled current offset to a value.
- [`LocalToUTC`](LocalToUTC.md) subtracts a separately sampled current offset.
- [`NowUTC`](NowUTC.md) returns current UTC fields rather than an offset string.

**External references**

These helper references describe the offset facilities used or comparable to the Velox implementation:

- [Embarcadero `TTimeZone.GetUtcOffset`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TTimeZone.GetUtcOffset)
- [Free Pascal `GetLocalTimeOffset`](https://www.freepascal.org/docs-html/rtl/sysutils/getlocaltimeoffset.html)

<small>Created 2026-07-15</small>
