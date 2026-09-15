---
title: CharSet
description: Stores the unvalidated MIME charset label used for body conversion and Content-Type generation, with unknown labels silently falling back to 8-bit handling.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, charset, mime, encoding, fallback]
---

```Delphi
property CharSet: string read write;
```

### Example

```Delphi
procedure ConfigureUtf8Body;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.ContentType := 'text/plain';
  Msg.CharSet := 'utf-8';
end;
```

### Usage

Stores the unvalidated MIME charset label used for body conversion and Content-Type generation, with unknown labels silently falling back to 8-bit handling.

### Additional Technical Info
`CharSet` is the message-level MIME charset label, such as `utf-8` or `us-ascii`. Its setter is a direct String assignment: no normalization, registry lookup or support check occurs at assignment time.

Normal Body serialization calls Indy's `CharsetToEncoding(CharSet)`. That helper first offers a global custom-encoding callback, then tries the known charset/code-page mapping. Unknown or unavailable labels do not normally raise; Indy silently returns its 8-bit fallback, even though the declared label can still be written to the message. A typo can therefore produce bytes that do not match the advertised charset.

#### Interaction with ContentType

Assigning [`ContentType`](ContentType.md) can change this property:

- an embedded `charset` parameter is removed from stored ContentType and replaces CharSet;
- text media with no embedded charset sets `us-ascii` only when CharSet was previously empty;
- assigning empty ContentType stores `text/plain` and resets CharSet to `us-ascii`.

Set ContentType first and CharSet second when an explicit charset must win. Conversely, a later ContentType assignment containing a charset overwrites the earlier value.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) extracts the raw Content-Type charset and defaults a missing text charset to `us-ascii`. [`GenerateHeader`](../Methods/GenerateHeader.md) writes the current label as the message Content-Type parameter for ordinary message-level output. If it is empty and the type is text, generation uses `us-ascii` locally without updating this field.

Single-part MIME takes content headers from its one part, whose own CharSet can differ. Automatic [`ConvertPreamble`](ConvertPreamble.md) copies this message value into the appended `TIdText`. Header display names and Subject use Indy's separate platform-default header charset selection, not this property.

[`NoEncode`](NoEncode.md) bypasses typed header/body generation. The example is source-reviewed only; no byte conversion or mail operation ran.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - charset extraction, defaults and header projection.
- [Indy upstream: `CharsetToEncoding`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdGlobalProtocols.pas) - lookup and silent 8-bit fallback.
- [Embarcadero DocWiki: `System.SysUtils.TEncoding`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding) - Delphi text-encoding abstraction beneath Indy adapters.
- [Free Pascal: `TEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.html) - comparable RTL encoding reference; Velox executes Delphi/Indy.
- [RFC 2046 section 4.1.2](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.2) - MIME text charset parameter semantics.

<small>Created 2026-07-15</small>
