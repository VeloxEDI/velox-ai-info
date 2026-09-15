---
title: NodeByName
description: Returns the first immediate raw child whose virtual name matches case-insensitively, without recursing or filtering to elements.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, lookup, child, case-insensitive]
---

```Delphi
function NodeByName(const AName: UTF8String): TXMLNode;
```

### Example

```Delphi
procedure UpdateStatus(RootNode: TXMLNode);
var
  StatusNode: TXMLNode;
begin
  if RootNode = nil then Exit;

  StatusNode := RootNode.NodeByName('Status');
  if (StatusNode <> nil) and (StatusNode.ElementType = xeElement) then
    StatusNode.Value := 'Ready';
end;
```

### Usage

`NodeByName` returns the first immediate raw child whose name matches case-insensitively, without recursing or filtering to elements.

### Additional Technical Info
`NodeByName` scans the receiver's immediate raw child list in stored order and returns the first child whose virtual [`Name`](../Properties/Name.md) matches `AName` through NativeXML's case-insensitive UTF-8 comparison. It returns nil when there is no match.

The lookup is shallow: grandchildren are not visited. Use [`FindNode`](FindNode.md) for recursive descendant search.

The lookup is also not element-only. Attributes normally appear first in a container's raw list, followed by other node types, so an attribute can win over a child element with the same case-insensitive name. Text and comment nodes expose kind-derived names such as `Text` and `Comment`. Verify [`ElementType`](ElementType.md), or use [`ElementCount`](../Properties/ElementCount.md) and [`Elements`](../Properties/Elements.md) for immediate elements.

XML names are case-sensitive, but this implementation is not: `status` can match `Status`. Documents containing names that differ only by case can therefore produce a result different from exact XML semantics. Duplicate exact names return only the first.

`AName` is a local/raw name. A leading slash has no FullPath meaning here. Namespace prefixes remain part of the literal Name, and no namespace URI resolution or schema validation occurs.

The result is a borrowed document-owned reference. Do not Free it, and do not retain it across clear, load or structural mutation without re-resolving it. Cost is linear in the immediate all-node count.

The example is source-reviewed only; no node was looked up or updated.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - immediate child lookup and comparison implementation.
- [W3C XML names](https://www.w3.org/TR/xml/#NT-Name) - XML name syntax and case significance.

<small>Created 2026-07-15</small>
