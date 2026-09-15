---
title: mpHigh
description: Selects Indy's high mail-priority hint, generating urgent/high text headers and numeric X-Priority 2.
sidebar_position: 174
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, indy, priority, high]
---

```Delphi
mpHigh = 1
```

### Example

```Delphi
procedure ConfigureImportantMessage(Message: TIdMessage);
begin
  Message.Priority := mpHigh;
end;
```

### Usage

`mpHigh` selects Velox's high mail-priority hint, generating urgent/high text headers and numeric X-Priority 2.

### Additional Technical Info
`mpHigh` is the second-highest [`TIdMessagePriority`](../../Types/Enumerations/TIdMessagePriority.md) member. During normal header generation Indy emits:

| Header | Value |
|---|---|
| `Priority` | `urgent` |
| `X-Priority` | `2` |
| `Importance` | `high` |

The example changes the direct enum property; headers are generated later when the message is sent or saved. It is source-reviewed and is not executed by the documentation workflow.

**Behavior and boundaries**

- `mpHigh` differs from [`mpHighest`](mpHighest.md) only in numeric `X-Priority` (`2` versus `1`).
- The headers are advisory display/classification hints. They do not raise Velox queue priority, accelerate SMTP, change retry policy or guarantee recipient behavior.
- It is independent of IMAP [`mfFlagged`](mfFlagged.md), which is mailbox state rather than a message header.
- Raw generated priority headers are overwritten during generation. Later `ExtraHeaders` can add duplicates or contradictions, so use one mechanism.

**Input and round trips**

Indy preserves `mpHigh` only when the first recognized priority header supplies numeric token `2`, normally `X-Priority`. Text containing `urgent` or `high` maps to `mpHighest`. If an intermediary removes `X-Priority` but leaves `Priority: urgent` or `Importance: high`, loading then saving the message can change the generated number from 2 to 1.

**Errors, performance and concurrency**

Enum assignment is constant-time and does not raise. Header generation can fail for unrelated encoding/I/O reasons after updating generated headers. Do not mutate or generate one message concurrently.

**Related entries**

- [`mpHighest`](mpHighest.md) emits numeric level 1.
- [`mpNormal`](mpNormal.md) removes generated priority headers.
- [`TIdMessage.Priority`](../../Classes/Mail/TIdMessage/Properties/Priority.md) documents parsing precedence.

**External references**

- [RFC 5322 optional fields](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.8)
- [RFC 6648 on X- prefixes](https://www.rfc-editor.org/rfc/rfc6648.html)

<small>Created 2026-07-15</small>
