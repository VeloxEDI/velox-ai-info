---
title: gtAuto
description: Resolves an OAuth grant from Velox's local provider table and otherwise falls through to the client-credentials routine.
sidebar_position: 142
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, oauth, automatic, provider, fallback]
---

```Delphi
gtAuto = 0
```

### Example

```Delphi
procedure UseProviderGrantDefault(Client: TvxHTTP);
begin
  Client.GrantType := gtAuto;
end;
```

### Usage

`gtAuto` resolves an OAuth grant from Velox's local provider table and otherwise falls through to the client-credentials routine.

### Additional Technical Info
`gtAuto` is ordinal 0 of [`TvxGrantType`](../../Types/Enumerations/TvxGrantType.md) and is the default `TvxHTTP.GrantType` value. It means “use Velox's configured provider default”; it is not OAuth server discovery or negotiation.

During authenticator configuration, Velox replaces Auto with the selected authentication provider's `SASLProviders` grant value. The current table resolves None, Basic, Microsoft OAuth, Google OAuth, NetSuite OAuth, Windows and legacy NTLM entries to [`gtClientCredentials`](gtClientCredentials.md). Bearer and Custom OAuth retain `gtAuto`. Some of those authentication types are not OAuth providers; the table value is still what controls this local substitution when the authenticator is configured.

#### Unresolved Auto behavior

If the table leaves the value as Auto, `Authorize` reaches its final branch and calls the client-credentials routine. That routine checks ClientId and ClientSecret but does not reject the request merely because the stored grant value is still Auto. The request body nevertheless contains `grant_type=client_credentials`.

This fallback can succeed for a suitably configured custom token endpoint, but it is implicit behavior rather than provider discovery. It can also fail because the endpoint, client authentication method, scope or supplied credentials do not match client credentials. For repeatable configuration, select an explicit grant and verify the provider's documented token contract.

#### Credential and token lifecycle

An empty explicit Secret is replaced with Password during authenticator configuration. Configuration also clears the existing refresh token, so a token can be refreshed only while the same configured authenticator instance retains it; reconfiguration discards it. These behaviors apply regardless of the original Auto selection.

The example only selects metadata and was source-reviewed; no OAuth, network, credential, runtime or image test ran.

**Related Code Library entries**

- [`gtClientCredentials`](gtClientCredentials.md) - the current unresolved-Auto fallback.
- [`gtAuthCode`](gtAuthCode.md) - direct authorization-endpoint branch and limitations.
- [`gtPassword`](gtPassword.md) - prohibited legacy resource-owner-password branch.
- [`TvxHTTP.GrantType`](../../Classes/HTTP/TvxHTTP/Properties/GrantType.md) - defaulted HTTP property.

**External references**

- [RFC 6749 OAuth grant model](https://www.rfc-editor.org/rfc/rfc6749#section-1.3).

<small>Created 2026-07-15</small>
