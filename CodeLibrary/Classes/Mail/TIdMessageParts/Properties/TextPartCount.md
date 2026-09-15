---
title: TextPartCount
description: Returns the cached number of parts whose runtime PartType was mptText during the most recent CountParts scan.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, text-parts, cached-count]
---

```Delphi
property TextPartCount: Integer read;
```

### Example

```Delphi
procedure ReadTextPartCount(const Parts: TIdMessageParts;
  var Value: Variant);
begin
  Parts.CountParts;
  Value := Parts.TextPartCount;
end;
```

### Usage

`TextPartCount` returns the cached number of parts whose `PartType` was mptText during the most recent CountParts scan.

### Additional Technical Info
`TextPartCount` returns the collection's cached text-part count. [`CountParts`](../Methods/CountParts.md) resets the cache and increments it once for every item whose virtual `PartType` returns `mptText`.

Reading the property does not scan the collection. The cache initially contains zero and can be stale after additions, removals, assignments or metadata changes. Refresh immediately before reading when the result drives logic.

Classification is based on the native runtime class's `PartType`, not MIME `ContentType`. A text part can therefore count as text even when its headers contain a surprising or malformed media type. A nonempty Content-ID also contributes to Indy's separate hidden related-part count without removing it from this count.

The read is constant-time and side-effect free. Refresh is O(Count), non-transactional and not thread-safe. The source-reviewed example uses the required refresh-before-read pattern and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessageParts`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - cached field, property and classification loop.

<small>Created 2026-07-15</small>
