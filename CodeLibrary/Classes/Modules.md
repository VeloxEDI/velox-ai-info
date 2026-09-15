---
title: Modules
description: Velox-owned configuration and execution objects exposed to scripts as live module instances.
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - execution-context
---

Module classes represent configured Velox objects such as the current action, flow, map, data definition, connection, setup and logging context. Use this group when a variable or another class returns a Velox module instance and you need the exact script-visible members of that object.

## Common tasks

- Start with [`TvxActionMan`](Modules/TvxActionMan.md) for the current action or flow and its configured steps.
- Use [`TvxActionItem`](Modules/TvxActionItem.md) for a step returned by an action manager.
- Use `TvxDBDef`, `TvxFileDef`, `TvxDBCon` and `TvxFileCon` for configured data definitions and connections.
- Use [`Variables > Modules`](../Variables/Modules.md) to determine which live module objects the current script context supplies.

## Important behaviour

These are live mutable objects, not detached descriptions of Velox configuration. A read can reflect current execution state, and a write or method call can affect the current action, later steps, logging, I/O or persisted data according to the individual member contract.

Velox normally constructs, loads and owns module instances. A script-visible class name does not prove that its constructor is registered. Unless a class page explicitly documents caller ownership, obtain the object from the current context or another documented property, do not call `Free`, and do not retain it beyond the owning execution.

## Availability and lifetime

The compiler can know a class even when the current execution has no corresponding instance. Check optional context values before dereferencing them. An object can also be valid but hold design-time, default or partially loaded state; a non-nil reference alone does not prove that a configured production action is running.

Object state may survive multiple script events or executions while the owning module remains loaded. A property assignment is not automatically a durable configuration save. Reloading or rebuilding the module can replace the object and invalidate a retained reference.

## Edge cases and quirks

Only members registered with the scripting runtime are callable. Other native public or published members are deliberately absent from these pages and cannot be assumed available.

Inherited members are documented at the class that declares them. Some shared implementation ancestors are hidden from public navigation, so a descendant can expose inherited behaviour without a visible public ancestor page. Member pages remain the authority for read/write access, ownership, side effects, errors and concurrency.

## Related groups

- [`Variables > Modules`](../Variables/Modules.md) — host-provided ways to obtain the current live modules.
- [`Data`](Data.md) — datasets, views and fields operated on by module objects.
