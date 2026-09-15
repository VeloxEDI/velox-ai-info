---
title: "Local1"
description: "Provides scripter-scoped scratch Variant slot 1, which must be explicitly initialised on every execution path."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - locals
  - variant
---

```Delphi
Local1: Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Initialise every execution; a reused scripter can retain an old value. }
  Local1 := 'Example local value';
  Value := Local1;
end;
```

### Usage

`Local1` provides script-execution scratch Variant slot 1, which must be explicitly initialised on every execution path.

**Initialisation and reuse quirk**

This slot can still contain a value from a previous record or action execution. Always assign the intended value before reading it.

Always assign a deliberate default/value before the first read on every control-flow path. Do not test an old/`Unassigned` state to infer whether the current execution supplied data.

**Variant behaviour**

The value type follows assignments and can change. `Unassigned`, `Null`, empty text, zero and `False` are distinct. Implicit string/numeric/date/Boolean conversions can raise or lose precision, and `Null` expressions can propagate `Null`. Give the slot one documented type and meaning within the script.

**Side effects, lifetime and safety**

- Assignment changes only this Local value; it does not save data, write a log entry, create output or commit a transaction.
- The value can remain across multiple executions, but it is not durable across a Velox restart.
- Do not use it for asynchronous or cross-action coordination.
- Avoid credentials, personal data, large payloads, datasets and live object references. Use named/typed structures with explicit ownership where appropriate.
- Conversions and operations can raise errors when the current value has an incompatible type.

### Additional Technical Info
`Local1` is a general-purpose `Variant` field on the specific `TvxScripter` that executes this script. It is independent from named `Locals`, all other numbered slots and the fields of every other scripter.

**Runtime binding and identity**

The script engine registers a pointer Variant bound directly to `TvxScripter.FLocal1`. Reads and assignments operate on that field. It is not stored on `TvxActionMan`, so another event/script scripter in the same action does not automatically see it.

**Related entries**

- [`Locals`](../Locals.md) explains scope and the reuse hazard.
- [`Locals`](Locals.md) is the distinct action-owned named variable list.

**External references**

- [Embarcadero: Variant Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_%28Delphi%29) documents Delphi Variant states and conversions.
- [Free Pascal Reference Guide: Variant types](https://www.freepascal.org/docs-html/current/ref/ref.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
