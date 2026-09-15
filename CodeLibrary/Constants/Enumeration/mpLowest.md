---
title: mpLowest
description: Selects Indy's lowest mail-priority hint, generating non-urgent/low text headers and numeric X-Priority 5.
sidebar_position: 177
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, priority, lowest]
---

```Delphi
mpLowest = 4
```

### Example

```Delphi
procedure ConfigureLowestPriorityMessage(Message: TIdMessage);
begin
  Message.Priority := mpLowest;
end;
```

### Usage

`mpLowest` selects Velox's lowest mail-priority hint, generating non-urgent/low text headers and numeric X-Priority 5.

### Additional Technical Info
`mpLowest` is the weakest priority hint in [`TIdMessagePriority`](../../Types/Enumerations/TIdMessagePriority.md). Generation emits `Priority: non-urgent`, `X-Priority: 5` and `Importance: low`.

The example is source-reviewed and is not executed by the documentation workflow.

**Behavior and boundaries**

- The ordinal is four but X-Priority is five because Indy emits `Ord(Priority) + 1`.
- `mpLowest` and [`mpLow`](mpLow.md) share textual headers; only X-Priority distinguishes them.
- Incoming text containing `non-urgent` or `low` maps to this extreme. The parser checks low/non-urgent before urgent/high so the `urgent` substring inside `non-urgent` is not misclassified.
- It has no effect on Velox queues, SMTP scheduling, retries, mailbox flags or delivery guarantees.

Use it only when recipients have agreed on the advisory convention. Do not encode business urgency or service priority solely in mail headers.

**Errors, performance and concurrency**

Assignment is constant-time. Header generation is stateful, can overwrite raw values and must not race with message mutation.

**Related entries**

- [`mpLow`](mpLow.md) emits numeric level 4.
- [`mpHighest`](mpHighest.md) is the opposite extreme.
- [`TIdMessage.Priority`](../../Classes/Mail/TIdMessage/Properties/Priority.md) documents parsing and headers.

**External references**

- [RFC 5322 optional fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8)
- [RFC 6648 on X- prefixes](https://www.rfc-editor.org/rfc/rfc6648.html)

<small>Created 2026-07-15</small>
