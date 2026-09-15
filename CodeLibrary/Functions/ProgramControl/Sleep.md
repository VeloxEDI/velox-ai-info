---
title: "Sleep"
description: "Suspends the current Velox worker thread for a Cardinal number of milliseconds through Windows Sleep."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - sleep
  - delay
  - blocking
  - windows
---

```Delphi
procedure Sleep(milliseconds: Cardinal);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Sleep(250); // request a delay of at least 250 milliseconds
  Value := 'Delay completed';
end;
```

### Usage

Suspends the current Velox worker thread for a Cardinal number of milliseconds through Windows Sleep.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `milliseconds` | `Cardinal` | Unsigned 32-bit delay interval in milliseconds. `1000` requests approximately one second. `$FFFFFFFF` has Windows' special `INFINITE` meaning. |

**Selection guidance**

Do not use `Sleep` as a substitute for action scheduling, transport retry policy, an external service timeout or a durable polling mechanism. Prefer configured scheduling/retry facilities so a worker is not occupied while no useful work is being performed. If a short delay is unavoidable, keep it bounded, document why it is required and account for maximum concurrent flow executions.

### Additional Technical Info
`Sleep` suspends the thread executing the current Velox script for the requested number of milliseconds. The PascalScript import points directly to Delphi's Windows `Sleep`, which is an external Kernel32 routine; Velox adds no scheduler, cancellation check, logging or asynchronous continuation.

Use it sparingly. A sleeping worker cannot process another record or flow during the delay. The example is fictional and source-reviewed only; no delay is run during documentation validation.

**Timing behaviour**

Windows makes the thread non-runnable for at least approximately the requested interval, subject to system timer resolution and scheduling. Once the interval has elapsed, the thread becomes eligible to run; it can resume later under system load. Do not use `Sleep` for precise timing, deadlines or elapsed-time measurement.

`Sleep(0)` gives up the remainder of the current thread's time slice to another ready thread and can return immediately. It is not a reliable throttling delay.

Passing `$FFFFFFFF` (`4294967295`) maps to Windows `INFINITE`, so the thread does not resume due to a timeout. This is especially dangerous in a service worker and should not be used in a Velox script.

**Blocking and cancellation**

The call blocks the current OS thread and does not pump Designer window messages. A long delay can freeze an interactive operation or reduce service throughput; many simultaneous sleeping flows can exhaust available worker threads.

Velox cancellation flags are not checked during the call. `StopFlow`, service shutdown requests and map cancellation do not shorten the interval. Processing observes those states only after Windows returns and the script reaches code that checks or returns to the surrounding engine.

**Side effects and errors**

The routine changes no Velox data and returns no status. The Windows API reports no failure result for this call. Exceptions are not expected from the normal external call, although an invalid script expression can fail before the routine is entered.

Sleeping does not create a transaction timeout boundary or release resources held by the flow. Database transactions, locks, pooled connections and in-memory objects remain owned by the blocked execution context.

**External references**

- [Microsoft Learn: `Sleep`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-sleep)
- [Free Pascal: `SysUtils.Sleep`](https://www.freepascal.org/docs-html/rtl/sysutils/sleep.html)
- [Embarcadero DocWiki: `System.SysUtils.Sleep`](https://docwiki.embarcadero.com/Libraries/Athens/en/API%3ASystem.SysUtils.Sleep)

<small>Created 2026-07-15</small>
