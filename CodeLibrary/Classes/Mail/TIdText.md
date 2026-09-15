---
title: TIdText
description: Implements a message-owned text MIME part with an internally owned mutable line list and text-specific part classification.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, mime, text-part, body]
---

```Delphi
TIdText = class(TIdMessagePart)
```

### Example

```Delphi
procedure PopulateTextPart(const Part: TIdText);
begin
  Part.ContentType := 'text/plain; charset="utf-8"';
  Part.Body.Clear;
  Part.Body.Add('Source-reviewed example text.');
end;
```

### Usage

`TIdText` represents a text MIME part in a message. Use its mutable `Body` lines for the text content and its MIME properties to describe the content type and encoding.

### Additional Technical Info
`TIdText` is the concrete text descendant of [`TIdMessagePart`](TIdMessagePart.md). Its [`PartType`](TIdMessagePart/Methods/PartType.md) returns `mptText`, and it adds an owned [`Body`](TIdText/Properties/Body.md) line list plus [`IsBodyEncodingRequired`](TIdText/Methods/IsBodyEncodingRequired.md).

Normal instances are owned by `TIdMessage.MessageParts`; references are borrowed. The constructor is not registered as a class-local Code Library entry, so use a part supplied/created by the surrounding Velox mail API. The object destroys its internal body when the part is destroyed.

#### Body and metadata

Body is a `TStringList` exposed as `TStrings`. The returned list is live and mutable. Its strings are Unicode; default line-break behavior comes from Delphi `TStrings`. Duplicates are permitted and order is significant.

The property setter copies through `Assign` into the existing owned list. It never adopts/frees the supplied list. Self-assignment is destructive because current Delphi `TStrings.Assign` clears the destination before enumerating the source; `Part.Body := Part.Body` empties it.

Inherited ContentType, CharSet and ContentTransfer are metadata only. Changing them does not convert Body. Keep text, charset label and transfer encoder consistent.

Native `Assign` copies Body, then inherited headers/fields. It does not copy parent linkage or encoded flag. Copying can clear/partially populate the destination if an error occurs.

#### Encoding indicator limits

`IsBodyEncodingRequired` scans only for UTF-16 code units above 127. It ignores ASCII controls, line length, transport capabilities and the selected ContentTransfer. It is a narrow non-ASCII test, not a complete MIME encoding decision.

Body edits, metadata edits and encoding are mutable/non-transactional and not thread-safe. Large bodies reside fully in memory; line operations and assignment allocate proportional to text size.

The source-reviewed example mutates an already supplied part and sends nothing.

**External references**

- [Indy upstream: `IdText.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdText.pas) - complete text-part implementation.
- [RFC 2046 section 4.1](https://www.rfc-editor.org/rfc/rfc2046.html#section-4.1) - MIME text media types.

<small>Created 2026-07-15</small>
