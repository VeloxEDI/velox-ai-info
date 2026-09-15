---
title: fstTLS11
description: Selects Indy's TLS 1.1 method, which is deprecated and should remain only for an explicitly governed legacy peer.
sidebar_position: 82
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls11, deprecated, legacy, security]
---

```Delphi
fstTLS11 = 4
```

### Example

```Delphi
function UsesDeprecatedTLS11(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstTLS11;
end;
```

### Usage

`fstTLS11` selects Velox's TLS 1.1 method, which is deprecated and should remain only for an explicitly governed legacy peer.

### Additional Technical Info
`fstTLS11` is ordinal 4 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md) and maps directly to `sslvTLSv1_1`. Legacy `fstTLS1_1` is normalized to this member in Setup/Transport transfer paths, despite that legacy member's direct array entry being TLS 1.2.

TLS 1.1 is deprecated. Do not select it for new work; record the peer/deadline/compensating controls where temporarily unavoidable and migrate to TLS 1.2 or a separately implemented/verified newer protocol.

The example only detects legacy configuration and was source-reviewed; no TLS/network/certificate/runtime/image test ran.

**External references**

- [RFC 8996: Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/rfc/rfc8996).

<small>Created 2026-07-15</small>
