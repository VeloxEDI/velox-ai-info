---
title: ContentDisposition
description: Exposes the parsed message-level Content-Disposition value, but current generated output does not project later typed-property edits.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, content-disposition, mime, header, quirk]
---

```Delphi
property ContentDisposition: string read write;
```

### Example

```Delphi
procedure InspectMessageDisposition(var Value: Variant);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // Useful after a load/ProcessHeaders operation.
  Value := Msg.ContentDisposition;
end;
```

### Usage

`ContentDisposition` exposes the parsed message-level Content-Disposition value, but current generated output does not project later typed-property edits.

### Additional Technical Info
`ContentDisposition` stores the message-level value parsed from the raw `Content-Disposition` header. It is a direct, unvalidated String field. [`ProcessHeaders`](../Methods/ProcessHeaders.md) replaces it from raw Headers, and [`ClearHeader`](../Methods/ClearHeader.md) resets it to empty.

#### Important output limitation

The current [`GenerateHeader`](../Methods/GenerateHeader.md) implementation never writes this typed property back to generated headers. It begins by copying raw Headers, so an existing raw `Content-Disposition` line can survive for ordinary layouts, but changing this property afterwards does not update that line. For single-part MIME, generation explicitly removes the copied message-level field so the one part can emit its own disposition.

For outgoing MIME content, set `ContentDisposition` on the relevant `TIdText` or attachment part. If a true message-level field is required, manage the raw Headers/ExtraHeaders path deliberately and verify the selected layout; `ExtraHeaders` are appended after standard generation and can introduce duplicate fields. [`NoEncode`](NoEncode.md) writes only raw Headers, not this value.

The String can include disposition parameters such as filenames, but this setter performs no quoting, parsing, sanitization or RFC validation. Do not concatenate untrusted filenames or CR/LF-bearing text into header lines. Prefer part properties that apply the encoder's normal header formatting.

This property is therefore primarily useful for inspecting parsed state and for compatibility with native Indy code that reads it. The example only reads it and was not runtime-tested.

**External references**

- [Velox-modified Indy: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - upstream field/parse shape; Velox source confirms the missing generation projection.
- [Indy upstream: part disposition output](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - the active output paths for text and attachment parts.
- [RFC 2183](https://www.rfc-editor.org/rfc/rfc2183) - Content-Disposition syntax and security considerations.

<small>Created 2026-07-15</small>
