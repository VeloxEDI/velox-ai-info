---
title: fatWindows
description: Selects Windows SSPI/NTLM authentication, including the configured domain and normalization of Velox's trailing legacy NTLM member.
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, authentication, windows, sspi, ntlm, domain]
---

```Delphi
fatWindows = 7
```

### Example

```Delphi
procedure ConfigureWindowsAuth(Client: TvxHTTP; const Domain, UserName, Password: String);
begin
  Client.AuthType := fatWindows;
  Client.Domain := Domain;
  Client.Username := UserName;
  Client.Password := Password;
end;
```

### Usage

`fatWindows` selects Windows SSPI/NTLM authentication, including the configured domain and normalization of Velox's trailing legacy NTLM member.

### Additional Technical Info
`fatWindows` is ordinal 7 of [`TvxAuthType`](../../Types/Enumerations/TvxAuthType.md). In HTTP it selects Indy's `TIdSSPINTLMAuthentication`, copies Username/Password and sets Domain on the SSPI/NTLM authentication object. In the mail provider table it selects `TIdSASLNTLM`.

Native Velox also retains a trailing `fatNTLM` member at ordinal 8, labelled old. It is not script-visible. When a transport is copied, native `fatNTLM` is normalized to `fatWindows`, so new scripting/configuration should always use this member. Because the omitted legacy member is trailing, script/native ordinals 0-7 remain aligned.

#### Operational boundaries and quirks

- “Windows” here describes an NTLM/SSPI authentication implementation, not automatic proof that the current service account will be used. The current HTTP callback still assigns the configured Username and Password and optionally Domain.
- Domain requirements depend on the server and account form. Test the exact `Domain`, `DOMAIN\user`/UPN convention and service identity in the deployment environment.
- NTLM is challenge/connection oriented; redirects, proxies, connection reuse and load balancers can affect negotiation. Constrain target hosts and redirects before enabling it.
- Configure TLS separately. Integrated authentication does not make the HTTP payload confidential.
- Proxy authentication supports only None, Basic and Windows in the current selection switch. Other auth enum values are not equivalent proxy choices.
- Do not expose credentials or diagnostic challenge material. Clear client authentication state when changing identity or trust boundary.

The constant only selects the handler; success/failure occurs during the protocol exchange. The example was source-reviewed; no Windows account, domain, proxy, mail, network or image-function test was executed.

**Related Code Library entries**

- [`TvxHTTP.Domain`](../../Classes/HTTP/TvxHTTP/Properties/Domain.md), [`Username`](../../Classes/HTTP/TvxHTTP/Properties/Username.md) and [`Password`](../../Classes/HTTP/TvxHTTP/Properties/Password.md).
- [`fatBasic`](fatBasic.md) and [`fatNone`](fatNone.md) - alternate proxy-supported selections.

**External references**

- [Microsoft NTLM overview](https://learn.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm) - Windows authentication protocol context and security guidance.

<small>Created 2026-07-15</small>
