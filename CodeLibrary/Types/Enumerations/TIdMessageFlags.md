---
title: TIdMessageFlags
description: Names the six IMAP-style state flags stored in a TIdMessage flag set.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, mail, imap, flags, indy]
---

```Delphi
TIdMessageFlags = (mfAnswered, mfFlagged, mfDeleted, mfDraft, mfSeen, mfRecent)
```

### Example

```Delphi
procedure MarkForRemoval(Message: TIdMessage);
begin
  Message.Flags := Message.Flags + [mfSeen, mfDeleted];
end;
```

### Usage

`TIdMessageFlags` names the six IMAP-style state flags stored in a TIdMessage flag set.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`mfAnswered`](../../Constants/Enumeration/mfAnswered.md) | 0 | The message has been answered. |
| [`mfFlagged`](../../Constants/Enumeration/mfFlagged.md) | 1 | The message is marked for urgent or special attention. |
| [`mfDeleted`](../../Constants/Enumeration/mfDeleted.md) | 2 | The message is marked for removal by a later expunge operation. |
| [`mfDraft`](../../Constants/Enumeration/mfDraft.md) | 3 | Composition is not complete; the message is a draft. |
| [`mfSeen`](../../Constants/Enumeration/mfSeen.md) | 4 | The message has been read. |
| [`mfRecent`](../../Constants/Enumeration/mfRecent.md) | 5 | The server reports the message as recently arrived. |

#### Behavior and boundaries

- `mfDeleted` does not itself delete data; an IMAP EXPUNGE or equivalent server operation performs removal.
- `mfRecent` is server-managed/session-sensitive state. The current Velox IMAP server STORE path mutates the first five system flags but not `mfRecent`.
- Velox's client response parser recognizes all six flags, but its outbound flag serializer also omits `mfRecent`.
- Velox uses non-PEEK `UIDRetrieve` for full messages, so the server can set `mfSeen` before sender, recipient or custom-script filtering decides to skip a message.
- Velox Delete/Move marks handled UIDs Deleted and expunges the selected mailbox; expunge can remove other messages already carrying `\Deleted`.
- IMAP retrieval populates `UID` and `Flags`, but ordinary message-file serialization does not preserve this mailbox metadata as a portable message contract.
- Replace a complete set deliberately. If preserving unknown/current state matters, read the existing set and add or subtract only the intended members.
- Flags can change concurrently on the server. A local `TIdMessage` snapshot is not an atomic mailbox transaction.

### Additional Technical Info
`TIdMessageFlags` is the element type of `TIdMessageFlagsSet`. A message normally carries zero or more members in its `Flags` set, so test membership with `in` and add/remove members with set operations.

The meanings follow IMAP system flags. They describe mailbox state, not MIME content, delivery success or Velox log severity.

**Related Code Library entries**

- [TIdMessage.Flags](../../Classes/Mail/TIdMessage/Properties/Flags.md) - set storage, retrieval and serialization limits.
- [TIdMessage.UID](../../Classes/Mail/TIdMessage/Properties/UID.md) - related mailbox identifier state.

**External references**

- [RFC 9051 message flags](https://www.rfc-editor.org/rfc/rfc9051.html#name-flags-message-attribute) - current IMAP flag semantics.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
