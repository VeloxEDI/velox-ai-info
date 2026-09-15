---
title: NodeNewText
description: Allocates an unattached named element and assigns nonempty UTF-8 text before ownership is transferred to a container.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, element, text, ownership, detached]
---

```Delphi
function NodeNewText(AName, AValue: UTF8String): TXMLNode;
```

### Example

```Delphi
procedure AddReference(Xml: TNativeXML; const RefValue: UTF8String);
var
  Node: TXMLNode;
begin
  Node := Xml.NodeNewText('Reference', RefValue);
  try
    Xml.Root.NodeAdd(Node);
    Node := nil;
  finally
    Node.Free;
  end;
end;
```

### Usage

`NodeNewText` allocates an unattached named element and assigns nonempty UTF-8 text before ownership is transferred to a container.

### Additional Technical Info
`NodeNewText` allocates an unattached element for this document, assigns `AName`, and assigns `AValue` only when AValue is nonempty. For an empty value it is currently equivalent to [`NodeNew`](NodeNew.md); no explicit empty character-data child is created.

The returned node has Parent nil and is not serialized until a container accepts it through [`TXMLNode.NodeAdd`](../../TXMLNode/Methods/NodeAdd.md). Ownership rules are critical: free it on the unattached failure path, but after successful attachment let the parent/document free it. Do not attach one node twice or across documents.

Name and Value are UTF-8 byte strings in this importer. The element setter stores text in NativeXML's representation and serialization escapes XML-sensitive characters. It does not make AName valid and does not validate higher-level payload constraints. Preserve UTF-8 bytes for non-ASCII text.

The factory has no try/finally around allocation, Name assignment, Value assignment or child-list setup. An exception in those steps can leak the partially created unattached node. Large AValue content is retained in the document symbol/tree state and can increase memory usage.

Assigning `Value` on an element uses NativeXML's text-node model; later child additions can create mixed content. Consumers that expect element-only structure should validate that design explicitly.

The example is source-reviewed only; no node was allocated or attached.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream text-node factory implementation lineage.
- [W3C XML character data](https://www.w3.org/TR/xml/#syntax) - element content and escaped character rules.

<small>Created 2026-07-15</small>
