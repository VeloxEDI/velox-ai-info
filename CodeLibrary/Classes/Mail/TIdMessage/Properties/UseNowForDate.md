---
title: UseNowForDate
description: Exposes whether Date is the zero sentinel and controls whether generation reads the current clock repeatedly or captures it once.
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, date, now, clock, deterministic]
---

```Delphi
property UseNowForDate: Boolean read write;
```

### Example

```Delphi
procedure FreezeMessageDate;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // If currently dynamic, capture Now once into Date.
  Msg.UseNowForDate := False;
end;
```

### Usage

`UseNowForDate` exposes whether Date is the zero sentinel and controls whether generation reads the current clock repeatedly or captures it once.

### Additional Technical Info
`UseNowForDate` controls whether normal message generation uses a stored [`Date`](Date.md) or reads the current local clock. It is not backed by its own Boolean field. Its getter is exactly equivalent to:

```Delphi
Result := Msg.Date = 0;
```

The setter changes Date only when the requested Boolean differs from the current derived state:

| Assignment | Effect |
|---|---|
| `True` while currently false | Set Date to `0`. |
| `False` while currently true | Set Date to `Now` once. |
| Assign current value again | No change and no new clock read. |

Consequently, assigning Date directly also changes UseNowForDate. There is no state in which UseNowForDate is false and Date is zero.

#### Dynamic versus fixed generation

When UseNowForDate is true, [`GenerateHeader`](../Methods/GenerateHeader.md) reads `Now` into a temporary and formats it. Date remains zero. Every later generation, send or normal save can therefore produce a new header timestamp.

When false, generation uses the stored nonzero Date. Changing true to false is a convenient way to capture the current time once, as shown in the example. Reassigning false later does not refresh that timestamp; set true and then false, or assign Date explicitly, if a deliberate refresh is required.

This distinction matters for deterministic retries, message signing, idempotent archives and comparisons. Freeze the value before the first output when repeated byte-level generation should not change solely because time passed.

#### Clear, load and raw output

[`ClearHeader`](../Methods/ClearHeader.md) assigns Date zero, so UseNowForDate becomes true even though its setter is not called. [`ProcessHeaders`](../Methods/ProcessHeaders.md) sets Date from the incoming header. A missing or unparseable Date can produce zero and re-enable dynamic generation; a later normal save may then add the current date rather than preserve the absence/invalid value.

[`NoEncode`](NoEncode.md) bypasses GenerateHeader. UseNowForDate and Date do not affect the raw output in that mode.

The current-time read uses the Velox process's local environment. Clock accuracy, time-zone configuration and daylight-saving behavior are host concerns. See Date for the current-offset formatting quirk.

The example is source-reviewed only; no clock-dependent message generation was executed.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - derived getter, transition setter and per-generation clock behavior.
- [Embarcadero: `Now`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Now) - Delphi current local date-time routine.
- [Free Pascal: `Now`](https://www.freepascal.org/docs-html/rtl/sysutils/now.html) - compatible core routine documentation.
- [RFC 5322 section 3.6.1](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.1) - origination date semantics.

<small>Created 2026-07-15</small>
