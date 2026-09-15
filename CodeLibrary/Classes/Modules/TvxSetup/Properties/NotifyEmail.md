---
title: NotifyEmail
description: Gets or sets the global non-error notification recipient default resolved by actions that use setup email addresses.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, email, notification-recipient]
---

```Delphi
property NotifyEmail: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.NotifyEmail
  else
    Value := '';
end;
```

### Usage

`NotifyEmail` gets or sets the global non-error notification recipient default resolved by actions that use setup email addresses.

### Additional Technical Info
`NotifyEmail` is the global default recipient text for non-error action notifications. It defaults to an empty string.

The getter/setter lock Setup around a raw field operation. They do not validate recipients, send email or persist the setup module.

When an action uses default email addresses, it reads Setup.NotifyEmail and expands action/local tags. Manager and transport completion logic selects the captured notification address for successful, warning, issue, duplicate or cancelled status; error/not-set outcomes use the administrative address instead.

This property is not the general default recipient copied by a new low-level email helper—that construction fallback uses [`AdminEmail`](AdminEmail.md). NotifyEmail takes effect through the action/manager notification path.

Tags can dynamically redirect messages and disclose operational data. Validate the expanded address/list syntax and restrict untrusted values. A direct assignment changes shared in-memory setup for later lookups but does not update already-captured recipients or prove delivery.

<small>Created 2026-07-15</small>
