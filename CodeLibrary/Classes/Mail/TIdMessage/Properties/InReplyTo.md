---
title: InReplyTo
description: Stores explicitly supplied parent message identifiers with minimal outer-bracket repair for reply-thread header generation.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, in-reply-to, threading, message-id]
---

```Delphi
property InReplyTo: String read write;
```

### Example

```Delphi
procedure LinkReplyToParent(const ParentMessageId: String);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // "parent@example.com" is stored as "<parent@example.com>".
  Msg.InReplyTo := ParentMessageId;
end;
```

### Usage

`InReplyTo` stores explicitly supplied parent message identifiers with minimal outer-bracket repair for reply-thread header generation.

### Additional Technical Info
`InReplyTo` supplies the generated `In-Reply-To` header used to identify the parent message or messages of a reply. Velox does not infer it from [`MsgId`](MsgId.md), [`References`](References.md), addresses, Subject or the message being replied to. Reply construction code must set it deliberately.

#### Exact normalization

Both the setter and getter call Indy's `EnsureMsgIDBrackets`. That helper performs only two tests:

- if a nonempty value does not begin with `<`, prepend `<`;
- if it does not end with `>`, append `>`.

It does not trim whitespace, validate `id-left@id-right`, split multiple identifiers, remove duplicate brackets or repair brackets inside the value. For example, assigning ` parent@example.com ` stores `< parent@example.com >`, which is not equivalent to first trimming the identifier. Validate and trim external input before assignment.

RFC 5322 permits one or more message identifiers in In-Reply-To. The simplistic wrapper is reliable for one unbracketed identifier or an already well-formed complete value. If a caller supplies `id1@example id2@example`, the implementation wraps the entire string once rather than bracketing each identifier. Supply `<id1@example> <id2@example>` yourself for multiple parents.

#### Generation, parsing and lifecycle

Normal [`GenerateHeader`](../Methods/GenerateHeader.md) writes the current value to `In-Reply-To`. It does not add a value automatically and an empty property removes the generated field. [`ProcessHeaders`](../Methods/ProcessHeaders.md) reads the raw field through the same setter.

[`ClearHeader`](../Methods/ClearHeader.md) has a notable omission: it does not reset the InReplyTo backing field. A direct [`Clear`](../Methods/Clear.md) can therefore leave an old parent association in a reused message. A complete successful header parse subsequently assigns either the incoming value or empty, but an early load failure can leave retained state. Clear it explicitly when repurposing a message as a new conversation:

```Delphi
Msg.InReplyTo := '';
Msg.References := '';
```

[`NoEncode`](NoEncode.md) bypasses header generation, so property changes do not affect raw output in that mode. The property is not an ownership relationship and changing it does not update the parent message or References.

The example is source-reviewed only; no message was generated.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - getter, setter, parser and generator behavior.
- [Indy upstream: `EnsureMsgIDBrackets`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdGlobalProtocols.pas) - minimal outer-bracket implementation.
- [RFC 5322 section 3.6.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.4) - identification fields and reply-thread construction.

<small>Created 2026-07-15</small>
