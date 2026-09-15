---
title: "IsToday"
description: "Reports whether a `TDateTime` falls on the host machine's current local date."
sidebar_position: 74
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - validation
  - boolean
---

```Delphi
Function IsToday(const AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsToday(Date); // Normally True
end;
```

### Usage

`IsToday` reports whether a `TDateTime` falls on the host machine's current local date.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded value compared with the host's current local date. |

**Returns**

`True` when the value is in the numeric day interval selected by the current local `Date`; otherwise `False`.

**Behaviour**

- The answer depends on the Windows host's local clock and timezone configuration.
- The current date is read inside the call; the input is not converted from UTC or any other timezone.
- A time anywhere in today's ordinary post-epoch numeric interval is accepted.

**Important usage notes**

- A call at the local-midnight boundary can disagree with a date value captured just before midnight, as shown by the deliberately compact example.
- It inherits `IsSameDay`'s raw-comparison defect for timed pre-epoch values.
- Tests and repeatable flows should inject or compare against an explicit business date when host-clock dependency is undesirable.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsToday` reports whether a `TDateTime` falls on the host machine's current local date.

The example is fictional and source-reviewed. Its result is deliberately host-clock dependent. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsToday`. It reads Delphi's `Date` function at call time and delegates to `IsSameDay(AValue, Date)`.

**Side effects**

Reads the host machine's current local date. It does not modify state.

**Errors**

There is no wrapper exception handling. Invalid or non-finite encoded values can raise during decoding or produce non-useful comparisons rather than a meaningful Boolean.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The result can change as the host clock crosses local midnight.

**Related entries**

- [`IsSameDay`](IsSameDay.md) implements the numeric day-interval comparison.
- [`DateOf`](DateOf.md) extracts an encoded date part without consulting the clock.

**External references**

- [Embarcadero `System.DateUtils.IsToday`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsToday)
- [Free Pascal `IsToday`](https://www.freepascal.org/docs-html/rtl/dateutils/istoday.html)

<small>Created 2026-07-15</small>
