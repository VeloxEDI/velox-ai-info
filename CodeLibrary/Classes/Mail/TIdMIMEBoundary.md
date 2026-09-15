---
title: TIdMIMEBoundary
description: Represents the mutable last-in-first-out boundary stack used by a message while traversing nested MIME multipart content.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, mime, boundary, stack]
---

```Delphi
TIdMIMEBoundary = class(TObject)
```

### Example

```Delphi
procedure ReadCurrentBoundary(const Message: TIdMessage;
  var Value: Variant);
begin
  if Message.MIMEBoundary.Count > 0 then
    Value := Message.MIMEBoundary.Boundary
  else
    Value := '';
end;
```

### Usage

`TIdMIMEBoundary` represents the mutable last-in-first-out boundary stack used by a message while traversing nested MIME multipart content.

### Additional Technical Info
`TIdMIMEBoundary` is Velox's script-visible view of the mutable stack used by `TIdMessage` while processing nested MIME multipart boundaries. [`Push`](TIdMIMEBoundary/Methods/Push.md) adds a boundary at the top, [`Pop`](TIdMIMEBoundary/Methods/Pop.md) removes the top, [`Clear`](TIdMIMEBoundary/Methods/Clear.md) empties the stack, [`Count`](TIdMIMEBoundary/Methods/Count.md) reports its depth, and [`Boundary`](TIdMIMEBoundary/Properties/Boundary.md) reads the current top string.

Internally, boundary strings and their native parent-part indexes are held in two separate `TStringList` instances, both with top at index zero. The parent-part property exists in native code but is not registered for scripts. Consequently, scripts can manipulate the pair through `Push`, but can read only the boundary side.

`TIdMessage.MIMEBoundary` returns its message-owned instance. Treat that value as borrowed: do not free it, and assume the reference becomes invalid with the message. Mutating it changes parser/encoder working state; application scripts should normally inspect it only when a documented flow specifically exposes a meaningful parsing context.

The implementation permits empty boundary strings and arbitrary integer parent indexes. Because empty-stack [`Boundary`](TIdMIMEBoundary/Properties/Boundary.md) and an empty top boundary both return `''`, use `Count` to distinguish them.

The two-list implementation has no locking or transactional rollback. Allocation failure partway through `Push` or `Clear` can theoretically desynchronize the parallel lists. Normal message parsing keeps them paired, but callers should avoid concurrent or speculative mutation. Push/pop at index zero are O(depth) because list entries shift.

The source-reviewed example uses the message-owned object and checks `Count` before interpreting `Boundary`; it was not runtime-tested.

**External references**

- [Velox's Indy baseline: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - upstream message/MIME context; Velox contains a modified stack implementation.
- [RFC 2046 section 5.1.1](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.1) - multipart boundary syntax and recognition rules.
- [Embarcadero DocWiki: `System.Classes.TStringList`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList) - internal list behavior.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible core list reference; Velox runs the Delphi implementation.

<small>Created 2026-07-15</small>
