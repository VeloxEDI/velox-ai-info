---
title: CountParts
description: Resets and recomputes cached text, attachment and hidden related-part counts from current runtime classifications and Content-ID values.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, count, cache]
---

```Delphi
procedure CountParts;
```

### Example

```Delphi
procedure Recount(const Parts: TIdMessageParts; var Value: Variant);
begin
  Parts.CountParts;
  Value := Parts.TextPartCount + Parts.AttachmentCount;
end;
```

### Usage

`CountParts` resets and recomputes cached text, attachment and hidden related-part counts from current current classifications and Content-ID values.

### Additional Technical Info
`CountParts` resets all three native counters to zero, then scans every current item. A nonempty `ContentID` increments the hidden related count. Virtual `PartType` increments either [`TextPartCount`](../Properties/TextPartCount.md) or [`AttachmentCount`](../Properties/AttachmentCount.md).

The cached values are not maintained automatically, so call after every structural/metadata change when fresh counts matter. The sum of exposed counts equals scanned Count for the current two-value enumeration on normal completion; related parts overlap rather than form a third category.

Recount is non-transactional: counters are cleared before scanning. An invalid item, virtual dispatch/header exception or concurrent mutation can leave partial values. Time is O(Count), and the collection is not thread-safe.

The source-reviewed example consumes values only after the refresh and was not executed.

**External references**

- [Indy upstream: `TIdMessageParts.CountParts`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact reset/scan/classify loop.

<small>Created 2026-07-15</small>
