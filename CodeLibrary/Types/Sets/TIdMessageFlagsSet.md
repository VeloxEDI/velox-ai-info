---
title: TIdMessageFlagsSet
description: Holds the six IMAP-style state flags exposed through a Velox script TIdMessage instance.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, set, mail, imap, flags]
---

```Delphi
TIdMessageFlagsSet = set of TIdMessageFlags
```

### Example

```Delphi
procedure MarkForFollowUp(Message: TIdMessage);
var
  Flags: TIdMessageFlagsSet;
begin
  Flags := Message.Flags;
  Include(Flags, mfFlagged);
  Exclude(Flags, mfDeleted);
  Message.Flags := Flags;
end;
```

### Usage

`TIdMessageFlagsSet` holds the six IMAP-style state flags exposed through a Velox script TIdMessage instance.

#### State model

- `mfAnswered`, `mfFlagged`, `mfDeleted`, `mfDraft` and `mfSeen` are ordinary IMAP system-state concepts.
- `mfDeleted` marks a message for deletion; removal normally requires a later expunge operation.
- `mfRecent` is server/session managed. The current imported Velox server mutation path does not treat it like the other five writable flags.
- Velox parses all six response flags but omits `mfRecent` when serializing outbound flag sets.
- Flags describe mailbox/message state, not MIME content, SMTP delivery status or Velox log severity.

The property function copies the complete set in both directions. Assigning `[mfFlagged]` therefore replaces the local property's other flags. The read-modify-write pattern in the example preserves every flag currently present in that object except the explicitly removed member.

#### Mailbox and persistence boundaries

Changing `Message.Flags` changes the local `TIdMessage` object. Whether and when that state reaches an IMAP server depends on the calling client operation; the property assignment is not itself an atomic server transaction. Server flags can also change concurrently after retrieval.

Velox's full-message download is non-PEEK and can set Seen before message filters finish. Its delete/move paths mark handled UIDs Deleted and then expunge the selected mailbox, which can also remove other messages already marked Deleted.

Message-file/MIME serialization does not provide a portable contract for this mailbox metadata. Persist the UID, mailbox identity and desired operation explicitly when a later flow must reconcile state.

### Additional Technical Info
`TIdMessageFlagsSet` holds zero or more [`TIdMessageFlags`](../Enumerations/TIdMessageFlags.md): [`mfAnswered`](../../Constants/Enumeration/mfAnswered.md), [`mfFlagged`](../../Constants/Enumeration/mfFlagged.md), [`mfDeleted`](../../Constants/Enumeration/mfDeleted.md), [`mfDraft`](../../Constants/Enumeration/mfDraft.md), [`mfSeen`](../../Constants/Enumeration/mfSeen.md) and [`mfRecent`](../../Constants/Enumeration/mfRecent.md). The modified Indy importer exposes the set through the read/write [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) property.

**Related Code Library entries**

- [TIdMessageFlags](../Enumerations/TIdMessageFlags.md) - all members and per-flag quirks.
- [Sets](../Sets.md) - set replacement and mutation rules.

**External references**

- [RFC 9051 message flags](https://www.rfc-editor.org/rfc/rfc9051.html#name-flags-message-attribute) - IMAP system flag semantics.
- [Free Pascal set operators](https://www.freepascal.org/docs-html/ref/refsu49.html) - compatible `in`, Include, Exclude and set combination operations.

<small>Created 2026-07-15</small>
