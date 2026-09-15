---
title: mfFlagged
description: Represents the IMAP Flagged system flag for a mailbox message marked for special attention.
sidebar_position: 170
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, flagged, attention, flags]
---

```Delphi
mfFlagged = 1
```

### Example

```Delphi
procedure MarkForAttentionLocally(Message: TIdMessage);
begin
  Message.Flags := Message.Flags + [mfFlagged];
end;
```

### Usage

`mfFlagged` represents the IMAP Flagged system flag for a mailbox message marked for special attention.

**Meaning and boundaries**

- It is independent of `TIdMessage.Priority`, `Importance`, SMTP priority headers and Velox log severity.
- Velox does not infer it from subject text, sender, message importance or processing errors.
- Velox's IMAP receive workflow has no dedicated Flagged action; scripts can inspect the retrieved member.
- Velox parses and serializes the standard flag, subject to server permission when a STORE is issued.

Use the flag only as a mailbox attention marker. Put business workflow state in governed data when it needs stronger semantics, audit history or cross-mailbox portability.

### Additional Technical Info
`mfFlagged` maps to IMAP `\Flagged` and represents a server/client marker for urgent or special attention. The meaning beyond that general contract is mailbox-policy or user-interface specific.

The example updates only the in-memory [`TIdMessageFlagsSet`](../../Types/Sets/TIdMessageFlagsSet.md). It is source-reviewed and is not executed by the documentation workflow.

**Local versus remote state**

Assigning `Message.Flags` does not update the server. Preserve other members with add/remove set operations, then use an explicit UID-based mailbox update where supported. Retrieved state can become stale immediately.

**Errors, performance and concurrency**

Local membership changes are constant-time. Remote mutation can fail for connection, authentication, selected-mailbox, UID or permission reasons; another client can clear or add the flag concurrently.

**Related entries**

- [`mfAnswered`](mfAnswered.md) records answer state.
- [`mfDraft`](mfDraft.md) records incomplete composition.
- [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) explains the snapshot boundary.

**External references**

- [RFC 3501 system flags](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2)
- [RFC 9051 flags message attribute](https://www.rfc-editor.org/rfc/rfc9051.html#name-flags-message-attribute)

<small>Created 2026-07-15</small>
