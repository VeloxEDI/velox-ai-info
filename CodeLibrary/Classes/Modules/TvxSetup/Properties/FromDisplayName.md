---
title: FromDisplayName
description: Gets or sets the global sender display and organisation name copied by newly created email helpers.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, email, sender-name]
---

```Delphi
property FromDisplayName: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.FromDisplayName
  else
    Value := '';
end;
```

### Usage

`FromDisplayName` gets or sets the global sender display and organisation name copied by newly created email helpers.

### Additional Technical Info
`FromDisplayName` is the process-wide default friendly sender name for email. It defaults to an empty string.

The getter/setter lock Setup for a direct raw-string operation. A newly constructed email helper copies this value and uses it for both the message From name and Organisation. Message-specific code can subsequently supply a different nonblank name.

Changing Setup affects future helper construction only; it does not rewrite a message/helper already created. The property does not validate header characters, encode content, test SMTP policy or save General Setup.

Treat the name as externally visible identity. Prevent header injection/control characters and unauthorised brand impersonation, and keep it consistent with [`FromEmail`](FromEmail.md) and mail-domain policy. A script write changes shared in-memory configuration for unrelated executions.

<small>Created 2026-07-15</small>
