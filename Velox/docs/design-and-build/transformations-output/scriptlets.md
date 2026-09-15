---
title: "Configure Scriptlets"
description: "Create reusable PascalScript includes, understand cache invalidation and govern dependencies across Velox modules."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Scriptlet, PascalScript include, cache, _Common]
---

A Scriptlet stores reusable PascalScript text for inclusion by Maps, Transports, custom scripts and other script-aware modules. Velox creates a default `_Common` Scriptlet when required and missing; treat it as shared platform configuration.

| Property | Default | Effect |
| --- | --- | --- |
| **Scriptlet name** | New Scriptlet | Module identity used for selection/include relations. |
| **Script** | Empty | Persisted PascalScript text. Runtime readers use a thread-safe `ScriptText` accessor. |
| **Last position** | `1` | Editor cursor/position state; it does not affect script semantics. |

Saving or deleting invalidates/rebuilds the global Scriptlet cache and saves include/Variable Group relations discovered from script use. Running executions may already hold loaded state, so save, reopen/compile every caller and apply the documented runtime refresh/restart boundary.

## Procedure

1. Define the Scriptlet's inputs, outputs, failure behaviour and supported callers.
2. Keep the code small and deterministic; do not store secrets in source.
3. Save and compile it in each consuming event/context because available objects differ.
4. Use **Check Usage** and test every dependent module before changing shared signatures or behaviour.
5. Reject direct or indirect include cycles and ambiguous global state.

Use the installed [Code Library](../scripting-code-library/code-library.md) for exact functions. See [variables](variables.md) and [scripting concepts](../scripting-code-library/scripting-concepts.md).
