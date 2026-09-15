---
title: "UnixToDateTime"
description: "Converts signed Unix seconds using Velox's direct epoch arithmetic and returns an untagged TDateTime."
sidebar_position: 156
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - unix-time
  - epoch
  - timezone
---

```Delphi
function UnixToDateTime(U: Int64): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := UnixToDateTime(86400); // 2 January 1970 at 00:00
end;
```

### Usage

`UnixToDateTime` converts signed Unix seconds using Velox's direct epoch arithmetic and returns an untagged TDateTime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `U` | `Int64` | Signed seconds relative to the Unix epoch. |

**Returns**

The raw result of `U / 86400 + 25569`, where `25569` is Velox's day number for the Unix epoch.

**Behaviour**

- `0` returns the Unix epoch midnight and `86400` returns the following midnight.
- Non-multiples of 86,400 produce a fractional day and retain sub-day seconds subject to `Double` precision.
- Negative values before 1970 are accepted as arithmetic input.

**Errors**

No function validation or exception handling. The arithmetic usually returns a numeric value even when it is not a usable encoded date.

### Additional Technical Info
`UnixToDateTime` converts a signed count of seconds from `1970-01-01 00:00:00` using Velox's own arithmetic. The result is untagged and no local/UTC conversion is performed; conventional use therefore treats the returned fields as UTC by agreement.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript runtime registers a Velox/PascalScript-owned helper. It does **not** call installed Delphi 37.0 `System.DateUtils.UnixToDateTime`. The custom terminal performs one floating division and one addition, with no timezone option, timestamp helper or calendar validation.

**Edge cases and quirks**

- Delphi's same-name routine has an `AReturnUTC` option and uses DateUtils increment/timezone logic; those are not part of the Velox entry.
- No range check ensures that the result is a valid Delphi calendar date. Extreme `Int64` input can return a raw `Double` far outside years 1..9999; later date routines can then fail.
- For Unix instants before Delphi's 30 December 1899 epoch, direct mathematical negative fractions do not follow Delphi's special negative `TDateTime` time encoding. Timed pre-epoch values can therefore decode to the wrong clock fields. Date-only negative integers avoid that fractional defect.
- Large magnitudes lose single-second precision when converted through `Double`.
- The returned number has no UTC marker. Passing it to `UTCtoLocal` applies that helper's separate legacy current-offset rule.

**Side effects**

None; the helper does not read the host clock or timezone.

**Performance and concurrency**

Constant-time numeric arithmetic with no allocation or shared state.

**Related entries**

- [`DateTimeToUnix`](DateTimeToUnix.md) is Velox's rounded arithmetic conversion in the other direction.
- [`UTCtoLocal`](UTCtoLocal.md) applies the host's sampled current offset.
- [`IncSecond`](IncSecond.md) performs timestamp-normalised second increments.

**External references**

These pages document same-purpose upstream routines for comparison; neither is the terminal used by Velox:

- [Embarcadero `System.DateUtils.UnixToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.UnixToDateTime)
- [Free Pascal `UnixToDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/unixtodatetime.html)

<small>Created 2026-07-15</small>
