---
title: fttImplicitTLS
description: Starts SMTP, FTP, POP3 or IMAP transport encryption immediately when the TCP connection is established.
sidebar_position: 130
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, implicit, ssl, transport, security]
---

```Delphi
fttImplicitTLS = 1
```

### Example

```Delphi
function UsesTLSFromConnect(Mode: TvxTLSType): Boolean;
begin
  Result := Mode = fttImplicitTLS;
end;
```

### Usage

`fttImplicitTLS` starts SMTP, FTP, POP3 or IMAP transport encryption immediately when the TCP connection is established.

### Additional Technical Info
`fttImplicitTLS` is ordinal 1 of [`TvxTLSType`](../../Types/Enumerations/TvxTLSType.md). Velox maps it directly to Indy `utUseImplicitTLS` for SMTP, FTP, POP3 and IMAP. Setup and transport objects currently default to this mode.

TLS negotiation begins as soon as the socket connects; no plaintext protocol greeting or STARTTLS command occurs first. Indy can replace a regular/explicit port with its protocol-specific implicit TLS port. Confirm the configured port because a server expecting plaintext/STARTTLS on that port will fail the connection.

This mode does not choose the TLS version or prove certificate/hostname validation. Configure those independently and reject obsolete protocol settings. A handshake failure stops the connection.

The example only compares metadata and was source-reviewed; no TLS, network, certificate, runtime or image test ran.

**External references**

- [Indy `TIdUseTLS` source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdExplicitTLSClientServerBase.pas).

<small>Created 2026-07-15</small>
