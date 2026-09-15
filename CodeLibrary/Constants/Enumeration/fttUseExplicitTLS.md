---
title: fttUseExplicitTLS
description: Requests an explicit STARTTLS-style upgrade but can continue plaintext when the server reports TLS unavailable.
sidebar_position: 132
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, starttls, explicit, fallback, security]
---

```Delphi
fttUseExplicitTLS = 3
```

### Example

```Delphi
function UsesOptionalStartTLS(Mode: TvxTLSType): Boolean;
begin
  Result := Mode = fttUseExplicitTLS;
end;
```

### Usage

`fttUseExplicitTLS` requests an explicit STARTTLS-style upgrade but can continue plaintext when the server reports TLS unavailable.

### Additional Technical Info
`fttUseExplicitTLS` is ordinal 3 of [`TvxTLSType`](../../Types/Enumerations/TvxTLSType.md). It maps directly to Indy `utUseExplicitTLS` for SMTP, FTP, POP3 and IMAP. The connection begins in protocol plaintext, discovers capability and then sends the protocol-specific upgrade command.

Despite its secure-sounding name, this is the optional mode. In the installed Indy client base, “TLS not available” defaults to continuing; Velox installs no override. The session can therefore proceed plaintext when a server does not advertise TLS, creating a downgrade risk. A rejected upgrade command or failed handshake raises by default, but absence of capability does not.

Use [`fttUseRequireTLS`](fttUseRequireTLS.md) when encryption is mandatory. Certificate/hostname verification and permitted TLS versions remain separate settings.

The example only compares metadata and was source-reviewed; no STARTTLS, downgrade, network, certificate, runtime or image test ran.

**External references**

- [Indy `TIdUseTLS` source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdExplicitTLSClientServerBase.pas).

<small>Created 2026-07-15</small>
