---
title: SMTPServer
description: Gets or sets the global SMTP host copied when a new non-relay Velox email helper is constructed.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, smtp, email-server]
---

```Delphi
property SMTPServer: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.SMTPServer
  else
    Value := '';
end;
```

### Usage

`SMTPServer` gets or sets the global SMTP host copied when a new non-relay Velox email helper is constructed.

### Additional Technical Info
`SMTPServer` is the raw SMTP host name/address in General Setup. It defaults to an empty string.

The locked getter/setter only read/write the field. When a new email helper is created in configured-server mode (`SMTPRelay = False`), it copies SMTPServer into the SMTP client's Host along with separate setup port, credentials, authentication and TLS settings.

When direct SMTP relay mode is enabled, the helper constructs the relay component instead and does not use this host for that message path. Changing SMTPServer does not switch relay mode or update an existing helper.

No trimming, DNS resolution, port parsing, connection attempt, TLS validation, credential check or setup save occurs. Supply a host only—not a URL or `host:port` pair—and configure the separately governed SMTP fields consistently.

A script can redirect future outbound mail to another server for the whole process. Treat assignment as a privileged security change; do not accept an untrusted host and do not infer success until an authorised end-to-end mail test is performed outside this documentation workflow.

<small>Created 2026-07-15</small>
