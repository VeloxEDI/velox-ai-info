---
title: "ExtraData"
description: "Returns the action-owned JSON object reserved as an independent extra-data workspace."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - extra-data
---

```Delphi
function ExtraData: TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  ExtraData.LoadFromString('{"reference":"EXAMPLE"}');
  Value := ExtraData.OptString('reference', '');
end;
```

### Usage

`ExtraData` provides a reusable JSON object for additional data needed during the current action. It starts empty on first use, and changes remain visible to later scripts in the same action.

It is separate from `Json` and `Json2`. Use it when extra JSON must be retained without changing those workspaces. Clear or replace its members before reusing it for an unrelated purpose. Reading `ExtraData` does not parse input, copy Velox data, save output or require any particular member names.

### Additional Technical Info
`ExtraData` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TJSONObject` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Initialise or erase the object before assuming its content. Do not free it or retain child/value pointers after the action. Validate size, depth, types and required members before using untrusted JSON, and avoid placing secrets in logs.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TJSONObject`](../../Classes/JSON/TJSONObject.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) defines JSON syntax and interoperability constraints.

<small>Created 2026-07-15</small>
