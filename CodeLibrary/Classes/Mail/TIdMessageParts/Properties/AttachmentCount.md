---
title: AttachmentCount
description: Returns the cached number of parts whose runtime PartType was mptAttachment during the most recent CountParts scan.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, attachments, cached-count]
---

```Delphi
property AttachmentCount: Integer read;
```

### Example

```Delphi
procedure ReadAttachmentCount(const Parts: TIdMessageParts;
  var Value: Variant);
begin
  Parts.CountParts;
  Value := Parts.AttachmentCount;
end;
```

### Usage

`AttachmentCount` returns the cached number of parts whose `PartType` was mptAttachment during the most recent CountParts scan.

### Additional Technical Info
`AttachmentCount` returns the collection's cached attachment count. [`CountParts`](../Methods/CountParts.md) resets the cache and increments it once for every item whose virtual `PartType` returns `mptAttachment`.

Reading this property does not inspect the collection. Its initial value is zero, and it can remain stale after parts are added, removed, reassigned or otherwise changed. Call `CountParts` immediately before reading whenever accuracy matters.

The count is independent of whether an attachment has a filename, Content-ID, readable backing stream/file or successfully encoded data. A related inline attachment can contribute both to this exposed count and to Indy's separate hidden related-part count.

The read is constant-time and has no side effects. The refresh is O(Count), non-transactional and not thread-safe, so do not mutate the collection concurrently. The source-reviewed example follows the required refresh-before-read pattern and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessageParts`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - field, property and `CountParts` implementation.

<small>Created 2026-07-15</small>
