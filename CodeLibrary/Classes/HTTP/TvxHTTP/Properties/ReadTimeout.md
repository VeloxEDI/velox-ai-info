---
title: ReadTimeout
description: Gets or sets the HTTP socket read timeout in whole seconds, with zero representing the effective infinite default.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, timeout, read, socket]
---

```Delphi
property ReadTimeout: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ConnectTimeout := 15;
  Http.ReadTimeout := 60;
  Http.Get('https://api.example.invalid/v1/report');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ReadTimeout` gets or sets the HTTP socket read timeout in whole seconds, with zero representing the effective infinite default.

### Additional Technical Info
`ReadTimeout` exposes Indy's millisecond read timeout as whole seconds. The setter stores `Value * 1000`; the getter returns stored milliseconds `div 1000`.

Velox does not explicitly set a default. The inherited Indy value is `-1` milliseconds (`IdTimeoutDefault`), which Velox reports as `0` seconds because integer division truncates toward zero. Setting the property to `0` stores zero; Indy treats both its default and zero as an infinite read wait. Therefore a new client reads as zero and has no finite read timeout.

Set a positive bound for production calls. It limits socket read waits, not the total synchronous operation: DNS/connect work, OAuth acquisition, multiple redirects, request upload and successive successful reads can make total elapsed time longer. Pair it with [`ConnectTimeout`](ConnectTimeout.md) and an outer execution deadline.

Negative script values have no governed Velox meaning. The unvalidated 32-bit multiplication also means positive values above 2,147,483 seconds overflow before reaching Indy and may raise or produce an unintended negative value depending on build options. Use a small nonnegative operational value.

An expired read wait raises an Indy operational exception rather than producing an HTTP status. Normal request finalisation disconnects, clears pending content and flushes interception before the exception reaches the caller. Response headers/status may be from a partially received or previous response and should not be trusted after an exception.

<small>Created 2026-07-15</small>
