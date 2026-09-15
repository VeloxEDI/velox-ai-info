---
title: "Json"
description: "Returns the first action-owned JSON object workspace shared across scripts."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - json
---

```Delphi
function Json: TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Json.LoadFromString('{"status":"ready"}');
  Value := Json.OptString('status', '');
end;
```

### Usage

`Json` provides the first reusable JSON object workspace for the current action. Use its load, member, combine and delete operations to build or inspect an object tree. Changes remain visible to later scripts in the same action.

`Json` is separate from `Json2`, `ExtraData`, `JsonArray` and `JsonArray2`; Velox does not copy or synchronise them. Clear or reload it before using it for unrelated data. Reading `Json` does not automatically parse map input or create output.

### Additional Technical Info
`Json` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TJSONObject` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Erase or load known content before reuse, use typed optional accessors for optional members and distinguish missing, null, empty and type-mismatched values. Do not free the object or retain member pointers after the action. Bound untrusted JSON size/depth and avoid logging secrets.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TJSONObject`](../../Classes/JSON/TJSONObject.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259) defines the interchange syntax; the Velox class page defines the exposed API.

<small>Created 2026-07-15</small>
