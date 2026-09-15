---
title: LoadFromStream
description: Clears the document and parses a borrowed stream, with special absolute rewind and whole-stream buffering for detected binary XML.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, stream, parse, binary-xml, cursor, partial-state]
---

```Delphi
procedure LoadFromStream(Stream: TStream);
```

### Example

```Delphi
procedure LoadXmlBytes(Xml: TNativeXML; Source: TStream);
begin
  if (Xml = nil) or (Source = nil) then Exit;

  Source.Position := 0;
  Xml.LoadFromStream(Source);
end;
```

### Usage

`LoadFromStream` clears the document and parses a borrowed stream, with special absolute rewind and whole-stream buffering for detected binary XML.

### Additional Technical Info
`LoadFromStream` destructively replaces the document from a borrowed stream. It never frees `Stream`, but it advances and, on one path, rewinds its shared cursor.

The method first clears the symbol table and owned root-node list. It then constructs a NativeXML parser using `cParserChunkSize = $100` (256 bytes); the source comment claiming 64K chunks is stale. Normal XML parsing begins from the supplied current Position and proceeds to its terminal parser position.

After successful normal parsing, the document remembers detected external encoding, code page and BOM. This state drives later [`SaveToStream`](SaveToStream.md) calls. The stream is not restored. A final progress call evaluates `Stream.Size`, so a custom stream that cannot report Size can fail even after the parser has consumed it.

#### Binary XML branch

The parser also auto-detects NativeXML binary XML. On that branch it assigns `Stream.Position := 0`, ignoring the caller's initial offset, copies the complete stream into a new memory stream and invokes the binary loader. Binary input therefore requires seeking/Size support and can allocate memory proportional to the entire source.

#### Failure and security state

The operation is not transactional. Parser construction, malformed data, unsupported encodings, stream operations or memory exhaustion can leave no tree or a partially parsed tree; prior node references are already invalid. The previous external-encoding settings are only replaced after successful normal parsing, so failed parsing can combine a partial new tree with older output settings.

The reviewed parser does not resolve an external DTD through files or the network, but it accepts DTD/entity structures and exposes no input-size, nesting-depth or node-count limit. Bound untrusted input before calling, and avoid concurrent stream or document access.

The example is source-reviewed only; no stream was parsed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream stream parser and binary detection lineage.
- [W3C XML encoding detection](https://www.w3.org/TR/xml/#charencoding) - XML byte encoding rules.
- [OWASP XML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) - parser resource and trust boundaries.

<small>Created 2026-07-15</small>
