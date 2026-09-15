---
title: NotifyEmail
description: Returns or configures the resolved non-error notification-recipient text for the current flow.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - email
---

```Delphi
property NotifyEmail: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.NotifyEmail;
end;
```

### Usage

`NotifyEmail` returns or configures the resolved non-error notification-recipient text for the current flow.

**Behaviour**

The resolved result can vary with setup and local values. Assignment does not switch default mode, send a notification, validate recipients or persist the module. In default mode, a write intentionally appears ineffective because the custom field is cleared and the next read resolves setup again.

Actual delivery depends on configured send-status categories and later mail/log handling. The fact that the current status category selects this property does not guarantee that any message will be sent or accepted.

**Important usage notes**

- GET/POST or business success semantics are not inferred from this recipient property.
- Tag expansion can yield empty/malformed text when local values are missing.
- Recipient text can be sensitive operational information; do not echo it to external callers.
- An empty string is not by itself a complete notification-disable policy.

### Additional Technical Info
`NotifyEmail` returns recipient text used for OK, warning, issue, duplicate and cancelled log-status categories. It resolves either global setup or action-specific text according to the flow's non-script-visible `UseDefaultEmail` setting.

At runtime the getter processes Velox tags with current action locals. During component loading/saving it exposes the raw action field.

**Implementation**

When default email is enabled, the getter processes the global setup NotifyEmail and the setter clears the action-specific field regardless of the supplied value. When default email is disabled, it processes/stores the action-specific field. Error/unset status uses [`AdminEmail`](AdminEmail.md) instead.

**Performance and concurrency**

Reading performs string/tag processing only; it does not deliver mail. The action and locals are mutable and not intended for concurrent property mutation.

**Related entries**

- [`AdminEmail`](AdminEmail.md) — error/unset recipient resolution.
- [`Locals`](../../../../Variables/Locals/Locals.md) — tag-value source.
- [`TvxActionMan`](../../TvxActionMan.md) — owning flow manager.

<small>Created 2026-07-15</small>
