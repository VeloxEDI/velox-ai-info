---
title: "Global1"
description: "Provides action-scoped scratch Variant slot 1, shared by scripts using the current action and reset between action-data cycles."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - globals
  - variant
---

```Delphi
Global1: Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Global1 := 'Example shared value';
  Value := Global1;
end;
```

### Usage

`Global1` provides action-scoped scratch Variant slot 1, shared by scripts using the current action and reset between action-data cycles.

**Initialisation, scope and lifetime**

Action data reset assigns `Unassigned` to this field. It is not loaded from configuration or a database and is not retained as durable state. Its value can remain available across script items within the current action-data cycle, but it must be assigned before a consumer relies on it.

The name “Global” means global to the action's scripts, not global to the Velox process, another action, another service worker or another server. Action cleanup owns the field; scripts should not retain references derived from it beyond execution.

**Variant behaviour**

The value type follows the assigned value and can change. `Unassigned`, `Null`, empty text, zero and `False` are distinct. Implicit numeric, string, date and Boolean conversions can lose precision or raise at runtime, and expressions involving `Null` can propagate `Null`. Establish one type/meaning for the slot within a flow and validate external data before assignment.

**Side effects, concurrency and safety**

- Assignment changes only in-memory action state; it does not persist, log, trigger a map event or commit a transaction.
- Later scripts can overwrite the value, so document producer/consumer order and avoid hidden dependencies.
- The raw Variant field has no independent lock and is not safe for asynchronous or concurrent mutation.
- Do not store credentials, large payloads, datasets or live object references. Use explicit typed configuration/data structures for long-lived or governed values.
- Errors arise from the operation performed on the current Variant type rather than from the variable accessor itself.

### Additional Technical Info
`Global1` is one of ten general-purpose `Variant` fields on the current `TvxActionMan`. It lets separate scripts bound to that action exchange a scalar value without defining a named variable.

**Runtime binding and identity**

The script engine registers a pointer Variant and binds `Global1` directly to `TvxActionMan.FGlobal1`. Reading and assignment therefore operate on the same field for every script using that action object. The ten numbered fields are independent; assigning this slot does not change another slot or the process-wide `Globals` list.

**Related entries**

- [`Globals`](../Globals.md) explains scope selection.
- [`Globals`](Globals.md) is the distinct process-wide named variable list.

**External references**

- [Embarcadero: Variant Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_%28Delphi%29) documents Delphi Variant states, conversions and expressions.
- [Free Pascal Reference Guide: Variant types](https://www.freepascal.org/docs-html/current/ref/ref.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
