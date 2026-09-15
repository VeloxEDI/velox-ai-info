---
title: FullPath
description: Builds a raw slash-prefixed path from the node's current ancestor names without escaping, indexing or namespace resolution.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, path, ancestors, lookup]
---

```Delphi
property FullPath: UTF8String read;
```

### Example

```Delphi
procedure CapturePath(Node: TXMLNode);
var
  Path: UTF8String;
begin
  if Node <> nil then
    Path := Node.FullPath;
end;
```

### Usage

`FullPath` returns a slash-prefixed path made from the names of this node and its containing nodes. It does not escape names or include indexes or namespace details.

### Additional Technical Info
`FullPath` recursively concatenates each ancestor's current [`Name`](Name.md), prefixing every segment with `/`. A top-level node named `Order` returns `/Order`; its child `Line` returns `/Order/Line`.

The value is generated on demand. Renaming this node or any ancestor immediately changes it. A detached/top-level node has no Parent segment, so it still returns `/<Name>`; an unnamed node returns `/` at that level.

This is a NativeXML convenience string, not XPath and not a stable identifier. It has:

- no escaping for `/` or other characters in names;
- no sibling indices, so duplicate-name siblings have identical paths;
- no distinction between an attribute, element or other named node;
- no namespace URI resolution; prefixes remain literal text; and
- no document identity, so separate documents can produce the same path.

[`FindNode`](../Methods/FindNode.md) treats a search beginning with `/` as a case-insensitive comparison against this exact string. That means its full-path mode also inherits every ambiguity and does not implement XPath predicates or descendant syntax.

The calculation recursively walks [`Parent`](Parent.md). Cost grows with tree depth and repeated FindNode full-path comparisons rebuild paths many times. A cycle created through unsafe [`NodeAdd`](../Methods/NodeAdd.md) use can cause unbounded recursion/stack exhaustion.

The returned UTF8String is a value; the caller owns no node through it. Non-ASCII segments must remain valid UTF-8 bytes through PascalScript's AnsiString alias.

The example is source-reviewed only; no path was evaluated.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - recursive raw-path implementation.
- [W3C XPath](https://www.w3.org/TR/xpath/) - standard path language, which FullPath does not implement.
- [W3C XML namespaces](https://www.w3.org/TR/xml-names/) - namespace-name model not resolved by this property.

<small>Created 2026-07-15</small>
