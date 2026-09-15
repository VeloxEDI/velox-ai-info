---
title: "GetBasicAuthUser"
description: "Extracts the user-name portion from a Basic-authentication credential value without validating it."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - basic-authentication
  - base64
  - username
---

```Delphi
function GetBasicAuthUser( const aAuth : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetBasicAuthUser('Basic ZGVtbzpleGFtcGxl');  // demo
end;
```

### Usage

`GetBasicAuthUser` extracts the user-name portion from a Basic-authentication credential value without validating it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aAuth` | `string`, `const` | Either a complete value beginning with `Basic ` or raw Base64 credential text. |

**Returns**

The decoded text before the first `:`. If the decoded text contains no colon, the complete decoded text is returned. Empty or undecodable-to-content input can return an empty string.

**Behaviour**

- The scheme name is case-insensitive, so `basic ` and `BASIC ` are recognised.
- Exactly one space is part of the tested prefix. Extra leading whitespace prevents prefix removal, while extra spaces after that first space become part of the Base64 input.
- Only the user-name portion is returned. The password and delimiter are discarded.
- A colon inside the password has no effect because the first colon ends the user-name portion.

**Errors**

The permissive Base64 path does not consistently reject malformed input. Allocation and decoding/conversion exceptions propagate to the script.

**Usage notes**

Use this only after the surrounding HTTP or integration layer has established an appropriate trust and authentication policy. Do not log the original `Authorization` value: it contains a reversibly encoded password.

### Additional Technical Info
`GetBasicAuthUser` decodes a Basic-authentication credential value and returns the text before the first colon. It is a parsing convenience only: it does not authenticate the user, verify the password, validate the header or authorise a request.

The fictional example decodes `demo:example`. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox tests the beginning of `aAuth` with Delphi's case-insensitive `StartsText('Basic ', aAuth)`. When it matches, the first six characters are removed; otherwise the complete input is treated as Base64. The remainder is passed to [`Base64Decode`](Base64Decode.md), which decodes bytes as UTF-8. Finally, the shared `GetStringHead` helper returns everything before the first colon, or all decoded text when no colon exists.

**Edge cases and quirks**

- A value without `Basic ` is still decoded as raw Base64; the function does not reject an unknown or missing authentication scheme.
- If the decoded credential contains no colon, it is returned in full rather than rejected as malformed.
- The underlying installed Base64 decoder skips whitespace and invalid characters, accepts short fragments and does not translate URL-safe `-`/`_`. Malformed text may therefore produce a partial or surprising user name.
- The decoded bytes are interpreted as UTF-8. The helper does not implement a separate Basic-authentication charset negotiation policy.
- Empty user names, control characters and embedded whitespace are not rejected or normalised.
- Calling this helper says nothing about whether a request was authenticated, whether a password was correct or whether the returned identity is authorised.

**Side effects**

None beyond temporary allocation. It does not contact an identity provider or modify authentication state.

**Performance and concurrency**

Work and allocation are proportional to the input length. The invoked Base64 wrapper creates a fresh decoder and uses no Velox shared mutable state.

**Related entries**

- [`Base64Decode`](Base64Decode.md) supplies the permissive UTF-8 decoding behaviour.
- [`Base64DecodeBytes`](Base64DecodeBytes.md) returns raw bytes when text interpretation is inappropriate.

**External references**

- [Embarcadero DocWiki: `TNetEncoding.Decode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NetEncoding.TNetEncoding.Decode) - the Delphi core decoding family reached through `Base64Decode`.
- [Free Pascal: `DecodeStringBase64`](https://www.freepascal.org/docs-html/fcl/base64/decodestringbase64.html) - compatibility context for the Base64 step; Velox uses Delphi's implementation.

<small>Created 2026-07-15</small>
