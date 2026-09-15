---
title: TNativeXML
description: Owns a NativeXML document tree and provides destructive parsing, depth-first traversal, node creation and encoded serialization.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, nativexml, document, parser, serialization]
---

```Delphi
TNativeXML = class(TComponent)
```

### Example

```Delphi
procedure BuildOrderDocument;
var
  Xml: TNativeXML;
  Order: TXMLNode;
begin
  Xml := TNativeXML.Create(nil);
  try
    Xml.Root.Name := 'Order';
    Order := Xml.NodeNewText('Number', 'SO-1001');
    Xml.Root.NodeAdd(Order);
    // Use SaveToStream for byte-preserving output.
  finally
    Xml.Free;
  end;
end;
```

### Usage

`TNativeXML` owns a Velox XML document tree and provides destructive parsing, depth-first traversal, node creation and encoded serialisation.

#### Ownership and invalidation

The document owns nodes after they are in its root list or a container's child list. `Root`, traversal results and node lookups are borrowed references. Clear, New, successful or failed Load operations, or freeing the document can invalidate every such reference.

[`NodeNew`](TNativeXML/Methods/NodeNew.md) and [`NodeNewText`](TNativeXML/Methods/NodeNewText.md) allocate an unattached element associated with this document. Attach it exactly once with a container's NodeAdd. If attachment never occurs, free it explicitly; after attachment, do not free it separately.

### Additional Technical Info
`TNativeXML` is the document owner for Velox's vendored NativeXML tree. It owns attached root/child nodes, a shared UTF-8 symbol table and serialization settings. The scripting surface covers document creation/reset, file/stream/String loading, file/stream output, depth-first traversal, detached element factories and the first top-level [`Root`](TNativeXML/Properties/Root.md).

This is a DOM-like component, not Delphi's `IXMLDocument`. It does not expose XPath, schemas, namespace-aware lookup, validation configuration or most NativeXML options. Names and values use the importer alias `UTF8String = AnsiString`; ASCII is stable, but scripts must preserve actual UTF-8 bytes for non-ASCII data.

#### Initial and reset state

[`Create(nil)`](TNativeXML/Methods/Create.md) creates a document with one unnamed, empty root element and no declaration. Set Root.Name before saving. [`Clear`](TNativeXML/Methods/Clear.md) destroys the tree and rebuilds that configured shape. [`New`](TNativeXML/Methods/New.md) permanently enables an XML declaration, then rebuilds the document.

Clear and New preserve output encoding/options. Successful loading remembers the source encoding, code page and detected BOM, but saving regenerates a fixed BOM policy: ANSI/UTF-8 are BOM-less and UTF-16 always has its two-byte BOM. A New after loading non-UTF-8 data can therefore create a declaration saying `utf-8` while the writer retains another encoding; the restricted scripting surface provides no property to reconcile that state. Prefer a fresh document when changing from parsed input to unrelated output.

#### Parsing and serialization

Loads clear the current tree before parsing and are nontransactional. Normal XML is parsed from the supplied cursor in actual 256-byte chunks. NativeXML binary input is auto-detected, rewound to absolute stream position zero and fully copied into memory. Errors can leave an empty or partial tree.

[`SaveToStream`](TNativeXML/Methods/SaveToStream.md) writes at the current destination cursor without truncating a stale tail. [`SaveToFile`](TNativeXML/Methods/SaveToFile.md) truncates before serialization. [`WriteToString`](TNativeXML/Methods/WriteToString.md) has a current importer/native return-type mismatch; use a stream for reliable output.

#### Security and concurrency

The reviewed load path contains no external-file/network entity resolver, but it accepts DTD structures and exposes no depth, node-count or byte quota. Apply upstream size/complexity limits to untrusted XML. The object is mutable, unsynchronized and not thread-safe. Parsing, saving and tree changes can all leave partial state on exception.

The example is source-reviewed only; no XML object was created.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream vendor source lineage.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) - XML document, encoding and well-formedness rules.
- [OWASP XML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) - untrusted XML risk and resource-limit guidance.

<small>Created 2026-07-15</small>
