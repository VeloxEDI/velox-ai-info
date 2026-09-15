---
title: References
description: Stores the complete caller-managed RFC reply-thread identifier sequence without parsing, bracket repair, encoding or automatic construction.
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, references, threading, message-id]
---

```Delphi
property References: string read write;
```

### Example

```Delphi
procedure ExtendReplyThread(const ParentReferences, ParentMessageId: String);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  if ParentReferences = '' then
    Msg.References := ParentMessageId
  else
    Msg.References := ParentReferences + ' ' + ParentMessageId;
  Msg.InReplyTo := ParentMessageId;
end;
```

### Usage

`References` stores the complete caller-managed RFC reply-thread identifier sequence without parsing, bracket repair, encoding or automatic construction.

### Additional Technical Info
`References` supplies the generated `References` header, normally an ordered sequence of message identifiers describing a conversation thread. Unlike [`MsgId`](MsgId.md) and [`InReplyTo`](InReplyTo.md), this property is a completely direct String field.

Velox/Indy does not:

- add angle brackets;
- parse or validate individual message identifiers;
- remove duplicates;
- fold an excessive thread safely;
- derive References from a parent message;
- append MsgId or InReplyTo automatically;
- MIME-encode or decode the value.

Normal [`GenerateHeader`](../Methods/GenerateHeader.md) copies the string directly to the `References` field. [`ProcessHeaders`](../Methods/ProcessHeaders.md) copies the raw field directly back. [`ClearHeader`](../Methods/ClearHeader.md) resets it to empty.

#### Constructing a reply

For a normal single-parent reply, RFC 5322 describes building the new References from the parent's References followed by the parent's Message-ID. If the parent has no References but has one In-Reply-To identifier, that identifier can precede the parent Message-ID. The example shows the common first case but assumes both inputs already contain syntactically correct bracketed identifiers.

This property does not know which input represents the parent or whether the resulting order is correct. Normalize whitespace, validate every identifier and enforce a practical length policy before assignment. Long-lived threads can exceed server/client line limits; any truncation policy should preserve the immediate parent and the identifiers your operational policy requires.

Because the setter accepts arbitrary text, never concatenate untrusted CR or LF. Structured header injection must be prevented by input validation at the trust boundary. Also avoid placing business payloads or secrets in identifiers: References is transmitted to every recipient and is commonly logged and indexed.

`ExtraHeaders` can append another References field after the typed field, producing ambiguity. [`NoEncode`](NoEncode.md) ignores this property and writes the raw Headers value instead.

The example is source-reviewed only; no message was generated. It must be combined with a new unique MsgId for the reply.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - direct References parsing, clearing and generation.
- [RFC 5322 section 3.6.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.4) - reply-thread semantics and construction rules.

<small>Created 2026-07-15</small>
