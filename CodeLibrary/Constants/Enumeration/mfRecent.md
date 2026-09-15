---
title: mfRecent
description: Represents Indy's parsed IMAP Recent state, a server-managed session flag that its outbound flag serializer omits.
sidebar_position: 171
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, recent, session, flags]
---

```Delphi
mfRecent = 5
```

### Example

```Delphi
procedure CheckRecent(Message: TIdMessage; var IsRecent: Boolean);
begin
  IsRecent := mfRecent in Message.Flags;
end;
```

### Usage

`mfRecent` represents Velox's parsed IMAP Recent state, a server-managed session flag that its outbound flag serializer omits.

### Additional Technical Info
`mfRecent` maps to the IMAP4rev1 `\Recent` response flag. It is server/session managed and should be treated as observed state, not a writable message property.

The example reads the local snapshot only. It is source-reviewed and is not executed by the documentation workflow.

**Indy asymmetry**

Indy's response parser recognizes all six system flags, including `\Recent`. Its outbound `MessageFlagSetToStr` deliberately serializes only Answered, Flagged, Deleted, Draft and Seen. `mfRecent` is therefore omitted from STORE/UID STORE and append flag text even if a caller includes it in the set.

This omission matches the IMAP4rev1 rule that clients cannot alter `\Recent`. IMAP4rev2 removed `\Recent`; do not build durable processing or deduplication logic around it.

**Session and workflow boundaries**

- Recent is not the same as unread: use [`mfSeen`](mfSeen.md) for read state.
- It is not a reliable age test and does not replace message date, internal date, UID or a processing ledger.
- Different sessions/servers can report it differently, and a later fetch can lose the state.
- Assigning it to local `Message.Flags` is allowed by the set type but has no corresponding Indy outbound flag text.

**Errors, performance and concurrency**

Membership testing is constant-time. The important risk is semantic rather than computational: the snapshot is session-sensitive and nonportable. No remote workflow should report success solely because it added `mfRecent` locally.

**Related entries**

- [`mfSeen`](mfSeen.md) records the standard read state.
- [`TIdMessageFlags`](../../Types/Enumerations/TIdMessageFlags.md) documents parse/serialize asymmetry.
- [`TIdMessageFlagsSet`](../../Types/Sets/TIdMessageFlagsSet.md) stores the snapshot.

**External references**

- [RFC 3501 Recent semantics](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2)
- [RFC 9051 changes from IMAP4rev1](https://www.rfc-editor.org/rfc/rfc9051.html#name-changes-from-rfc-3501-imap4r)

<small>Created 2026-07-15</small>
