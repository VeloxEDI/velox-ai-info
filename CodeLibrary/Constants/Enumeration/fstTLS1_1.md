---
title: fstTLS1_1
description: Retains a legacy underscore name whose direct mapping is TLS 1.2 but whose setup/transport transfer normalization changes it to TLS 1.1.
sidebar_position: 80
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls11, legacy, normalization, inconsistency]
---

```Delphi
fstTLS1_1 = 8
```

### Example

```Delphi
function IsLegacyTLS11Name(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstTLS1_1;
end;
```

### Usage

`fstTLS1_1` retains a legacy underscore name whose direct mapping is TLS 1.2 but whose setup/transport transfer normalization changes it to TLS 1.1.

### Additional Technical Info
`fstTLS1_1` is legacy ordinal 8 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md), displayed only as `old`. Its direct `IndySSLTypeArray` entry is unexpectedly TLS 1.2. However, Setup and Transport transfer/copy code normalizes it to [`fstTLS11`](fstTLS11.md), which maps TLS 1.1.

The effective protocol can therefore depend on whether the value is used directly on a local client or passes through a product transfer path. Do not use it in new scripts/configuration and do not infer protocol from the legacy name. Migrate explicitly to `fstTLS12` for current TLS 1.2 or, only for a documented legacy dependency, `fstTLS11`.

The example only identifies configuration and was source-reviewed; no TLS/transfer/network/runtime/image test ran.

<small>Created 2026-07-15</small>
