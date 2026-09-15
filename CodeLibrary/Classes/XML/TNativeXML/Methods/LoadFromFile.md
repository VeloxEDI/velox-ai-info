---
title: LoadFromFile
description: Opens a process-accessible file read-only with share-deny-write and destructively loads normal or NativeXML binary content.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, file, load, filesystem, parsing, binary-xml]
---

```Delphi
procedure LoadFromFile(const FileName: string);
```

### Example

```Delphi
procedure LoadXmlFile(Xml: TNativeXML; const FileName: String);
begin
  if Xml = nil then Exit;

  Xml.LoadFromFile(FileName);
end;
```

### Usage

`LoadFromFile` opens a process-accessible file read-only with share-deny-write and destructively loads normal or Velox XML binary content.

### Additional Technical Info
`LoadFromFile` opens `FileName` with `fmOpenRead or fmShareDenyWrite`, delegates to [`LoadFromStream`](LoadFromStream.md), and closes the temporary file stream in a finally block.

The path is resolved under the Velox process identity and its working/environment context. The method can read any path that account can access. Treat configuration-derived paths as an authority boundary, avoid user-controlled traversal, and do not expose sensitive file contents through later errors or output.

Opening denies other writers while this handle remains active but permits compatible readers. A missing/inaccessible path or sharing conflict raises before parsing. Once loading begins, the current document tree is cleared first; malformed XML, I/O errors or resource failures can leave it empty or partially rebuilt. There is no rollback to the preceding tree.

Content, not the filename extension, controls parsing. NativeXML binary XML is auto-detected and then buffered wholly in memory. Normal XML is parsed in 256-byte chunks. A successful load remembers source encoding, code page and BOM for future saving.

The reviewed normal XML path represents DTD nodes but contains no external-file/network entity resolver. That does not make arbitrary XML harmless: input has no exposed byte, depth or node-count quota. Check file size and trust before loading.

The example is source-reviewed only; no filesystem was accessed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream file-load implementation lineage.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) - well-formed document and encoding requirements.
- [OWASP XML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) - untrusted XML controls.

<small>Created 2026-07-15</small>
