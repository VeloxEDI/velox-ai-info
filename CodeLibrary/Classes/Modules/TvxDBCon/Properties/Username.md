---
title: Username
description: Reads or changes the database username stored on this Velox connection module.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, database, username, authentication]
---

```Delphi
property Username: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if DBCon <> nil then
    Value := DBCon.Username <> ''
  else
    Value := False;
end;
```

### Usage

Reads or changes the database username stored on this Velox connection module.

**Security, errors and quirks**

- A username is not proof of the authenticated database principal or its permissions.
- Avoid logging/returning infrastructure identities; they can aid reconnaissance even without a password.
- Do not accept arbitrary caller-controlled usernames as a substitute for application-level authorisation.
- Tag resolution can make the effective connection identity differ from stored text.

### Additional Technical Info
`Username` is the stored database authentication identity applied when Velox configures a new connection.

It can be empty or ignored for integrated/Windows authentication; the non-script-visible SQL authentication type determines how the driver uses it.

**Implementation and behaviour**

The property directly accesses the module field. ConnectDatabase processes tags in it with no action-locals list, then passes the result with the decrypted password/auth configuration to driver setup.

Assignment neither authenticates nor changes an existing connected session. It does not validate identity, permissions or save configuration; it affects a later connection after appropriate disconnect/reconnect.

**Performance and concurrency**

Field access is constant-time. Do not mutate authentication configuration while another operation uses the module/connection.

**Related entries**

- [`PasswordEncrypted`](PasswordEncrypted.md) — stored credential ciphertext.
- [`Hostname`](Hostname.md) and [`Database`](Database.md) — target endpoint.
- [`DisconnectDatabase`](../Methods/DisconnectDatabase.md) — closes an existing authenticated session.

<small>Created 2026-07-15</small>
