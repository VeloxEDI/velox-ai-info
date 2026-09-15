---
title: ConnectTimeout
description: Gets or sets how many whole seconds an HTTP request may spend establishing a connection.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, timeout, connection]
---

```Delphi
property ConnectTimeout: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ConnectTimeout := 20;
  Http.ReadTimeout := 60;
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.ConnectTimeout;
end;
```

### Usage

`ConnectTimeout` gets or sets how many whole seconds an HTTP request may spend establishing a connection. The default is 15 seconds. Set [`ReadTimeout`](ReadTimeout.md) separately for waiting on response data; this property is not a deadline for the complete request. Use a small positive value. `0` normally permits an unlimited connection wait, and negative values should not be used.

### Additional Technical Info
`ConnectTimeout` exposes Indy's millisecond connection timeout as whole seconds. The setter calculates `Value * 1000`; the getter returns the stored milliseconds `div 1000`. A new `TvxHTTP` explicitly sets this property to 15 seconds.

The timeout governs establishment of the underlying connection. It is not a deadline for authentication, redirects, request upload, response download or the complete synchronous method. Configure [`ReadTimeout`](ReadTimeout.md) separately and impose an outer workflow deadline where the caller requires one.

`0` is passed to Indy as zero milliseconds and normally means no finite connection deadline. Negative values have no documented Velox meaning and should not be used. The multiplication has no input validation: for a 32-bit native `Integer`, nonnegative values above 2,147,483 seconds overflow the millisecond calculation. Depending on compiler overflow settings, that can raise or produce an unintended negative value. Use a small operationally justified positive value.

The getter reports only whole seconds, so externally injected millisecond values would be truncated. The standard script-facing setter always stores a multiple of 1,000.

A timeout raises an operational exception; it is not converted into an HTTP status in [`Response`](Response.md). The request finaliser disconnects and clears pending content when the exception occurs after the request `try/finally`, but an earlier authentication failure has its separately documented exit behavior.

<small>Created 2026-07-15</small>
