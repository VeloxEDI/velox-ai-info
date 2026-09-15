---
title: "Helpers"
description: "Live helper objects for reusable text, structured data, files, hashing, HTTP, mail and API execution context."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - tools
---

Helper variables are no-argument functions that return live objects exposed to Velox scripts. Call them by name as shown in each declaration, then use the returned object's documented properties and methods. They are conveniences, not isolated values: ownership and sharing determine how long mutations remain visible.

## Choose by purpose

- `Text` and `List` provide separate scripter-local `TStringList` workspaces in the current implementation.
- `Sql` provides an action-shared string list for assembling SQL text; it never executes SQL by itself.
- `Json`, `Json2`, `JsonArray`, `JsonArray2` and `ExtraData` provide independent structured-data workspaces owned by the action.
- `Hash` exposes the action-shared hashing helper.
- `Files` exposes scripter-local file search/copy/move state.
- `XML` exposes one scripter-local XML document.
- `Http` exposes a stateful HTTP client, either created for the scripter or injected by an HTTP transport.
- `Email`, `Request` and `Response` expose the current execution context and can return `nil` when that context was not supplied.

## Ownership and lifetime

| Lifetime | Helpers | Consequence |
|---|---|---|
| Action-owned and shared across map scripts | `ExtraData`, `Hash`, `Json`, `Json2`, `JsonArray`, `JsonArray2`, `Sql` | Mutations are visible to later scripts using the same action. Do not free the object. |
| Scripter-owned | `Files`, `List`, `Text`, `XML`; normally `Http` | The object is created lazily and freed with that scripter. It is not a cross-action cache. |
| Externally assigned execution context | `Email`, `Request`, `Response`; injected `Http` | The helper does not own the object. It can be absent or replaced between executions; never retain or free it. |

All helpers are mutable and not safe for concurrent, asynchronous use. Clear or initialise a workspace before relying on its content. Avoid retaining returned references after the script/action that owns them.

## Important implementation details

The product source contains comments saying `Text` and `List` are the same object, but the executable getters allocate distinct fields (`FTEXT` and `FList`). Treat them as independent workspaces. Conversely, the two JSON objects and two JSON arrays are intentionally independent but are each shared across scripts through the action.

`Http` retains request configuration and response state. In custom HTTP response processing, Velox injects the transport's existing client and the scripter deliberately does not free it. A script can therefore affect the surrounding transport if it changes headers, authentication, URL, request body or other state.

`Sql` is only a text buffer. `Post`, `Execute`, database transactions and parameterisation belong to the separate function that consumes the text. Never treat construction of a SQL string as execution or safety validation.

## Security boundaries

These helpers do not authorise URLs, files, recipients, SQL, API callers or data. Validate untrusted paths and URLs, use parameterised database functions where supported, restrict outbound destinations, avoid logging secrets or message bodies, and minimise personal or commercially sensitive data. Check `Email`, `Request` and `Response` for `nil` before dereferencing them.

Each child page documents the exact declaration, lazy getter, sharing/ownership rule, reset behaviour, side effects and related class reference.

<small>Created 2026-07-19</small>
