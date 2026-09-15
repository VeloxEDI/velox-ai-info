---
title: fttNoTLSSupport
description: Disables the protocol TLS mode and permits an unencrypted SMTP, FTP, POP3 or IMAP connection.
sidebar_position: 131
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, plaintext, transport, security]
---

```Delphi
fttNoTLSSupport = 0
```

### Example

```Delphi
function AllowsPlaintext(Mode: TvxTLSType): Boolean;
begin
  Result := Mode = fttNoTLSSupport;
end;
```

### Usage

`fttNoTLSSupport` disables the protocol TLS mode and permits an unencrypted SMTP, FTP, POP3 or IMAP connection.

### Additional Technical Info
`fttNoTLSSupport` is ordinal 0 of [`TvxTLSType`](../../Types/Enumerations/TvxTLSType.md). Velox maps it to Indy `utNoTLSSupport`; POP3/IMAP initialise to no TLS before applying configured mode, and email treats it as `TLS = False`.

No implicit handshake or explicit STARTTLS-style upgrade is requested. Credentials and message/file content can therefore cross the network in plaintext unless another independently configured tunnel protects the connection. Use only for a deliberately trusted/local legacy endpoint with an approved compensating control.

This member is separate from [`fstNoSSL`](fstNoSSL.md), and Velox has both SSL-handler/version and TLS-mode settings. Review the complete effective configuration; do not infer secure or insecure transport from one enum alone.

The example only compares metadata and was source-reviewed; no TLS, network, credential, runtime or image test ran.

**External references**

- [Indy `TIdUseTLS` source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdExplicitTLSClientServerBase.pas).

<small>Created 2026-07-15</small>
