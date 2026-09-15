---
title: fstNoSSL
description: Disables the SSL/TLS IO handler and permits plaintext transport even though its otherwise-unused mapping-table entry is TLS 1.2.
sidebar_position: 77
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, ssl, plaintext, security, no-ssl]
---

```Delphi
fstNoSSL = 0
```

### Example

```Delphi
procedure ConfigurePlaintext(Client: TvxHTTP);
begin
  Client.SSLClientType := fstNoSSL;
end;
```

### Usage

`fstNoSSL` disables the SSL/TLS IO handler and permits plaintext transport even though its otherwise-unused mapping-table entry is TLS 1.2.

### Additional Technical Info
`fstNoSSL` is ordinal 0 of [`TvxSSLClientType`](../../Types/Enumerations/TvxSSLClientType.md). HTTP sets its method-table value first (TLS 1.2) but then detaches the IO handler; transports similarly attach/configure SSL only when the member is not NoSSL. The effective result is no TLS.

Use it only for an explicitly approved plaintext/local protocol contract. Never send Basic credentials, bearer tokens, OAuth tokens, sensitive payloads or personal/business data over an untrusted network with this selection. A URL beginning `https` does not make this contradictory configuration safe; align URL, port, transport and handler settings.

NoSSL does not mean “skip certificate validation while retaining encryption”; it removes the TLS layer. The example was source-reviewed; no plaintext/TLS/network/runtime/image test ran.

<small>Created 2026-07-15</small>
