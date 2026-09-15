---
title: "TestMode"
description: "Reports the process system-connection mode captured as an immutable Boolean when the script was compiled."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - test-mode
  - connection
---

```Delphi
TestMode = <True or False>
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if TestMode then
    Value := 'Test'
  else
    Value := 'Production';
end;
```

### Usage

`TestMode` reports the process system-connection mode captured as an immutable Boolean when the script was compiled.

### Additional Technical Info
`TestMode` is a Boolean constant containing the global Velox system-connection mode at script compilation.

**Effective declaration**

The generated index snapshot displays `TestMode = 1` because the documentation generator ran while test mode was true. That is not a universal fixed value. `RegisterConstants` calls `TestMode.ToInteger` and supplies `1` for true or `0` for false to a PascalScript Boolean constant.

Switching system mode updates the process global and connection object, clears connection pools and—during the normal Designer mode-change path—releases/reloads modules and Setup. However, the value inside an already compiled script is immutable. Code must not use it as the only last-moment safeguard before a destructive operation; validate the actual configured connection/environment through governed flow design and permissions.

Reading the constant is cheap and has no I/O or error path. It cannot be assigned. Its purpose is conditional behavior and diagnostic output in scripts intentionally compiled for the active mode.

**Related entries**

- [`Setup`](Setup.md) is the live General Setup module but does not expose system mode directly.
- [`DefaultDir`](DefaultDir.md) and [`VeloxWebAdmin`](VeloxWebAdmin.md) share the compile-time snapshot lifecycle.

<small>Created 2026-07-19</small>
