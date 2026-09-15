---
title: fstAuto
description: Uses the UI label Auto but currently selects Indy's TLS 1.2 method only rather than negotiating a configured protocol range.
sidebar_position: 76
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, ssl, auto, protocol, security]
---

```Delphi
fstAuto = 1
```

### Example

```Delphi
procedure ConfigureCurrentDefault(Client: TvxHTTP);
begin
  Client.SSLClientType := fstAuto;
end;
```

### Usage

`fstAuto` uses the UI label Auto but currently selects Velox's TLS 1.2 method only rather than negotiating a configured protocol range.

### Additional Technical Info
`fstAuto` is ordinal 1 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md). It is the default for new HTTP, transport and setup objects, but `IndySSLTypeArray[fstAuto]` is exactly `sslvTLSv1_2`. Current code attaches the SSL IO handler and configures a single TLS 1.2 method.

Do not interpret “Auto” as enabling TLS 1.3, selecting the strongest mutually supported version, or maintaining a minimum/maximum protocol range. For auditable configuration, prefer explicit [`fstTLS12`](fstTLS12.md) because it describes the same current mapping without the misleading label.

Protocol mapping alone does not prove CA trust, hostname verification, peer-certificate requirements, cipher policy or OpenSSL/Indy availability. Validate those settings and the observed connection separately. The example was source-reviewed; no TLS/network/certificate/runtime/image test ran.

**External references**

- [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) - contrasts the protocol this member does not currently select.

<small>Created 2026-07-15</small>
