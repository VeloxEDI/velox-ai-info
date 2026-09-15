---
title: fstTLS12
description: Selects Indy's TLS 1.2 method and is the clear current member for an explicit TLS 1.2 Velox client configuration.
sidebar_position: 83
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls12, protocol, security, current]
---

```Delphi
fstTLS12 = 3
```

### Example

```Delphi
procedure ConfigureTLS12(Client: TvxHTTP);
begin
  Client.SSLClientType := fstTLS12;
end;
```

### Usage

`fstTLS12` selects Velox's TLS 1.2 method and is the clear current member for an explicit TLS 1.2 Velox client configuration.

### Additional Technical Info
`fstTLS12` is ordinal 3 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md) and maps directly to `sslvTLSv1_2`. It is also the normalization target for legacy [`fstTLS1_2`](fstTLS1_2.md). Unlike Auto/TLS13, its name matches the current mapping.

Use it when the integration contract explicitly requires TLS 1.2. It does not enable TLS 1.3 and does not by itself prove certificate-chain/hostname verification, trusted roots, acceptable ciphers or runtime library patch level. Review peer-verification settings and validate the deployed wire connection during the later test-bed stream.

The example only configures the member and was source-reviewed; no TLS/network/certificate/runtime/image test ran.

**External references**

- [RFC 5246: TLS 1.2](https://www.rfc-editor.org/rfc/rfc5246).

<small>Created 2026-07-15</small>
