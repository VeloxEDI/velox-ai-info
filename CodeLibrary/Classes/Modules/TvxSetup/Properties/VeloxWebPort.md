---
title: VeloxWebPort
description: Gets or sets the unvalidated port inserted into the computed Velox web administrator URL.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, web, port]
---

```Delphi
property VeloxWebPort: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxWebPort
  else
    Value := 0;
end;
```

### Usage

`VeloxWebPort` gets or sets the unvalidated port inserted into the computed Velox web administrator URL.

### Additional Technical Info
`VeloxWebPort` is the Integer port included in the Velox web-platform URL. New setup defaults it to `443`.

The getter/setter lock Setup and directly use/store the value. [`VeloxWebUrl`](VeloxWebUrl.md) always renders it after a colon, including port 443.

There is no range, availability or compatibility validation. Assigning zero, a negative value or a value above the TCP port range can produce an invalid URL. A setter does not configure/rebind IIS or another web listener, update reverse-proxy/firewall rules, issue certificates, restart a service or test reachability.

Coordinate an authorised port change with [`VeloxWebDomain`](VeloxWebDomain.md), hosting and TLS infrastructure. A script assignment affects later computed URLs in the current process, is not automatically persisted and should not be used as action-local state.

<small>Created 2026-07-15</small>
