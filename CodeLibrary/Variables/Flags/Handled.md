---
title: "Handled"
description: "Signals that the custom script handled the surrounding transport response/message so standard handling should change."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - transport-handling
---

```Delphi
Handled: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Handled := True;
  Value := Handled;
end;
```

### Usage

Set `Handled := True` only in a custom transport script whose calling module documents the flag. In supported HTTP handling it suppresses the standard error handling after the script has supplied equivalent handling or logging; in supported IMAP handling it marks the email for processed handling. Leave it `False` when Velox should continue.

`Handled` is not the script's success result: set the event's `Value` separately when that contract requires a result. Before setting `Handled`, ensure the script has performed any replacement logging or response work, otherwise useful default diagnostics or message handling can be lost.

### Additional Technical Info

`Handled` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | Current `TvxScripter.FHandled` |
| Reset/default | Boolean storage begins false; transport script-item setup explicitly sets `Handled := False` before each custom transport execution. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Intended meaning**

Signals that the custom script handled the surrounding transport response/message so standard handling should change.

**Executable effect**

The effect is context-specific. The HTTP template documents `True` as suppressing standard error messages after custom logging; the IMAP template documents it as accepting the handled email for processed handling. `TvxScriptItem` copies the scripter flag back after execution.

**Context and lifecycle**

Use only where the invoking transport documents the flag. It is not a universal success result—`Value` separately carries the script's Boolean result.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Setting `Handled` without producing equivalent logging/output can hide default diagnostics or change message disposition. Outside a consumer context it merely changes scripter state. Do not assume every script runner resets or reads it.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
