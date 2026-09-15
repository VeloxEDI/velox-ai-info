---
title: mpNormal
description: Selects Indy's default normal mail priority and actively removes generated priority headers.
sidebar_position: 178
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, priority, normal, default]
---

```Delphi
mpNormal = 2
```

### Example

```Delphi
procedure ConfigureNormalPriority(Message: TIdMessage);
begin
  Message.Priority := mpNormal;
end;
```

### Usage

`mpNormal` selects Velox's default normal mail priority and actively removes generated priority headers.

### Additional Technical Info
`mpNormal` is the default [`TIdMessagePriority`](../../Types/Enumerations/TIdMessagePriority.md) member. New and cleared messages use it.

During normal generation Indy removes `Priority`, `X-Priority` and `Importance` from its generated header list instead of emitting normal/3 values. This intentionally avoids unnecessary metadata that may affect spam filtering. The example is source-reviewed and is not executed by the documentation workflow.

**Behavior and quirks**

- Raw matching headers copied into the normal header list are cleared during generation.
- `ExtraHeaders` is appended later and can reintroduce priority fields despite `mpNormal`; avoid mixing typed and raw mechanisms.
- Incoming numeric token `3`, missing priority headers, invalid/out-of-range numbers and unrecognized text all resolve to Normal.
- The parser uses the first present header in this precedence: X-Priority, Priority, Importance, X-MSMail-Priority. A malformed higher-precedence field can therefore force Normal even when a lower field is meaningful.
- Normal is an absence-of-hint output, not a delivery SLA or Velox processing class.

**Errors, performance and concurrency**

Assignment is constant-time. Generation mutates the generated-header collection and must not run concurrently with other message changes.

**Related entries**

- [`mpHigh`](mpHigh.md) emits numeric level 2.
- [`mpLow`](mpLow.md) emits numeric level 4.
- [`TIdMessage.Priority`](../../Classes/Mail/TIdMessage/Properties/Priority.md) documents the full receive/generate contract.

**External references**

- [RFC 5322 optional fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8)
- [RFC 6648 on X- prefixes](https://www.rfc-editor.org/rfc/rfc6648.html)

<small>Created 2026-07-15</small>
