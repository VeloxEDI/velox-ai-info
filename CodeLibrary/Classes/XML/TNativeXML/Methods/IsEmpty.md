---
title: IsEmpty
description: Reports whether the first top-level element is absent or clear, ignoring declarations, doctypes, comments and other outer nodes.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, empty, root, document-state]
---

```Delphi
function IsEmpty: Boolean;
```

### Example

```Delphi
procedure RequireXmlContent(Xml: TNativeXML);
begin
  if (Xml = nil) or Xml.IsEmpty then Exit;

  // Xml.Root has a name, value, attribute or child.
end;
```

### Usage

`IsEmpty` reports whether the first top-level element is absent or clear, ignoring declarations, doctypes, comments and other outer nodes.

### Additional Technical Info
`IsEmpty` gets the first top-level element through [`Root`](../Properties/Root.md). It returns true when no such element exists or when that element's `IsClear` method returns true.

A root is clear only when its Name is empty and it has no child nodes and no Value. Attributes are represented in the child list, so an attribute makes the root nonempty. A named but otherwise empty element is also nonempty.

The test deliberately ignores nodes outside the root element. A document containing an XML declaration, doctype, processing instruction or comment but no element returns true. After [`New`](New.md), the declaration exists but the unnamed clear root still makes IsEmpty true.

This is not a well-formedness or schema-validity check. It does not verify that a root name is legal, that only one top-level element exists, or that required child content is present. It performs no parsing and raises only if the underlying object graph is already invalid.

The method does not mutate state. Concurrent mutation is unsafe, and a result can become stale immediately after another call changes the tree.

The example is source-reviewed only; no document state was inspected.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream root-clear test lineage.
- [W3C XML document structure](https://www.w3.org/TR/xml/#sec-documents) - distinction between the prolog and document element.

<small>Created 2026-07-15</small>
