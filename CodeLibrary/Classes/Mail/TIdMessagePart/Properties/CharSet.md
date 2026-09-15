---
title: CharSet
description: Stores the part's raw charset label independently, with one-way updates from ContentType parameters but no validation or header synchronization.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, charset, encoding]
---

```Delphi
property CharSet: string read write;
```

### Example

```Delphi
procedure MarkUtf8(const Part: TIdMessagePart);
begin
  Part.CharSet := 'utf-8';
end;
```

### Usage

Stores the part's raw charset label independently, with one-way updates from ContentType parameters but no validation or header synchronization.

### Additional Technical Info
`CharSet` is an independent String field, not a live view of the internal `Content-Type` header. Assignment stores text exactly and performs no encoding conversion, canonicalization or supported-codepage validation.

Setting [`ContentType`](ContentType.md) with a nonempty `charset` parameter removes that parameter from the stored header value and writes it here. If a later ContentType assignment omits the parameter, the old CharSet remains. Assigning CharSet directly does not add/update a header parameter; the message encoder may consult both pieces later.

Changing the label never converts [`TIdText.Body`](../../TIdText/Properties/Body.md). A mismatch can label text with the wrong character set. Establish the actual body encoding and declared label together under the outbound mail policy.

Empty assignment clears only this field. Native `Assign` copies it. The operation is O(n) managed-string assignment, does no I/O and issues no explicit collection-item change notification. The part is mutable and not thread-safe.

The source-reviewed example only sets metadata; no bytes were encoded.

**External references**

- [Indy upstream: `TIdMessagePart`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - field and ContentType extraction behavior.
- [RFC 2045 section 5.1](https://www.rfc-editor.org/rfc/rfc2045.html#section-5.1) - Content-Type parameters.

<small>Created 2026-07-15</small>
