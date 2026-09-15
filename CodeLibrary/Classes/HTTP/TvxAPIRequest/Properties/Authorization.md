---
title: Authorization
description: Returns the first raw Authorization request-header value without validating credentials or authenticating the caller.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, authorization, credentials, security]
---

```Delphi
property Authorization: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Report only presence; never copy the credential into logs or output. }
  Value := (Request <> nil) and (Request.Authorization <> '');
end;
```

### Usage

Returns the first raw Authorisation request-header value without validating credentials or authenticating the caller.

### Additional Technical Info
`Authorization` performs a case-insensitive Indy raw-header lookup for `Authorization` and returns the first matching value. The result normally contains an authentication scheme followed by credentials, token or signed parameters. Velox does not parse, verify, redact or copy it into an authenticated-principal object.

A nonempty value proves only that text arrived through this header mapping. It does **not** prove that the scheme is supported, the credential is valid, the caller is authorised, transport security was used or an intermediary did not replace the field. Authentication and authorisation must be enforced by the endpoint's approved security boundary before privileged flow behavior is selected.

The value is a secret. Do not log it, include it in exception messages, write it into transaction data, return it to the caller or compare bearer tokens with casual string logic. Prefer a configured authentication component that validates scheme-specific syntax, issuer/audience/signature/expiry or password credentials and produces a trusted identity/claims result. Apply constant-time comparison where a locally held secret is deliberately compared.

Empty can mean absent or unavailable. Multiple physical fields are not combined by this getter. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`; the returned request and string source exist only for the current synchronous API execution.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Authorization`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Authorization)
- [RFC 9110 section 11.6.2: Authorization](https://www.rfc-editor.org/rfc/rfc9110#section-11.6.2)

<small>Created 2026-07-15</small>
