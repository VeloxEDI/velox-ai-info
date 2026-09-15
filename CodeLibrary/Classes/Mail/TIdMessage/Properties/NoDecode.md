---
title: NoDecode
description: Makes receive processing capture the remaining wire body as text instead of MIME or transfer decoding it, while still parsing headers first.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, receive, raw-body, mime, decoding]
---

```Delphi
property NoDecode: Boolean read write;
```

### Example

```Delphi
procedure LoadWithoutMIMEDecoding(const FileName: string);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.NoDecode := True;
  Msg.LoadFromFile(FileName, False);
end;
```

### Usage

`NoDecode` makes receive processing capture the remaining wire body as text instead of MIME or transfer decoding it, while still parsing headers first.

### Additional Technical Info
`NoDecode` controls receive-body processing. The default is `False`. When false, Indy selects transfer decoders, recognizes MIME boundaries and builds [`MessageParts`](MessageParts.md). When true, it captures the entire remaining message body into [`Body`](Body.md) and does not construct MIME text or attachment parts.

Headers are still read and [`ProcessHeaders`](../Methods/ProcessHeaders.md) still runs before the body. Typed header properties—including `ContentType`, `CharSet`, `Encoding` and [`MIMEBoundary`](MIMEBoundary.md)—are therefore populated even though the subsequent body is not structurally decoded.

The no-decode path captures bytes with Indy's 8-bit transport handling and converts them through the declared message charset into Delphi strings. Transfer encodings such as base64 or quoted-printable and MIME boundary lines remain as textual payload. This is **not** a byte-exact raw-message mode: line handling, dot transparency and charset conversion still occur.

#### Retained configuration

`Clear`, `ClearHeader` and clear-first [`LoadFromStream`](../Methods/LoadFromStream.md) do not reset NoDecode. Set it before loading; it survives the internal clear and affects that load. Remember to restore it explicitly if the same message object will later need decoded parts.

Combining NoDecode with [`NoEncode`](NoEncode.md) can be useful for a mostly raw textual pass-through, but it still is not lossless: headers and body are stored as strings and output uses RFC line writers. Validate size before capturing untrusted input because the whole encoded body is retained in memory rather than attachments being separated into managed files.

The example is source-reviewed only; no file was opened and no message parser was executed.

**External references**

- [Indy upstream: `TIdMessageClient.ReceiveBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - no-decode capture and charset path.
- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - default and retained property lifetime.
- [RFC 2045, transfer encodings](https://www.rfc-editor.org/rfc/rfc2045#section-6) - encodings deliberately left undecoded by this mode.

<small>Created 2026-07-15</small>
