---
title: "Globals"
description: "Action-scoped scratch variants and the distinct process-wide named global variable list."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - globals
  - scope
---

Velox exposes two very different kinds of “global” state. `Global1` through `Global10` are ten scratch `Variant` fields shared only by scripts using the current action and reset for the next action-data cycle. `Globals` is a named `TvxVariableList` singleton shared by all actions and threads in the current Velox process.

## Scope comparison

| Entry | Scope | Initial/reset state | Persistence | Concurrency |
|---|---|---|---|---|
| `Global1`-`Global10` | Current `TvxActionMan` | Set to `Unassigned` during action data reset | No restart persistence; not shared with another action object | Raw mutable Variant; do not use asynchronously |
| `Globals['Code']` | Whole Velox process | Missing names are created lazily with `Null` Value | Survives action runs in that process; lost at process/service restart | Individual lookup/get/set uses locks; compound business updates are not atomic |

## Choose the narrowest scope

Use the numbered slots for temporary values that several scripts in one action execution must share. Give each slot one documented purpose within the flow and assign it before reading. Prefer `Local1`-`Local10` when only one scripter needs the value.

Use the named `Globals` list only for deliberately process-wide, disposable coordination or cached scalar state whose staleness and loss at restart are acceptable. It is not a configuration store, database, distributed cache, queue, lock manager or transaction system.

## Variant boundaries

A `Variant` can change runtime type. `Unassigned`, `Null`, an empty string, zero and `False` are different states. Conversions and operators can raise at runtime or propagate `Null`; validate the current value/type before arithmetic, date or Boolean use. Avoid storing live object references in scratch variants.

## Process-global safety

`Globals` names are matched case-insensitively. Reading a missing name creates a new `TvxVariable`, so typos silently add process state. The list retains created entries until explicit removal/freeing or process shutdown. Use stable namespaced codes and avoid unbounded dynamic keys.

Never place credentials, tokens, personal data, customer-isolated transaction state or correctness-critical counters in `Globals`. Multiple actions, tenants or concurrent executions in the same process can observe or overwrite a value. `RemoveVariable` and especially `FreeAllVariables` can affect unrelated executions and invalidate retained references.

Neither global form is persisted to the VxData database or synchronised among service processes/servers. Use governed configuration or durable storage for state that must be shared, audited, recovered or made atomic.

<small>Created 2026-07-19</small>
