---
title: mfAnswered
description: Represents the IMAP Answered system flag in an Indy message's local mailbox-state snapshot.
sidebar_position: 167
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, answered, flags]
---

```Delphi
mfAnswered = 0
```

### Example

```Delphi
procedure MarkAnsweredLocally(Message: TIdMessage);
begin
  Message.Flags := Message.Flags + [mfAnswered];
end;
```

### Usage

`mfAnswered` represents the IMAP Answered system flag in a Velox message's local mailbox-state snapshot.

**Meaning and boundaries**

- The flag is mailbox metadata. It does not prove that a reply was delivered, accepted or even still exists.
- Velox does not infer it from `In-Reply-To`, `References`, Sent-folder content or message text, and changing those headers does not set this flag.
- Velox's IMAP receive transport has no special Answered branch; it only retrieves the server snapshot into `TIdMessage.Flags`.
- Velox parses `\Answered` from server responses and includes it when serializing outbound flag sets.

### Additional Technical Info
`mfAnswered` is the [`TIdMessageFlags`](../../Types/Enumerations/TIdMessageFlags.md) member mapped by Indy to IMAP `\Answered`. It indicates that a reply action has been recorded for the mailbox message.

The example preserves the other local flags while adding this member. It does not send an IMAP command. It is source-reviewed and is not executed by the documentation workflow.

**Local versus remote state**

`Message.Flags` is a copied [`TIdMessageFlagsSet`](../../Types/Sets/TIdMessageFlagsSet.md). Assignment replaces the local set and is not an atomic remote update. An IMAP `UID STORE +FLAGS` or equivalent mailbox operation is required to add the server flag; another client or rule can change it concurrently.

Use a stable mailbox identity and UID, confirm the selected mailbox and server permissions, and choose add/remove rather than replace when unrelated flags must survive.

**Errors, performance and concurrency**

Reading or changing the local set is allocation-free and does not raise under ordinary typed use. A remote update can fail for connection, authentication, selected-mailbox, UID, permission or protocol reasons. Treat retrieved flags as a time-limited snapshot.

**Related entries**

- [`mfSeen`](mfSeen.md) records read state.
- [`mfFlagged`](mfFlagged.md) records special attention.
- [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) documents local storage and mailbox boundaries.

**External references**

- [RFC 3501 system flags](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2)
- [RFC 9051 flags message attribute](https://www.rfc-editor.org/rfc/rfc9051.html#name-flags-message-attribute)

<small>Created 2026-07-15</small>
