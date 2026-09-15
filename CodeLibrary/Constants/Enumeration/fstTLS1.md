---
title: fstTLS1
description: Selects Indy's deprecated TLS 1.0 method and remains only for legacy compatibility.
sidebar_position: 79
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls1, tls10, deprecated, security]
---

```Delphi
fstTLS1 = 5
```

### Example

```Delphi
function UsesDeprecatedTLS10(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstTLS1;
end;
```

### Usage

`fstTLS1` selects Velox's deprecated TLS 1.0 method and remains only for legacy compatibility.

### Additional Technical Info
`fstTLS1` is ordinal 5 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md) and maps to `sslvTLSv1` (TLS 1.0). It is not a generic “TLS enabled” selector.

TLS 1.0 is deprecated and must not be chosen for new integrations. Treat an existing use as migration debt, identify the legacy peer and move to [`fstTLS12`](fstTLS12.md) or a separately verified modern protocol path. Runtime/server rejection is possible even though the enum exists.

The example only detects legacy configuration and was source-reviewed; no TLS/network/certificate/runtime/image test ran.

**External references**

- [RFC 8996: Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/rfc/rfc8996).

<small>Created 2026-07-15</small>
