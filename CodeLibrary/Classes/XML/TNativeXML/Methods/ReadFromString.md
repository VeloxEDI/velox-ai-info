---
title: ReadFromString
description: Copies raw UTF8String bytes into a temporary stream and destructively parses them as normal or NativeXML binary content.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, utf8string, parse, string, encoding, partial-state]
---

```Delphi
procedure ReadFromString(const AValue: UTF8String);
```

### Example

```Delphi
procedure ParseSmallPayload(Xml: TNativeXML; const Payload: UTF8String);
begin
  if Xml = nil then Exit;

  Xml.ReadFromString(Payload);
end;
```

### Usage

`ReadFromString` copies raw UTF8String bytes into a temporary stream and destructively parses them as normal or Velox XML binary content.

### Additional Technical Info
`ReadFromString` copies the bytes of `AValue` into a temporary NativeXML memory stream at position zero, calls [`LoadFromStream`](LoadFromStream.md), and frees the temporary stream.

`UTF8String` is registered by the importer as `AnsiString`. The method does not encode a Unicode String at this boundary; it treats the supplied managed string length as a byte count. Ensure non-ASCII content is actually UTF-8 encoded. ASCII-only XML is unambiguous.

The call is destructive and nontransactional because LoadFromStream clears the existing tree first. Malformed XML, unsupported encoding, memory exhaustion or another parser exception can leave the document empty or partially built and invalidates all earlier node references.

Although intended for XML text, the underlying loader still performs NativeXML binary-format detection. A byte string beginning with that binary signature can take the binary branch and be wholly buffered again. Large strings therefore incur at least the input plus stream/tree allocation and should be size-limited before parsing.

No external-resource resolver is present in the reviewed normal load path, but DTD structures and deeply nested/large content remain a resource boundary. This method does not validate an XML schema or business payload.

For bytes already held in a stream, call LoadFromStream directly to avoid this temporary copy. For text held as a Unicode String, use an explicit UTF-8 encoding helper before passing it as UTF8String.

The example is source-reviewed only; no XML was parsed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream String-stream load lineage.
- [W3C XML character encoding](https://www.w3.org/TR/xml/#charencoding) - XML byte encoding requirements.
- [OWASP XML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) - untrusted input controls.

<small>Created 2026-07-15</small>
