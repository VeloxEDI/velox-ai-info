---
title: "TransportForType"
description: "Returns the protocol label for a recognized Velox transport class or an ERROR-prefixed fallback."
sidebar_position: 60
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - transport
  - protocol
  - class-name
---

```Delphi
Function TransportForType( aType : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := TransportForType('TvxTransportSFTPOut'); // 'SFTP'
end;
```

### Usage

`TransportForType` returns the protocol label for a recognized Velox transport class or an ERROR-prefixed fallback.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aType` | `string`, by value | Exact Velox transport type name. |
| Result | `string` | Protocol label below, or `ERROR: ` + unchanged input. |

### Additional Technical Info
`TransportForType` converts selected internal Velox transport class names into short protocol labels. Matching is fixed and case-sensitive. Unknown input returns `ERROR: ` followed by the supplied text.

This is a label helper. It does not load a transport, inspect its direction/configuration, test connectivity or validate that a class exists.

**Complete recognized mapping**

| Input class name(s) | Result |
|---|---|
| `TvxTransportHTTPIn`, `TvxTransportHTTPOut` | `HTTP` |
| `TvxTransportIMAP` | `IMAP` |
| `TvxTransportPOP` | `POP` |
| `TvxTransportSMTP` | `SMTP` |
| `TvxTransportFTPIn`, `TvxTransportFTPOut` | `FTP` |
| `TvxTransportSFTPIn`, `TvxTransportSFTPOut` | `SFTP` |
| `TvxTransportLANIn`, `TvxTransportLANOut` | `LAN` |
| `TvxTransportMSMQIn`, `TvxTransportMSMQOut` | `MSMQ` |
| `TvxTransportIBMMQIn`, `TvxTransportIBMMQOut` | `IBM MQ` |

**Implementation**

The common scripting import binds directly to `vxCommon.TransportForType`. The function uses exact Delphi string equalities in an `if`/`else if` chain. Inbound/outbound variants share their protocol result. The final branch concatenates `ERROR: ` and `aType`.

**Behaviour and edge cases**

- Matching is case-sensitive and untrimmed. `TvxTransportSFTPOut` matches; `tvxtransportsftpout` and a value with surrounding whitespace return an error string.
- Empty input returns exactly `ERROR: `.
- POP/IMAP/SMTP have no direction suffix in the recognized class strings; use the exact names shown.
- The return value does not preserve direction. Both inbound and outbound HTTP, FTP, SFTP, LAN, MSMQ and IBM MQ classes collapse to one label.
- An `ERROR: ...` result is normal fallback text, not a raised exception. Test for the prefix or validate the input separately when recognition matters.
- Because the fallback includes caller-supplied text, logs/UI should apply their normal output encoding and sensitive-data rules.
- A recognized label does not prove that a module is configured, enabled or reachable.

**Side effects, errors and performance**

The function is pure, performs no I/O and uses a bounded comparison chain. Ordinary string input has no domain-specific exception path.

**Related entries**

- [`GetNameForModuleType`](GetNameForModuleType.md) maps the same transport classes to broader `Inbound Transport`/`Outbound Transport` labels.
- [`GetTransportFID`](GetTransportFID.md) resolves a configured transport module name rather than a Delphi class name.

<small>Created 2026-07-15</small>
