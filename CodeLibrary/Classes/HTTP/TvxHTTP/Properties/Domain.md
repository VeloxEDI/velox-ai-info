---
title: Domain
description: Supplies the Windows domain assigned to the HTTP client's SSPI/NTLM authentication object.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, windows, sspi, ntlm, domain]
---

```Delphi
property Domain: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ClearAuthentication;
  Http.AuthType := fatWindows;
  Http.Domain := 'EXAMPLE';
  Http.Username := 'integration-user';
  Http.Password := '<secret-from-approved-configuration>';
  Value := Http.Domain;
end;
```

### Usage

Supplies the Windows domain assigned to the HTTP client's SSPI/NTLM authentication object.

### Additional Technical Info
`Domain` defaults to an empty string. Velox copies it only when [`AuthType`](AuthType.md) is `fatWindows` and the selected authentication object is Indy's `TIdSSPINTLMAuthentication`. Basic, bearer and all OAuth modes ignore it.

The value is the Windows/NTLM domain portion associated with [`Username`](Username.md) and [`Password`](Password.md). Velox performs no trimming, normalization or local validation. An empty value leaves account interpretation to SSPI and the server; it does not explicitly request or document use of the Velox service account.

Writing the property does not update an already-created SSPI authentication object. Set it before the first request or call [`ClearAuthentication`](../Methods/ClearAuthentication.md) after changing it. This reset retains the string fields but causes the next local authentication setup to create and populate a new object.

Windows authentication can expose credential material or negotiate with an unintended server if destinations and redirects are not tightly controlled. Use an allowlisted intranet endpoint, disable automatic redirects across trust boundaries, grant the account least privilege and never log the password. The reviewed helper's local TLS configuration does not validate server identity.

**External references**

- [Microsoft Negotiate authentication overview](https://learn.microsoft.com/en-us/windows-server/security/windows-authentication/windows-authentication-overview)

<small>Created 2026-07-15</small>
