---
title: VeloxAPIDomain
description: Gets or sets the raw Velox API host used by computed API URLs and copied by some REST/service consumers.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, api, domain]
---

```Delphi
property VeloxAPIDomain: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxAPIDomain
  else
    Value := '';
end;
```

### Usage

`VeloxAPIDomain` gets or sets the raw Velox API host used by computed API URLs and copied by some REST/service consumers.

### Additional Technical Info
`VeloxAPIDomain` is the raw host portion of the configured Velox API address. New setup state defaults it to `localhost`.

The locked setter stores the value unchanged. [`VeloxAPIUrl`](VeloxAPIUrl.md) combines it with the hidden API SSL flag and [`VeloxAPIPort`](VeloxAPIPort.md). Action REST URL logic and service REST managers also read or snapshot the domain.

Supply a host name or address only. Including `http://`, `https://`, a port, path, query or credentials produces malformed/dangerous downstream composition because the URL getter adds its own scheme and port.

The property does not resolve DNS, validate certificates, test reachability, configure an API listener, restart services or update consumers that already copied it. A script assignment can redirect future requests process-wide and is therefore security-sensitive; restrict it to trusted administration and allowlisted targets.

The assignment is immediate in memory but does not call SaveModule. Read the computed URL after any coordinated domain/port change rather than concatenating fields independently.

<small>Created 2026-07-15</small>
