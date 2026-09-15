---
title: mpLow
description: Selects Indy's low mail-priority hint, generating non-urgent/low text headers and numeric X-Priority 4.
sidebar_position: 176
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, priority, low]
---

```Delphi
mpLow = 3
```

### Example

```Delphi
procedure ConfigureLowPriorityMessage(Message: TIdMessage);
begin
  Message.Priority := mpLow;
end;
```

### Usage

`mpLow` selects Velox's low mail-priority hint, generating non-urgent/low text headers and numeric X-Priority 4.

### Additional Technical Info
`mpLow` is the first below-normal [`TIdMessagePriority`](../../Types/Enumerations/TIdMessagePriority.md) member. Generation emits `Priority: non-urgent`, `X-Priority: 4` and `Importance: low`.

The example is source-reviewed and is not executed by the documentation workflow.

**Behavior and boundaries**

- `mpLow` differs from [`mpLowest`](mpLowest.md) only in numeric X-Priority (`4` versus `5`).
- It is an advisory presentation hint, not a request for delayed SMTP delivery, reduced Velox resources or altered retries.
- It does not change IMAP flags, message ordering or business-processing priority.
- Gateways and clients can ignore or normalize these partly nonstandard fields.

**Input and round trips**

Numeric first token `4` preserves `mpLow`. Text containing `non-urgent` or `low` maps to `mpLowest`. If numeric X-Priority is stripped but a textual low header remains, a load/save round trip can change level 4 to 5.

Generated values overwrite matching raw headers copied before generation; later `ExtraHeaders` can reintroduce conflicts.

**Errors, performance and concurrency**

Assignment is constant-time. Generation can fail through ordinary mail encoding/I/O paths and must not race with mutation.

**Related entries**

- [`mpLowest`](mpLowest.md) emits numeric level 5.
- [`mpNormal`](mpNormal.md) removes generated priority headers.
- [`TIdMessage.Priority`](../../Classes/Mail/TIdMessage/Properties/Priority.md) documents receive precedence.

**External references**

- [RFC 5322 optional fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8)
- [RFC 6648 on X- prefixes](https://www.rfc-editor.org/rfc/rfc6648.html)

<small>Created 2026-07-15</small>
