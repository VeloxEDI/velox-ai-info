---
title: AdminEmail
description: Returns or configures the resolved error-recipient text for the current Velox flow.
sidebar_position: 4
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
property AdminEmail: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.AdminEmail;
end;
```

### Usage

`AdminEmail` returns or configures the resolved error-recipient text for the current Velox flow.

**Behaviour**

Reading can therefore produce text different from the stored action field and can change when setup or local tag values change. Writing does not switch the flow away from default-email mode. In the common default mode a script assignment appears not to stick because the setter deliberately clears the custom field and subsequent reads resolve setup again.

The property represents recipient configuration only. Assignment does not send email, validate syntax, test delivery or save the action configuration. Actual notification also depends on log status, send-status configuration, transport/setup and later send handling.

**Important usage notes**

- Tag expansion can produce an empty or malformed address string if required local values are missing.
- Reading may expose address information; avoid copying it into public logs or response bodies unnecessarily.
- A script cannot read or change `UseDefaultEmail` through this class's script interface.
- An empty value does not prove that notifications are disabled, because setup/default selection and downstream handling remain separate.

### Additional Technical Info
`AdminEmail` returns the recipient text selected for error-oriented flow log notifications. Depending on the action's non-script-visible `UseDefaultEmail` configuration, it resolves either the global setup value or the action-specific stored value.

At ordinary runtime, the getter processes Velox tags in the selected text using the current action locals. During component loading/saving it returns the raw stored action field instead.

**Implementation**

When default email is enabled, the getter processes the global setup AdminEmail and the setter clears the action-specific field regardless of the supplied string. When default email is disabled, the getter processes the action-specific field and the setter stores the supplied string.

The flow's status-to-recipient selection uses this value for unset/error log status; other status categories use [`NotifyEmail`](NotifyEmail.md).

**Performance and concurrency**

Tag processing scans the string and current locals. It performs no email delivery. Locals and loaded action configuration are mutable; do not resolve or change this property concurrently on one manager.

**Related entries**

- [`NotifyEmail`](NotifyEmail.md) — recipient text used for non-error status categories.
- [`Locals`](../../../../Variables/Locals/Locals.md) — values used during tag replacement.
- [`TvxActionMan`](../../TvxActionMan.md) — owning flow manager.

<small>Created 2026-07-15</small>
