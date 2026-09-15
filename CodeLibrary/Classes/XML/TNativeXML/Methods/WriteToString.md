---
title: WriteToString
description: Exposes a legacy UTF8String result declaration over a native UnicodeString method, creating an unsafe current importer ABI and encoding boundary.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, string, utf8, unicodestring, incompatibility, unsafe]
---

```Delphi
function WriteToString: UTF8String;
```

### Example

```Delphi
procedure WriteXmlSafely(Xml: TNativeXML; Output: TStream);
begin
  if (Xml = nil) or (Output = nil) then Exit;

  // Prefer the source-compatible byte-stream API.
  Xml.SaveToStream(Output);
end;
```

### Usage

Do not use `WriteToString` in the current Velox version. Its declared UTF-8 result does not match the Unicode text returned by Velox, so the call can return invalid text or fail. Use a documented XML save or stream operation with an explicit encoding instead.

### Additional Technical Info
**Do not rely on this method in the current Velox importer.** The PascalScript compiler declares an `UTF8String` return (`AnsiString`), while the current vendored native implementation returns Delphi `string` (`UnicodeString`) and is registered directly without a conversion adapter.

AnsiString and UnicodeString are managed string types with different element width/code-page semantics. A direct return-type mismatch can misinterpret the value, corrupt text or depend on platform/runtime marshaling details. This is not a documented byte-preserving API.

The native implementation itself serializes through [`SaveToStream`](SaveToStream.md) into a `TsdStringStream`, obtains raw bytes as UTF8String, then assigns them to its UnicodeString Result. With default UTF-8 output that assignment decodes bytes to Unicode text. With retained UTF-16 output, the same raw bytes are tagged as UTF-8 before conversion, so BOM and UTF-16 bytes can be corrupted even before PascalScript receives the mismatched result.

Use SaveToStream into a controlled memory stream and decode the resulting bytes according to the document's known encoding. This preserves BOMs and byte boundaries and avoids the importer return ABI.

Like SaveToStream, the underlying serialization is nontransactional and can fail for stream/memory or tree-state reasons. This page records a source-observed compatibility defect for future importer repair.

The example is source-reviewed only; the incompatible method was not executed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream method lineage predating current Unicode importer expectations.
- [W3C XML character encoding](https://www.w3.org/TR/xml/#charencoding) - byte encoding and text declaration rules.

<small>Created 2026-07-15</small>
