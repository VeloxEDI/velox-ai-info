---
title: NoEncode
description: Bypasses generated headers and MIME-part serialization so output writes only the current raw Headers collection and Body lines.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, send, raw-output, headers, mime]
---

```Delphi
property NoEncode: Boolean read write;
```

### Example

```Delphi
procedure PrepareRawForward;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // Set before loading if the encoded MIME body must remain in Body.
  Msg.NoDecode := True;
  Msg.NoEncode := True;
end;
```

### Usage

`NoEncode` bypasses generated headers and MIME-part serialisation so output writes only the current raw Headers collection and Body lines.

### Additional Technical Info
`NoEncode` selects the raw textual branch of Indy message output. Its default is `False`. When true, [`SaveToStream`](../Methods/SaveToStream.md), `SaveToFile` and clients using `SendMsg` write:

1. the current raw `Headers` list;
2. one blank separator line; and
3. Body through Indy's RFC string writer when headers-only is false.

The branch does **not** call [`GenerateHeader`](../Methods/GenerateHeader.md). Changes made only to typed properties such as Subject, recipients, Date, ContentType or Priority are not projected into output unless the script also updates raw Headers. [`MessageParts`](MessageParts.md) are ignored completely, including attachments. [`ConvertPreamble`](ConvertPreamble.md), attachment encoding and MIME boundary generation are bypassed.

Full [`SaveToStream`](../Methods/SaveToStream.md) still appends its separate final dot line after `SendMsg` returns. Headers-only output omits Body and that final marker. SMTP/stream line writing can normalize terminators and apply dot transparency, so this is not a byte-for-byte file copier.

#### Retained configuration and safe use

`Clear`, `ClearHeader` and load do not reset NoEncode. A forgotten true value can silently omit newly created body parts and send stale/raw headers. Set it only for a deliberate raw-message workflow and restore it before normal composition.

For a received encoded message, set [`NoDecode`](NoDecode.md) before loading as well; otherwise parsing moves MIME entities into MessageParts, which NoEncode later ignores. Even with both flags, charset/string conversion prevents a lossless guarantee.

Raw headers and bodies are unvalidated external content. Do not concatenate untrusted header lines without preventing CR/LF injection, and do not assume generated safety checks or normalization will run in this mode. The example merely sets fields and was not executed or sent.

**External references**

- [Indy upstream: `TIdMessageClient.SendMsg`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - exact raw-output branch.
- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - property lifetime and stream/file wrappers.
- [RFC 5322, Internet message format](https://www.rfc-editor.org/rfc/rfc5322) - header/body syntax the caller must preserve.
- [RFC 5321, transparency and termination](https://www.rfc-editor.org/rfc/rfc5321#section-4.5.2) - dot transparency and final marker context.

<small>Created 2026-07-15</small>
