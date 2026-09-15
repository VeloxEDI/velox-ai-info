---
title: MIMEBoundary
description: Returns the live message-owned boundary stack used by header parsing and MIME generation, including non-obvious push, regeneration and pop side effects.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, mime, boundary, stack, state]
---

```Delphi
property MIMEBoundary: TIdMIMEBoundary read;
```

### Example

```Delphi
procedure ReportCurrentBoundary(var Value: Variant);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // Observe parser/generator state; normally do not push or pop it yourself.
  Value := Msg.MIMEBoundary.Boundary;
end;
```

### Usage

`MIMEBoundary` returns the live message-owned boundary stack used by header parsing and MIME generation, including non-obvious push, regeneration and pop side effects.

### Additional Technical Info
`MIMEBoundary` returns the live [`TIdMIMEBoundary`](../../TIdMIMEBoundary.md) stack owned by the message. The property cannot be replaced, but its exposed `Push`, `Pop` and `Clear` methods mutate the parser/generator state. Do not free the returned object or retain it beyond the message lifetime.

`Boundary` and `ParentPart` describe the stack's top entry. An empty stack reports an empty boundary and parent `-1`. Nested multipart processing pushes new entries at the front and pops back to parent contexts.

#### Automatic lifecycle

- [`ClearHeader`](../Methods/ClearHeader.md) empties the stack.
- [`ProcessHeaders`](../Methods/ProcessHeaders.md) extracts a top-level `boundary` parameter and pushes it, but does not first clear existing entries. Repeated direct calls can therefore accumulate stale boundaries.
- [`GenerateHeader`](../Methods/GenerateHeader.md) clears the stack and generates a new top-level boundary whenever Encoding is `meMIME`, even if a previous header contained another value.
- Full MIME body output pushes nested boundaries as needed and pops the stack while closing them. After ordinary full serialization, the generated stack can be empty again. Headers-only generation stops before that pop phase and can leave the generated entry present.
- If body output starts without a boundary, it generates and pushes one as a fallback.

Manual stack edits do not update `ContentType`, raw [`Headers`](../Methods/ProcessHeaders.md), generated headers or part parent indexes. A mismatched boundary can produce invalid MIME, omit parts or close the wrong nesting level. Treat the property as diagnostic unless implementing a fully source-informed parser/serializer workflow.

[`NoEncode`](NoEncode.md) bypasses MIME generation and does not use this stack. [`NoDecode`](NoDecode.md) suppresses MIME parsing of the body even though ProcessHeaders may already have pushed the header boundary.

The example reads state only. It was source-reviewed without parsing, serializing or sending a message.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - stack implementation and header lifecycle.
- [Indy upstream: `IdMessageClient.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - nested generation and pop behavior.
- [RFC 2046, multipart boundary grammar](https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1) - boundary syntax and framing rules.

<small>Created 2026-07-15</small>
