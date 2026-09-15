---
title: gtPassword
description: Selects Velox's legacy resource-owner-password request, which is prohibited by current OAuth security guidance and has form-encoding defects.
sidebar_position: 144
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, oauth, password-grant, legacy, security]
---

```Delphi
gtPassword = 3
```

### Example

```Delphi
function UsesProhibitedPasswordGrant(Mode: TvxGrantType): Boolean;
begin
  Result := Mode = gtPassword;
end;
```

### Usage

`gtPassword` selects Velox's legacy resource-owner-password request, which is prohibited by current OAuth security guidance and has form-encoding defects.

### Additional Technical Info
`gtPassword` is ordinal 3 of [`TvxGrantType`](../../Types/Enumerations/TvxGrantType.md). It selects Velox's resource-owner-password token routine. RFC 9700 states that this grant must not be used because it exposes the resource owner's credentials to the client, increases credential leakage risk and does not support modern multi-step authentication.

#### Current request construction

Velox posts an `application/x-www-form-urlencoded` body assembled by direct concatenation:

```text
grant_type=password&client_id=<ClientId>&client_secret=<ClientSecret>&Username=<Username>&Password=<Password>&scope=<Scope>
```

There are three material interoperability and security problems:

- RFC 6749 defines lowercase `username` and `password`; Velox sends capitalized `Username` and `Password`.
- No value is percent-encoded at this point. Reserved characters in any credential or scope can split or alter form fields.
- The routine catches any response, parsing or server exception and replaces it with `Unknown error occurred while authenticating`, discarding useful server diagnostics.

Unlike the client-credentials branch, this routine does not first reject empty ClientId or ClientSecret. An empty Secret may already have been replaced with Password during configuration, coupling the client and resource-owner credential inputs.

Do not select this grant for a new or current integration. Migrate the provider/client configuration to an appropriate authorization-code implementation or client credentials, depending on whether access represents a user or the integration itself. If a legacy endpoint temporarily forces this setting, require explicit security acceptance, dedicated least-privilege credentials, verified TLS, secret rotation and a product-level compatibility test outside this documentation programme.

The example intentionally performs only a comparison and was source-reviewed; no OAuth, password, network, credential, runtime or image test ran.

**Related Code Library entries**

- [`gtClientCredentials`](gtClientCredentials.md) - client-only non-interactive grant.
- [`gtAuthCode`](gtAuthCode.md) - current Velox authorization-endpoint branch and its limitations.
- [`gtAuto`](gtAuto.md) - provider-table selection.

**External references**

- [RFC 6749 resource-owner-password grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.3).
- [RFC 9700 prohibition of the password grant](https://www.rfc-editor.org/rfc/rfc9700#section-2.4).

<small>Created 2026-07-15</small>
