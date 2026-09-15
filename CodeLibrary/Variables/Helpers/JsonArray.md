---
title: "JsonArray"
description: "Returns the first action-owned JSON array workspace shared across scripts."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - json-array
---

```Delphi
function JsonArray: TJSONArray;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  JsonArray.Erase;
  JsonArray.AddString('Example');
  Value := JsonArray.Count;
end;
```

### Usage

`JsonArray` provides the first reusable JSON array workspace for the current action. Use its add, load, combine and delete operations to build or inspect an array. Changes and item indexes remain visible to later scripts in the same action.

It is separate from `JsonArray2` and the JSON object workspaces. Clear or reload it before using it for unrelated data. Reading `JsonArray` does not bind map records or serialise output automatically.

### Additional Technical Info
`JsonArray` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TJSONArray` |
| Ownership | Action-owned and shared across the action's scripts |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Erase or load known state before appending, validate item types before casts, and remember that deletion changes later indexes. Do not free the array or retain item pointers after the action. Bound untrusted item counts, nesting and string sizes.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TJSONArray`](../../Classes/JSON/TJSONArray.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259) defines array syntax and interoperability constraints.

<small>Created 2026-07-15</small>
