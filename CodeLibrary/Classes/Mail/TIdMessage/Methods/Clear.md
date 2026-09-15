---
title: Clear
description: Resets header-related state first and then destroys all MIME parts and preamble lines while retaining selected message configuration and flags.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, clear, reset]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ResetCurrentMessage;
var
  Message: TIdMessage;
begin
  Message := Email;
  if Message <> nil then
    Message.Clear;
end;
```

### Usage

`Clear` resets header-related state first and then destroys all MIME parts and preamble lines while retaining selected message configuration and flags.

### Additional Technical Info
`Clear` calls [`ClearHeader`](ClearHeader.md) and then [`ClearBody`](ClearBody.md). It empties the main raw/typed header model, address collections, generated headers, MIME boundary stack, preamble Body and all message parts. Destroying the parts also invalidates borrowed part references and performs concrete attachment cleanup, including temporary-file behavior.

This is not a complete return to newly constructed state. In particular, the implementation does not reset `InReplyTo`, `IsEncoded`, `NoEncode`, `NoDecode`, `AttachmentEncoding`, `AttachmentTempDirectory` or native event/configuration fields. `ClearHeader` writes `FEncoding := meDefault` directly, so it does not invoke the setter that changes AttachmentEncoding. Reusing an object can therefore carry those values into the next message unless the script explicitly sets them.

The operation is ordered and non-transactional. If header cleanup or destruction of a part raises, later stages are not guaranteed to run and the object can be partly cleared. `ClearBody` does not recount the now-empty parts collection, so its exposed cached counts can retain earlier values until `CountParts` or `GenerateHeader` refreshes them.

Do not call `Clear` merely to release a borrowed `Email` reference; it mutates the live transport message. Complexity is proportional to owned header/body/address/part content, and the object is not thread-safe.

The source-reviewed example deliberately resets the live current message and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.Clear`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - ordered header/body reset baseline.
- [Embarcadero DocWiki: `System.Classes.TCollection.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Clear) - owned part destruction terminal.
- [Free Pascal: `TCollection.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.clear.html) - compatible collection cleanup reference; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
