---
title: IsBodyEmpty
description: Reports whether the message-level Body.Text contains only CR, LF, tab or ordinary space, ignoring all MIME part bodies.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, body, empty, whitespace]
---

```Delphi
function IsBodyEmpty: Boolean;
```

### Example

```Delphi
procedure CheckPreamble(const Message: TIdMessage;
  var Value: Variant);
begin
  Value := Message.IsBodyEmpty;
end;
```

### Usage

`IsBodyEmpty` reports whether the message-level Body.Text contains only CR, LF, tab or ordinary space, ignoring all MIME part bodies.

### Additional Technical Info
`IsBodyEmpty` scans the combined [`Body`](../Properties/Body.md)`.Text` and returns true only when every character is one of:

- carriage return (`#13`);
- line feed (`#10`);
- horizontal tab (`#9`); or
- ordinary ASCII space (`#32`).

An empty Body is therefore empty, as is a body made only from blank/space/tab lines. Other Unicode whitespace, nonbreaking space, form feed and any visible/control character return false.

The method examines only the message-level Body, which is commonly the plain body or MIME preamble. It does not inspect `TIdText.Body` values or attachment content in MessageParts. [`GenerateHeader`](GenerateHeader.md) uses this narrow result when deciding whether exactly one MIME part can be emitted as single-part MIME.

The implementation repeatedly evaluates `Body.Text` in the loop bound and indexed expression. Since a `TStrings.Text` getter can rebuild the joined text, practical cost can exceed a simple O(character count) scan and may approach quadratic copying for large multi-line bodies. Avoid calling it repeatedly on large content.

The read has no intended mutation, but the borrowed message/body must remain stable and concurrent modification is unsupported. The source-reviewed example was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.IsBodyEmpty`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - exact four-character whitespace test.
- [Embarcadero DocWiki: `System.Classes.TStrings.Text`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Text) - combined text property used by the scan.
- [Free Pascal: `TStrings.Text`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.text.html) - compatible combined-text context; Velox uses Delphi.

<small>Created 2026-07-15</small>
