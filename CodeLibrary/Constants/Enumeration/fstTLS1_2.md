---
title: fstTLS1_2
description: Retains a legacy underscore TLS 1.2 alias that maps TLS 1.2 and is normalized to the current fstTLS12 member during transfer.
sidebar_position: 81
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls12, legacy, normalization, alias]
---

```Delphi
fstTLS1_2 = 7
```

### Example

```Delphi
function IsLegacyTLS12Name(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstTLS1_2;
end;
```

### Usage

`fstTLS1_2` retains a legacy underscore TLS 1.2 alias that maps TLS 1.2 and is normalised to the current fstTLS12 member during transfer.

### Additional Technical Info
`fstTLS1_2` is legacy ordinal 7 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md), displayed as `old`. It maps to TLS 1.2 and Setup/Transport transfer code normalizes it to [`fstTLS12`](fstTLS12.md), which has the same current mapping.

Use `fstTLS12` for all new configuration so names, UI and stored values are clear. Normalization means the legacy ordinal need not round-trip even though protocol behavior remains TLS 1.2. This member still proves only the selected method, not certificate/hostname/cipher correctness.

The example only identifies legacy configuration and was source-reviewed; no TLS/transfer/network/runtime/image test ran.

<small>Created 2026-07-15</small>
