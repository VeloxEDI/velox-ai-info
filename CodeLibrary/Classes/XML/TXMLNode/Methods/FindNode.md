---
title: FindNode
description: Finds the first matching descendant by case-insensitive local name or raw full path using depth-first pre-order.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, search, depth-first, full-path]
---

```Delphi
function FindNode(const NodeName: UTF8String): TXMLNode;
```

### Example

```Delphi
procedure MarkFirstItem(Xml: TNativeXML);
var
  ItemNode: TXMLNode;
begin
  if Xml.Root = nil then Exit;

  ItemNode := Xml.Root.FindNode('/Order/Items/Item');
  if ItemNode <> nil then
    ItemNode.Value := 'Processed';
end;
```

### Usage

`FindNode` finds the first matching node by case-insensitive local name or raw full path using depth-first pre-order.

### Additional Technical Info
`FindNode` searches descendants of the receiver in depth-first pre-order and returns the first match. It checks each immediate child before recursing into that child's subtree. The receiver itself is never compared.

When `NodeName` does not begin with `/`, the method compares each node's local [`Name`](../Properties/Name.md). When it begins with `/`, it compares the complete [`FullPath`](../Properties/FullPath.md). Both comparisons use NativeXML's case-insensitive UTF-8 comparison, so `item` can match `Item` even though XML names themselves are case-sensitive.

The search visits the full node list, including attributes, character data, whitespace, comments and structural nodes. Fixed kind names such as `Text` or `Comment` can therefore match non-element nodes. Use [`ElementType`](ElementType.md) to verify the result, or iterate [`Elements`](../Properties/Elements.md) when only immediate element children are appropriate.

FullPath is a raw slash concatenation. It has no escaping, sibling index or namespace-aware notation. Duplicate siblings share the same path, a name containing `/` is ambiguous, and a renamed ancestor immediately changes every descendant path. This is not XPath.

An empty search string can match a descendant whose virtual Name is empty. A nil result means no matching descendant; it does not distinguish an empty subtree from a nonmatching one.

The returned node is borrowed and remains owned by its document. Do not Free it. Search cost is linear in the visited descendant count, plus recursive path construction for full-path comparisons; a very deep tree can exhaust the Delphi call stack. Do not mutate the tree during the recursive search.

The example is source-reviewed only; no XML tree was searched.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - depth-first `FindNode` and raw path comparison implementation.
- [W3C XML names](https://www.w3.org/TR/xml/#NT-Name) - XML name syntax and case significance.
- [W3C XPath](https://www.w3.org/TR/xpath/) - standard path language, which this method does not implement.

<small>Created 2026-07-15</small>
