---
title: "GetUserNameExString"
description: "Returns the current Windows execution identity in SAM-compatible domain-backslash-user form."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - windows-user
  - sam
---

```Delphi
Function GetUserNameExString : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUserNameExString;
end;
```

### Usage

`GetUserNameExString` returns the current Windows execution identity in SAM-compatible domain-backslash-user form.

### Additional Technical Info
`GetUserNameExString` returns the Windows account currently executing the Velox process in `NameSamCompatible` form, commonly `DOMAIN\User`.

The product allocates a fixed 1,024-character API buffer and calls `GetUserNameEx` every time. On success the string is resized to Windows' reported character count. On failure Velox calls its `RaiseLastOSError('Unable to get user name')`, raising `EvxOSError` with the last Windows error code/message (or a generic message when the OS supplies code zero).

This is the process/thread security context seen by the API. In Designer it is normally the interactive user; in VeloxService or VeloxAPIService it is normally the configured service account. Impersonation, service configuration and domain availability can affect the result.

The name is useful for auditing and diagnostics, but a string comparison is not an authorization check. Do not use it as the sole control for privileged operations, and do not assume it is a UPN/email address. Errors propagate unless the script handles them.

**Official reference**

- [Microsoft: GetUserNameExW](https://learn.microsoft.com/en-us/windows/win32/api/secext/nf-secext-getusernameexw)

<small>Created 2026-07-19</small>
