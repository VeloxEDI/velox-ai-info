---
title: VeloxAPIPort
description: Gets or sets the raw API port, including a zero-value mismatch between service binding and computed URL output.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, api, port]
---

```Delphi
property VeloxAPIPort: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxAPIPort
  else
    Value := 0;
end;
```

### Usage

`VeloxAPIPort` gets or sets the raw API port, including a zero-value mismatch between service binding and computed URL output.

### Additional Technical Info
`VeloxAPIPort` is the Integer port stored for the Velox API. New setup state defaults it to `8359`.

The getter/setter lock Setup but perform no range or availability validation. [`VeloxAPIUrl`](VeloxAPIUrl.md) always formats the raw value after a colon.

**Zero-value quirk**

The Velox API service's listener selection treats a configured value of `0` as fallback port `8359`. The computed VeloxAPIUrl does not apply that fallback and renders `:0`. As a result, listener and advertised/generated URL can disagree.

Other REST/service objects can copy the raw port during construction. Changing it does not restart/rebind a listener or update an existing object's snapshot, and a successful setter does not prove that a port is valid, free, firewall-accessible or TLS-compatible.

Use a valid authorised TCP port and coordinate the change with service restart, certificates, firewall/reverse proxy and [`VeloxAPIDomain`](VeloxAPIDomain.md). Direct script writes are process-global and not automatically persisted.

<small>Created 2026-07-15</small>
