---
title: VeloxWebDomain
description: Gets or sets the raw Velox web host used by the fixed-HTTPS administrator URL.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, web, domain]
---

```Delphi
property VeloxWebDomain: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxWebDomain
  else
    Value := '';
end;
```

### Usage

`VeloxWebDomain` gets or sets the raw Velox web host used by the fixed-HTTPS administrator URL.

### Additional Technical Info
`VeloxWebDomain` is the raw host portion of the Velox web-platform address. New setup state defaults it to the computer's fully qualified name.

The locked setter stores text unchanged. [`VeloxWebUrl`](VeloxWebUrl.md) combines it with fixed HTTPS and [`VeloxWebPort`](VeloxWebPort.md). Designer navigation opens that computed URL only when the domain is nonblank.

Supply a host name or address only. A scheme, port, path, query, fragment or credentials will be combined again and can create an invalid or unsafe URL. The setter does not resolve DNS, validate a certificate, configure IIS/web hosting, test reachability or save Setup.

A script write redirects later web-admin navigation process-wide but does not update bookmarks, reverse proxies, certificates or an existing browser/session. Treat it as privileged configuration and restrict it to trusted allowlisted hosts.

<small>Created 2026-07-15</small>
