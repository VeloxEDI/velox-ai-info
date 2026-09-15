---
title: "Email"
description: "Returns the most recently assigned inbound or processing-context email message, or nil when no message is available."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - email
---

```Delphi
function Email: TIdMessage;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Email <> nil then
    Value := Email.Subject
  else
    Value := '';
end;
```

### Usage

`Email` returns the current inbound or processing-context email message, or `nil` when the script is not running with an email message. Check for `nil` before using it.

Use the returned message to read or change its subject, address lists, body, headers, attachments and message parts. It represents the live message for the current action; changing it affects later email-processing steps. Reading `Email` does not create, send or save a message.

### Additional Technical Info
`Email` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TIdMessage` |
| Ownership | Execution context (not owned by the scripter) |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Always test for `nil`. Velox does not own the message through this helper and the script must not free it or retain it after execution. Treat addresses, body, headers and attachments as untrusted and potentially sensitive; do not assume sender identity is authenticated from header fields.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TIdMessage`](../../Classes/Mail/TIdMessage.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- `TIdMessage` is an Indy type rather than a Delphi RTL function. Use the source-backed Velox class link above as the exposed scripting contract.

<small>Created 2026-07-15</small>
