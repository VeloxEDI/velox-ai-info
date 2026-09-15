---
title: NodeNew
description: Allocates an empty named element associated with this document but leaves it unattached until a container accepts ownership.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, element, allocation, ownership, detached]
---

```Delphi
function NodeNew(AName: UTF8String): TXMLNode;
```

### Example

```Delphi
procedure AddEmptyItem(Xml: TNativeXML);
var
  Item: TXMLNode;
begin
  Item := Xml.NodeNew('Item');
  try
    Xml.Root.NodeAdd(Item);
    Item := nil; // Root now owns the node.
  finally
    Item.Free;   // Only frees if NodeAdd was not reached.
  end;
end;
```

### Usage

`NodeNew` allocates an empty named element associated with this document but leaves it unattached until a container accepts ownership.

### Additional Technical Info
`NodeNew` allocates a NativeXML `TsdElement`, associates it with this document's symbol table/debug owner, assigns `AName`, and returns it with an empty Value and no children or attributes.

The node is **not** added to [`Root`](../Properties/Root.md) or any other container. Its Parent is nil and it will not be serialized merely because the document created it. Call [`TXMLNode.NodeAdd`](../../TXMLNode/Methods/NodeAdd.md) on exactly one document-owned container.

Before attachment, the caller is responsible for releasing the node if later work fails. After successful NodeAdd, the parent child list owns and frees it; do not Free it separately. Adding it more than once or to an unrelated document can create duplicate ownership, invalid parent state and double-free risk because the underlying NodeAdd does not enforce a single-parent/same-owner contract.

`AName` is stored as UTF-8 bytes through the importer `UTF8String` alias. The setter does not enforce XML Name grammar. Empty, colon-containing or otherwise invalid names can be created and may produce invalid serialized XML. Validate names before allocation.

If Name assignment raises, the factory has no exception cleanup around the newly allocated node, so that node can leak. Use conservative, validated input.

The example is source-reviewed only; no node was allocated.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream node factory and ownership implementation lineage.
- [W3C XML names](https://www.w3.org/TR/xml/#NT-Name) - XML Name grammar.

<small>Created 2026-07-15</small>
