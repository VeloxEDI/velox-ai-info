---
title: Priority
description: Maps a five-level message priority to three generated headers and applies precedence-based, lossy parsing of incoming conventions.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, priority, importance, x-priority]
---

```Delphi
property Priority: TIdMessagePriority read write;
```

### Example

```Delphi
procedure MarkUrgentMessage;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Priority := mpHigh;
end;
```

### Usage

Maps a five-level message priority to three generated headers and applies precedence-based, lossy parsing of incoming conventions.

### Additional Technical Info
`Priority` is a [`TIdMessagePriority`](../../../../Types/Enumerations/TIdMessagePriority.md) value used to express a delivery/display hint. It does not change Velox queue order, SMTP scheduling, retry behavior, service priority or guaranteed recipient behavior. Mail clients and gateways can ignore or rewrite these fields.

The property is a direct enum field. New and cleared messages default to `mpNormal`. Normal [`GenerateHeader`](../Methods/GenerateHeader.md) maps it as follows:

| Value | `Priority` | `X-Priority` | `Importance` |
|---|---|---|---|
| `mpHighest` | `urgent` | `1` | `high` |
| `mpHigh` | `urgent` | `2` | `high` |
| `mpNormal` | removed | removed | removed |
| `mpLow` | `non-urgent` | `4` | `low` |
| `mpLowest` | `non-urgent` | `5` | `low` |

The two high values and two low values differ only in X-Priority. Normal generation actively removes all three fields for `mpNormal`, including values copied into the raw header list before generation. `ExtraHeaders` is appended later and can reintroduce duplicate or contradictory priority fields; avoid mixing typed and raw mechanisms.

#### Incoming precedence and lossy mapping

[`ProcessHeaders`](../Methods/ProcessHeaders.md) uses the first nonempty field in this order:

1. `X-Priority`
2. `Priority`
3. `Importance`
4. `X-MSMail-Priority`
5. otherwise `mpNormal`

The selected value is lowercased. Any occurrence of `non-urgent` or `low` maps to `mpLowest`; otherwise any occurrence of `urgent` or `high` maps to `mpHighest`. This order prevents the `urgent` substring inside `non-urgent` from being misclassified.

When no recognized word occurs, only the first space-delimited token is parsed as an integer. Values 1 through 5 map in order to the enum; invalid or out-of-range values default to 3/`mpNormal`. Therefore textual `high` does not preserve `mpHigh`, and textual `low` does not preserve `mpLow`; both collapse to the extreme member. A later save can emit a different X-Priority from the incoming message.

[`NoEncode`](NoEncode.md) bypasses generation, so changing Priority has no raw-output effect in that mode. Assignment itself has no side effect and performs no policy check.

The example is source-reviewed only; no message was generated or sent.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - exact generation table, parse precedence and textual/numeric mapping.
- [RFC 5322 section 3.6.8](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8) - extension-field syntax; the generated priority fields are interoperability conventions rather than core RFC 5322 fields.

<small>Created 2026-07-15</small>
