---
title: NextSibling
description: Returns the next raw sibling of a live child through its concrete parent container, with strict provenance requirements.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, sibling, navigation, ownership]
---

```Delphi
function NextSibling(ANode: TXMLNode): TXMLNode;
```

### Example

```Delphi
procedure ReadSecondChild(FirstChild: TXMLNode);
var
  Sibling: TXMLNode;
  KindName: UTF8String;
begin
  if (FirstChild = nil) or (FirstChild.Parent = nil) then Exit;

  Sibling := FirstChild.Parent.NextSibling(FirstChild);
  if Sibling <> nil then
    KindName := Sibling.ElementTypeName;
end;
```

### Usage

`NextSibling` returns the next raw sibling of a live child through its parent container, with strict provenance requirements.

### Additional Technical Info
`NextSibling` returns the node immediately after `ANode` in its parent's raw child list. The list includes attributes, text, whitespace, comments and structural nodes as well as elements. The last child returns nil.

Call the method on a concrete container, preferably exactly as `ANode.Parent.NextSibling(ANode)` after checking both references. The base `TXMLNode` implementation for non-container node classes simply returns nil. The container override dereferences `ANode` without a nil guard, so passing nil can raise an access violation.

The implementation is unusual: for a parented node it derives the index and result from `ANode.Parent`, not from the receiver's own list. Calling the method on some other container can therefore still navigate `ANode`'s actual parent. Treat that as an implementation quirk, not a supported shortcut.

A top-level node has Parent nil. The native helper then searches for it in the receiver container's child list; scripts do not have the document's top-level list object, so using this method for top-level siblings can raise `index must be >= 0`. Use [`TNativeXML.FindFirst`](../../TNativeXML/Methods/FindFirst.md) and [`FindNext`](../../TNativeXML/Methods/FindNext.md) for whole-document traversal.

`ANode` must be live and still registered in its recorded parent's list. Corrupted ownership can make an index of `-1` select child zero, and stale references can fail unpredictably. The result is borrowed and can be invalidated by mutation, clear, load or document destruction.

This is raw sibling navigation, not next-element navigation. Check [`ElementType`](ElementType.md) or use the filtered [`Elements`](../Properties/Elements.md) view.

The example is source-reviewed only; no sibling was read.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - `TsdNodeList.GetNextSiblingOf` behavior.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - ordered children and information-item kinds.

<small>Created 2026-07-15</small>
