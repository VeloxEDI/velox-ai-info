---
title: "Modules"
description: "Host-provided action, map, source, destination and connection context available to Velox scripts."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - modules
  - execution-context
---

The Modules variable group exposes the Velox objects that own or surround the current script execution: its action/flow, map, source and destination definitions, plus current database/file connection accessors.

These values are live host objects, not detached data copies. Their availability and concrete type depend on the script context. Scripts may call documented members, but they do not own the objects and must never free them.

## Common tasks

- Use [`Action`](Modules/Action.md) or its exact alias [`Flow`](Modules/Flow.md) to inspect the current action/flow context.
- Use [`Source`](Modules/Source.md) and [`Dest`](Modules/Dest.md) to work with the current data definitions. Either can be a file or database definition at compile/run time.
- Use [`Map`](Modules/Map.md) for the active custom map; it may be unavailable in reusable scriptlet or non-map contexts.
- Use [`DBCon`](Modules/DBCon.md) and [`FileCon`](Modules/FileCon.md) to obtain the current context-supplied connection objects. Both can return nil.

## Availability and ownership

The scripter declares context names during compilation and binds actual object instances before execution. A declaration can therefore exist so a reusable script compiles even when no object is bound for that execution. Check optional references before dereferencing them.

All objects are owned by Velox. Do not call `Free`, retain references beyond the current execution, or assume that an object remains current in a later action/record. Reading the variable/reference is cheap, but methods or properties on the returned module can perform I/O, change state or raise errors according to that class's contract.

## Important aliases and dynamic types

`Action` and `Flow` are two names for exactly the same `TvxActionMan` instance. Mutating state through one is immediately visible through the other.

`Source` and `Dest` are registered as `TvxDBDef` when the actual context object is a database definition and as `TvxFileDef` for a file definition. Generated Code Library declarations show the default file-definition form, so the child pages document both effective declarations.

When no destination is supplied before compilation, Velox sets the destination reference to the source. `Source` and `Dest` can consequently be the exact same object; do not assume independent state or duplicate side effects.

## Accessor values

`DBCon` and `FileCon` appear in this Variables group but are function-backed accessors. `DBCon` re-reads the current source's first database-connection link on every call. `FileCon` returns the file connection explicitly injected into the script item. Neither accessor transfers ownership, and neither guarantees a non-nil result.

Use each child page for exact declarations, binding rules, nil cases and safe examples. Generated navigation is the authoritative list of entries.
