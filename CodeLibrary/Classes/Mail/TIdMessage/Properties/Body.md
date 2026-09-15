---
title: Body
description: Exposes the message-owned line collection used as plain content, MIME preamble or raw no-decode payload depending on the processing mode.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, body, tstrings, mime, preamble]
---

```Delphi
property Body: TStrings read write;
```

### Example

```Delphi
procedure SetPlainBody(const Text: string);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Body.Clear;
  Msg.Body.Add(Text);
end;
```

### Usage

`Body` exposes the message-owned line collection used as plain content, MIME preamble or raw no-decode payload depending on the processing mode.

### Additional Technical Info
`Body` returns the live `TStringList` owned by the [`TIdMessage`](../../TIdMessage.md). The message creates it once and frees it on destruction. Do not free the returned object or cache it beyond the message/action lifetime.

Assigning another `TStrings` does not replace the owned list; the setter calls `Body.Assign(value)`. Existing lines are replaced and normal `TStrings` assignment exceptions propagate. Passing a nil object is not guarded. Direct operations such as `Clear`, `Add`, `Text` and indexed access mutate the same collection immediately.

#### Meaning depends on message layout

- For a simple `mePlainText` message, Body is the main content.
- For multipart MIME, Body is normally the preamble before the first boundary; the actual text alternatives belong in [`MessageParts`](MessageParts.md) as `TIdText` items.
- With [`ConvertPreamble`](ConvertPreamble.md) true, a nonempty Body can instead be copied into an automatically appended text part during output when the collection has other parts but no text part.
- With [`NoDecode`](NoDecode.md) true during receive, the entire remaining wire body is captured into Body without MIME or transfer decoding; no attachment/text parts are constructed.
- With [`NoEncode`](NoEncode.md) true during output, Body is the only body collection written and MessageParts are ignored.

[`ClearBody`](../Methods/ClearBody.md) destroys every message part first and then clears this list. Loading is also destructive because [`LoadFromStream`](../Methods/LoadFromStream.md) calls `Clear` before parsing.

Line storage is textual, not a byte-preserving MIME buffer. `Text` joins/splits lines using Delphi string-list conventions; save code applies RFC line writing and dot transparency. Charset and transfer transformations depend on the surrounding mode, [`CharSet`](CharSet.md) and transfer-encoding fields. Do not assume that load followed by save is byte-for-byte lossless.

The example is source-reviewed and performs no mail operation. For large bodies, repeated `Text` reads allocate combined strings; prefer bounded line operations where practical.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - owned list, assignment and clear behavior.
- [Indy upstream: `IdMessageClient.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - receive/send interpretation of Body.
- [Embarcadero DocWiki: `System.Classes.TStrings`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings) - Delphi line-collection API and `Assign` behavior.
- [Free Pascal: `TStrings`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.html) - compatible core collection reference; Velox uses Delphi.
- [RFC 2046, multipart preamble](https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1) - MIME preamble and boundary model.

<small>Created 2026-07-15</small>
