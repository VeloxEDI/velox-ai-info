---
title: fstSSL3
description: Selects Indy's obsolete SSL 3.0 method and must not be used for new or security-sensitive integrations.
sidebar_position: 78
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, ssl3, obsolete, insecure, protocol]
---

```Delphi
fstSSL3 = 6
```

### Example

```Delphi
function IsObsoleteSSL(const Value: TvxSSLClientType): Boolean;
begin
  Result := Value = fstSSL3;
end;
```

### Usage

`fstSSL3` selects Velox's obsolete SSL 3.0 method and must not be used for new or security-sensitive integrations.

### Additional Technical Info
`fstSSL3` is ordinal 6 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md) and maps directly to `sslvSSLv3`. For non-NoSSL selections Velox attaches the SSL IO handler, so this requests the obsolete SSL 3.0 protocol.

Do not use it for new connections or weaken a peer to accommodate it. Migrate/replace the endpoint or place an explicitly governed modern-security gateway in front of an unavoidable legacy system. Availability in the enum does not imply the runtime library/server will permit SSL 3.0.

The example only detects legacy configuration and was source-reviewed; no SSL/network/certificate/runtime/image test ran.

**External references**

- [RFC 7568: Deprecating SSLv3](https://www.rfc-editor.org/rfc/rfc7568) - prohibition and migration context.

<small>Created 2026-07-15</small>
