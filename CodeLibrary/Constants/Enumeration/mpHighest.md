---
title: mpHighest
description: Selects Indy's highest mail-priority hint, generating urgent/high text headers and numeric X-Priority 1.
sidebar_position: 175
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, priority, highest]
---

```Delphi
mpHighest = 0
```

### Example

```Delphi
procedure ConfigureUrgentMessage(Message: TIdMessage);
begin
  Message.Priority := mpHighest;
end;
```

### Usage

`mpHighest` selects Velox's highest mail-priority hint, generating urgent/high text headers and numeric X-Priority 1.

### Additional Technical Info
`mpHighest` is the strongest high-priority hint in [`TIdMessagePriority`](../../Types/Enumerations/TIdMessagePriority.md). Generation emits `Priority: urgent`, `X-Priority: 1` and `Importance: high`.

The example is source-reviewed and is not executed by the documentation workflow.

**Behavior and boundaries**

- A smaller enum ordinal means a higher priority; do not sort these values as though larger meant more important.
- `mpHighest` and [`mpHigh`](mpHigh.md) share textual headers and differ only by X-Priority 1/2.
- Receiving text containing `urgent` or `high` maps to this extreme member, while numeric first token `1` also maps here.
- These nonuniform, advisory headers can be ignored, rewritten or used by filters. They do not change Velox execution, SMTP delivery or business severity.
- This value does not set IMAP `\Flagged` and must not be used as a security or SLA control.

**Header ownership**

Normal generation derives headers from the enum and overwrites copied raw values. `ExtraHeaders` is appended later and can create contradictory duplicates; avoid combining it with the typed property.

**Errors, performance and concurrency**

Assignment is constant-time and side-effect free until generation. Message generation remains stateful and must not run concurrently with mutation.

**Related entries**

- [`mpHigh`](mpHigh.md) is numeric level 2.
- [`mpNormal`](mpNormal.md) emits no priority headers.
- [`TIdMessage.Priority`](../../Classes/Mail/TIdMessage/Properties/Priority.md) gives the full mapping.

**External references**

- [RFC 5322 optional fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8)
- [RFC 6648 on X- prefixes](https://www.rfc-editor.org/rfc/rfc6648.html)

<small>Created 2026-07-15</small>
