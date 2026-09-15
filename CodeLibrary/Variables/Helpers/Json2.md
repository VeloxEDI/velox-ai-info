---
title: "Json2"
description: "Returns the second independent action-owned JSON object workspace shared across scripts."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - json2
---

```Delphi
function Json2: TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Json2.LoadFromString('{"status":"comparison"}');
  Value := Json2.OptString('status', '');
end;
```

### Usage

`Json2` provides a second reusable JSON object workspace for the current action. Use it when two object trees must coexist, such as source and destination data or current and comparison data. Velox does not assign those meanings automatically.

It is separate from `Json` and `ExtraData`. Changes remain visible to later scripts in the same action, so clear or reload it before using it for unrelated data. Reading `Json2` does not automatically parse input, compare objects or create output.

### Additional Technical Info
`Json2` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TJSONObject` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Independence is by object identity, not automatic cloning. Loading `Json2` does not snapshot `Json`. Initialise it explicitly, do not free it, bound untrusted JSON and avoid retaining child/value pointers beyond the action.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TJSONObject`](../../Classes/JSON/TJSONObject.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259) defines the interchange syntax; the Velox class page defines the exposed API.

<small>Created 2026-07-15</small>
