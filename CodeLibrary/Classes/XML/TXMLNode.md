---
title: TXMLNode
description: Represents a borrowed polymorphic NativeXML node and exposes source-backed inspection, lookup, navigation and limited tree mutation.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, nativexml, node, dom, ownership, utf8]
---

```Delphi
TXMLNode = class(TPersistent)
```

### Example

```Delphi
procedure UpdateFirstLine(Xml: TNativeXML);
var
  RootNode: TXMLNode;
  LineNode: TXMLNode;
begin
  RootNode := Xml.Root;
  if (RootNode = nil) or (RootNode.ElementCount = 0) then Exit;

  LineNode := RootNode.Elements[0];
  if LineNode.ElementType = xeElement then
    LineNode.Value := 'Processed';
end;
```

### Usage

`TXMLNode` represents a borrowed polymorphic Velox XML node and exposes source-backed inspection, lookup, navigation and limited tree mutation.

#### Ownership and lifetime

Attached nodes are owned by the document's owning node lists. Do not Free an attached node. Clearing, reloading or freeing the document invalidates its nodes; structural edits can also invalidate stored child and sibling references. [`Parent`](TXMLNode/Properties/Parent.md) and Elements results are borrowed too.

[`NodeAdd`](TXMLNode/Methods/NodeAdd.md) transfers an unattached node into a container's owning list. Velox does not defend against cross-document nodes, already attached nodes, duplicate attachment or cycles. Attach a factory-created node exactly once to a container in the same document.

### Additional Technical Info
`TXMLNode` is Velox's scripting view of the vendored NativeXML base node. A value can point to a concrete XML element, attribute, text fragment, comment, CDATA section, declaration, DTD structure, processing instruction or another supported node kind. Use [`ElementType`](TXMLNode/Methods/ElementType.md) before assuming element semantics.

Scripts cannot construct or destroy `TXMLNode` directly. Obtain references from [`TNativeXML.Root`](TNativeXML/Properties/Root.md), document traversal, [`FindNode`](TXMLNode/Methods/FindNode.md), [`NodeByName`](TXMLNode/Methods/NodeByName.md), [`Elements`](TXMLNode/Properties/Elements.md), or the document's detached-node factories. These references are normally borrowed from a `TNativeXML` document.

#### Strings and node kinds

The importer maps `UTF8String` to PascalScript `AnsiString`. Names and values therefore carry UTF-8 bytes rather than Delphi UnicodeString characters. ASCII is stable; for non-ASCII text, avoid conversions through a system ANSI code page.

[`Name`](TXMLNode/Properties/Name.md) and [`Value`](TXMLNode/Properties/Value.md) are virtual. Elements and attributes store mutable names, character nodes expose fixed kind names, and some node kinds ignore or reject name changes. Element Value is an aggregate over immediate character-data, whitespace and CDATA nodes; setting it can restructure the child list and can raise for mixed text layouts.

#### Search and filtered views

`NodeByName` searches immediate children, while FindNode recursively searches descendants and can match a raw [`FullPath`](TXMLNode/Properties/FullPath.md). Both visit the complete node list rather than an element-only view. In contrast, [`ElementCount`](TXMLNode/Properties/ElementCount.md) and Elements filter immediate children to native element nodes.

The exposed [`SourcePos`](TXMLNode/Properties/SourcePos.md) is not useful in the current product: source-position collection is compile-time disabled in the vendored unit, so it always returns zero.

The object model is mutable and unsynchronized. Do not share document or node references across concurrently executing scripts without external serialization.

The example is source-reviewed only; no XML tree was mutated.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream node model and ownership implementation lineage.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - conceptual XML information-item model.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) - names, character data and document structure rules.

<small>Created 2026-07-15</small>
