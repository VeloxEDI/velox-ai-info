---
title: mfDeleted
description: Represents the IMAP Deleted flag that marks a message for later mailbox expunge rather than deleting it immediately.
sidebar_position: 168
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, deleted, expunge, flags]
---

```Delphi
mfDeleted = 2
```

### Example

```Delphi
procedure MarkDeletedLocally(Message: TIdMessage);
begin
  Message.Flags := Message.Flags + [mfDeleted];
end;
```

### Usage

`mfDeleted` represents the IMAP Deleted flag that marks a message for later mailbox expunge rather than deleting it immediately.

### Additional Technical Info
`mfDeleted` maps to IMAP `\Deleted`. It marks a mailbox message for removal by a later `EXPUNGE`; adding it to [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) does not itself delete local or remote data.

The example changes only the local snapshot. It is source-reviewed and is not executed by the documentation workflow.

**Velox receive behavior**

When `AfterReceiving` is Delete, Velox skips messages already carrying `mfDeleted`. After successful handling it batches `UID STORE +FLAGS (\Deleted)` and then calls mailbox expunge. The Move path copies handled UIDs, marks the originals Deleted and expunges them.

Expunge applies to messages marked Deleted in the selected mailbox, not inherently only those UIDs just processed by Velox. Pre-existing or concurrently marked messages can therefore be removed too. Coordinate mailbox access and retention policy before enabling delete/move processing.

**State and protocol boundaries**

- Indy parses and serializes this flag, but local set assignment sends no STORE command.
- `\Deleted` is reversible before expunge if the server permits removing the flag; after expunge, recovery is server/policy dependent.
- A successful STORE does not guarantee a later expunge succeeds, and a copy-before-delete move can leave both source and destination copies if a later step fails.
- Velox uses UIDs for its operations, but concurrent mailbox changes and server-side rules still matter.

**Errors and diagnostics**

Local membership operations are simple. Remote marking/copy/expunge can fail for connection, authentication, permission, quota, UID or selected-mailbox reasons. Preserve logs and do not report a message as removed solely because its local `Flags` set contains `mfDeleted`.

**Related entries**

- [`mfSeen`](mfSeen.md) can be set by retrieval before delete processing completes.
- [`TIdMessageFlagsSet`](../../Types/Sets/TIdMessageFlagsSet.md) explains set replacement.
- [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) is the local snapshot property.

**External references**

- [RFC 3501 Deleted and expunge semantics](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2)
- [RFC 9051 EXPUNGE](https://www.rfc-editor.org/rfc/rfc9051.html#name-expunge-command)

<small>Created 2026-07-15</small>
