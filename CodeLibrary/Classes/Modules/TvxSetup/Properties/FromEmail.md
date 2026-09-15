---
title: FromEmail
description: Gets or sets the global sender address copied into newly created Velox email helpers.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, email, sender-address]
---

```Delphi
property FromEmail: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.FromEmail
  else
    Value := '';
end;
```

### Usage

`FromEmail` gets or sets the global sender address copied into newly created Velox email helpers.

### Additional Technical Info
`FromEmail` is the process-wide default sender address. It defaults to an empty string.

The locked getter/setter store raw text only. A new email helper copies this address during construction; a later message-specific nonblank sender can override its copied value. Existing helpers/messages retain their earlier snapshot after Setup changes.

The property performs no email syntax/domain validation, authentication, SPF/DKIM/DMARC check, SMTP connection or send. A successful assignment does not mean the configured SMTP server permits that identity.

Sender identity is security-sensitive. Prevent control characters/header injection and unauthorised spoofing, and coordinate it with [`FromDisplayName`](FromDisplayName.md) and mail infrastructure. Script writes are process-global, immediate in memory and not automatically saved.

<small>Created 2026-07-15</small>
