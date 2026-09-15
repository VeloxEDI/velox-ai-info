---
title: VeloxAPIUrl
description: Returns the lock-consistent API base URL computed from the hidden SSL flag, raw domain and raw port.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, api, url]
---

```Delphi
property VeloxAPIUrl: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxAPIUrl
  else
    Value := '';
end;
```

### Usage

`VeloxAPIUrl` returns the lock-consistent API base URL computed from the hidden SSL flag, raw domain and raw port.

### Additional Technical Info
`VeloxAPIUrl` is a read-only computed String.

While holding Setup's lock, the getter chooses `https://` when the native `VeloxAPIEnableSSL` setting is true and `http://` otherwise, then formats:

```text
scheme://domain:port
```

It uses the current raw [`VeloxAPIDomain`](VeloxAPIDomain.md) and [`VeloxAPIPort`](VeloxAPIPort.md), includes the port even when it is the scheme default, and does not append a trailing slash.

The property performs string composition only. It does not normalise/encode the host, apply the API service's zero-port fallback, append an endpoint, test DNS/network/TLS, authenticate, start a listener or send a request. If concatenating an endpoint, include the required separator exactly once.

Because all contributing fields are read under one lock, a single result is internally consistent; separate earlier/later property reads can still observe another global configuration. Some consumers snapshot domain/port, so their effective target can differ after Setup changes.

The computed URL is also saved into a derived setup database column during a host SaveModule operation. Reading it has no side effects and does not prove that saved or live service configuration is reachable.

<small>Created 2026-07-15</small>
