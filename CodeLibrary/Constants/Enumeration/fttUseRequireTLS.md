---
title: fttUseRequireTLS
description: Requires a successful explicit STARTTLS-style upgrade and fails when TLS is unavailable or negotiation fails.
sidebar_position: 133
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tls, starttls, required, security, fail-closed]
---

```Delphi
fttUseRequireTLS = 2
```

### Example

```Delphi
function RequiresStartTLS(Mode: TvxTLSType): Boolean;
begin
  Result := Mode = fttUseRequireTLS;
end;
```

### Usage

`fttUseRequireTLS` requires a successful explicit STARTTLS-style upgrade and fails when TLS is unavailable or negotiation fails.

### Additional Technical Info
`fttUseRequireTLS` is ordinal 2 of [`TvxTLSType`](../../Types/Enumerations/TvxTLSType.md). It maps directly to Indy `utUseRequireTLS`. Like explicit mode, the client begins on the regular/explicit protocol port and performs the protocol upgrade.

This is the fail-closed explicit mode. Installed Indy raises when TLS capability is unavailable, the negotiation command fails or the handshake fails. Application authentication/data should proceed only after a successful encrypted upgrade.

Required TLS still does not by itself validate server identity, choose a safe protocol version or configure trust roots/client certificates. Combine it with the SSL client/certificate settings and use an endpoint/port that supports the correct STARTTLS-style command. Use implicit mode instead when the server expects TLS from connect.

The example only compares metadata and was source-reviewed; no STARTTLS, network, certificate, runtime or image test ran.

**External references**

- [Indy `TIdUseTLS` source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdExplicitTLSClientServerBase.pas).

<small>Created 2026-07-15</small>
