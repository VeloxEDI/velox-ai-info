---
title: Root
description: Returns a borrowed reference to the first top-level element, or nil when the document has no element node.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, root, element, ownership, borrowed-reference]
---

```Delphi
property Root: TXMLNode read;
```

### Example

```Delphi
procedure SetRootName(Xml: TNativeXML);
var
  RootNode: TXMLNode;
begin
  if Xml = nil then Exit;

  RootNode := Xml.Root;
  if RootNode <> nil then
    RootNode.Name := 'Envelope';
end;
```

### Usage

`Root` returns a borrowed reference to the first top-level element, or nil when the document has no element node.

### Additional Technical Info
`Root` searches the document's top-level owned list and returns the first node whose native element type is `xeElement`. The native object is a `TsdElement`; Velox exposes it through the common [`TXMLNode`](../../TXMLNode.md) surface.

The reference is borrowed. Do not Free it. [`Clear`](../Methods/Clear.md), [`New`](../Methods/New.md), any Load method or freeing the document destroys/replaces owned nodes and invalidates the reference.

A document made with the exposed constructor normally has a nonnil Root whose Name is empty. Set Name before saving. A malformed/partial load or a document containing only prolog nodes can return nil. Reading Root does not create a replacement.

If the internal tree contains multiple top-level elements, Root returns only the first; it does not report the structural error. [`FindFirst`](../Methods/FindFirst.md) and FindNext can traverse the complete top-level list and descendants.

Root.Parent is nil because it is a top-level element. Its children/attributes/text remain document-owned and are reachable through the TXMLNode surface. The property performs no schema, namespace or legal-name validation.

Store Root only for a short operation scope. Re-read it after any method that can rebuild the document, and never share it across concurrent mutation.

The example is source-reviewed only; no root was accessed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream first-element lookup lineage.
- [W3C XML document element](https://www.w3.org/TR/xml/#sec-documents) - root/document-element requirement.

<small>Created 2026-07-15</small>
