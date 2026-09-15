---
title: Variables
description: Runtime values, module objects and context exposed to a Velox script.
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - context
---

Variables are names that Velox binds into a script's current execution context. They include module objects, data views, helper objects, configuration snapshots, global and local values, Velox runtime state and processing flags.

## Groups

The visible order reflects how scripts normally find context:

1. **Modules** — configured source, destination and action modules available to the current process.
2. **Config** — values captured from Velox setup when the script compiler registers constants.
3. **Data** — source, destination and dynamically created data objects.
4. **Helpers** — context-owned utility objects such as request, file, mail or JSON helpers.
5. **Globals** and **Locals** — values stored at wider or current execution scope.
6. **Velox** — engine and process state.
7. **Flags** — Boolean or state values that influence processing.

## Important behaviour

Availability is contextual. A name registered for a map action may be absent or `nil` in another script host. Some variables are pointer bindings to live objects; others are constants copied from setup during compilation. Read/write access is determined by the actual registration, not by the group name.

Objects supplied by Velox remain owned by their module, action, map or scripter unless a child page explicitly says otherwise. Do not free a context-owned object. Dataset and field values can be mutable and can affect the record currently being mapped, while configuration constants do not update automatically during an already compiled script.

## Edge cases and quirks

Always distinguish an unavailable object (`nil`) from an available object whose value is empty. Globals, Locals and per-record fields also have different lifetimes and concurrency characteristics. The child page documents the exact binding, lifetime, initial state and assignment effect.

## Related groups

- **Scripting Guide > Datasets** — safe navigation and field access.
- **Classes** — the methods and properties exposed on variable objects.
- **Scripting Guide > Testing values** — `Null`, empty and sentinel checks.
