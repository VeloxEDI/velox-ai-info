---
title: fstTLS13
description: Uses the label TLS v1.3 but currently maps to Indy's TLS 1.2 method, so it does not enable or prove TLS 1.3.
sidebar_position: 84
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls13, tls12, mismatch, security]
---

```Delphi
fstTLS13 = 2
```

### Example

```Delphi
function IsMislabelledTLS13(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstTLS13;
end;
```

### Usage

`fstTLS13` uses the label TLS v1.3 but currently maps to Velox's TLS 1.2 method, so it does not enable or prove TLS 1.3.

### Additional Technical Info
`fstTLS13` is ordinal 2 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md). Its display text is `TLS v1.3`, but `IndySSLTypeArray[fstTLS13]` is `sslvTLSv1_2`. Velox attaches the SSL handler, so the effective configured method is TLS 1.2.

This naming/implementation mismatch is material for security/compliance evidence. Do not claim TLS 1.3 support from the enum, UI or saved configuration. If TLS 1.3 is mandatory, it requires a product/runtime implementation and independent deployed-wire verification. Until then, use [`fstTLS12`](fstTLS12.md) to state the actual current method clearly.

The example only detects the misleading selection and was source-reviewed; no TLS/network/certificate/runtime/image test ran.

**External references**

- [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

<small>Created 2026-07-15</small>
