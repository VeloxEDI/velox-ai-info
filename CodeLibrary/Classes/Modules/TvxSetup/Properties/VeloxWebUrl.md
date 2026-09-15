---
title: VeloxWebUrl
description: Returns the lock-consistent fixed-HTTPS web administrator URL with an explicit port and trailing slash.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, web, url]
---

```Delphi
property VeloxWebUrl: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxWebUrl
  else
    Value := '';
end;
```

### Usage

`VeloxWebUrl` returns the lock-consistent fixed-HTTPS web administrator URL with an explicit port and trailing slash.

### Additional Technical Info
`VeloxWebUrl` is a read-only computed String.

While holding Setup's lock, the getter formats the current [`VeloxWebDomain`](VeloxWebDomain.md) and [`VeloxWebPort`](VeloxWebPort.md) exactly as:

```text
https://domain:port/
```

HTTPS is unconditional, the port is always explicit and the result always has a trailing slash. This differs from [`VeloxAPIUrl`](VeloxAPIUrl.md), whose scheme is configurable natively and whose result has no trailing slash.

The value is used for designer web-admin navigation and captured as the `VeloxWebAdmin` script constant when constants are registered. An already compiled constant can therefore retain an older URL even though a direct Setup.VeloxWebUrl read computes current fields.

The getter performs no escaping, DNS lookup, certificate validation, reachability test, authentication or browser/network operation. Raw domain/port errors are carried into the result. Host SaveModule also stores a derived copy, but reading the property has no persistence side effect.

Use this as a base URL only after validating trusted setup. Its trailing slash matters when appending a relative path; avoid creating double separators or allowing untrusted absolute URL replacement.

<small>Created 2026-07-15</small>
